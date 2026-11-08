import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
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

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

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

  saveAuthSession(payload);
  return payload;
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

  saveAuthSession(payload);
  return payload;
}

export function getCurrentSession() {
  return getStoredAuthSession();
}

export async function logOut() {
  if (auth && isFirebaseConfigured()) {
    await signOut(auth);
  }

  clearAuthSession();
}
