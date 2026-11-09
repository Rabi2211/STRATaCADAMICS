import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { resolveApiBaseUrl } from "./api-config";
import { auth, isFirebaseConfigured } from "./firebase";
import { clearAuthSession, getStoredAuthSession, saveAuthSession, type AuthSession } from "./storage";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "customer" | "brand-owner" | "admin" | string;
};

type AuthRequestBody = {
  email: string;
  password: string;
  name?: string;
  role?: string;
};

const API_BASE_URL = resolveApiBaseUrl(import.meta.env.VITE_API_URL);

export function ensureAuthSession(session: AuthSession | null | undefined): AuthSession {
  if (!session || !session.token || !session.user) {
    throw new Error("Authentication response was empty.");
  }

  return session;
}

export function formatAuthError(error: unknown): string {
  const firebaseAuthCode =
    typeof error === "object" && error !== null && "code" in error && typeof (error as { code?: unknown }).code === "string"
      ? (error as { code: string }).code
      : null;

  if (error instanceof Error && error.message === "Firebase is not configured.") {
    return "Firebase Auth is not configured. Add your Firebase web config values and enable Email/Password in Authentication > Sign-in method.";
  }

  switch (firebaseAuthCode) {
    case "auth/configuration-not-found":
    case "auth/operation-not-allowed":
      return "Email/password sign-in is not enabled in Firebase Authentication. Enable it in Authentication > Sign-in method.";
    case "auth/invalid-api-key":
    case "auth/app-deleted":
      return "Firebase is misconfigured. Check your Firebase web app values in the project environment.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Choose a stronger password with at least 6 characters.";
    case "auth/requires-recent-login":
      return "Please sign out and sign back in to continue.";
    default:
      if (error instanceof Error && error.message) {
        return error.message;
      }

      return "Unable to complete authentication.";
  }
}

export function getRoleForAuth(role?: string): string {
  const normalizedRole = (role ?? "customer").trim().toLowerCase().replace(/[_\s]+/g, "-");

  if (normalizedRole === "brand-owner") {
    return "brand-owner";
  }

  if (normalizedRole === "admin") {
    return "admin";
  }

  return "customer";
}

export function getPostLoginPath(role?: string): string {
  const authRole = getRoleForAuth(role);

  if (authRole === "admin") {
    return "/market/overview";
  }

  if (authRole === "brand-owner") {
    return "/studio/overview";
  }

  return "/";
}

function normalizeRole(role: string): string {
  return role.toUpperCase().replace(/-/g, "_");
}

function sessionRole(role: string): string {
  return normalizeRole(role).toLowerCase().replace(/_/g, "-");
}

async function requestJson<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  let payload: any = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.error ?? "Authentication request failed.");
  }

  return payload as T;
}

async function createFirebaseSession(input: AuthRequestBody, mode: "login" | "register"): Promise<AuthSession> {
  if (!auth || !isFirebaseConfigured()) {
    throw new Error("Firebase is not configured.");
  }

  try {
    const credentials = mode === "register"
      ? await createUserWithEmailAndPassword(auth, input.email, input.password)
      : await signInWithEmailAndPassword(auth, input.email, input.password);

    const requestedName = input.name?.trim() || input.email.split("@")[0] || "User";

    if (mode === "register" && credentials.user.displayName !== requestedName) {
      await updateProfile(credentials.user, { displayName: requestedName });
    }

    const token = await credentials.user.getIdToken();
    const session: AuthSession = {
      token,
      user: {
        id: credentials.user.uid,
        email: credentials.user.email ?? input.email,
        name: credentials.user.displayName || requestedName,
        role: sessionRole(input.role ?? "customer"),
      },
    };

    saveAuthSession(session);
    return session;
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
}

export async function registerUser(input: AuthRequestBody): Promise<AuthSession> {
  const role = getRoleForAuth(input.role ?? "customer");

  if (auth && isFirebaseConfigured()) {
    return createFirebaseSession({ ...input, role }, "register");
  }

  const payload = await requestJson<AuthSession>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      ...input,
      role: normalizeRole(role),
    }),
  });

  const session = ensureAuthSession(payload);
  saveAuthSession(session);
  return session;
}

export async function loginUser(input: Pick<AuthRequestBody, "email" | "password" | "role">): Promise<AuthSession> {
  const role = getRoleForAuth(input.role ?? "customer");

  if (auth && isFirebaseConfigured()) {
    return createFirebaseSession({ ...input, role }, "login");
  }

  const payload = await requestJson<AuthSession>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      ...input,
      role: normalizeRole(role),
    }),
  });

  const session = ensureAuthSession(payload);
  saveAuthSession(session);
  return session;
}

export function getCurrentSession() {
  return getStoredAuthSession();
}

export async function resetPassword(email: string): Promise<void> {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    throw new Error("Please enter your email address to reset your password.");
  }

  if (!auth || !isFirebaseConfigured()) {
    throw new Error("Firebase is not configured.");
  }

  try {
    await sendPasswordResetEmail(auth, trimmedEmail);
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
}

export async function logOut() {
  if (auth && isFirebaseConfigured()) {
    await signOut(auth);
  }

  clearAuthSession();
}
