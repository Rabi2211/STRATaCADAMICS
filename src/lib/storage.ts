export type AuthSession = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
};

const AUTH_STORAGE_KEY = "strata-auth-session";

export function readJson<T>(key: string): T | null {
  const storage = globalThis.localStorage;
  if (!storage) {
    return null;
  }

  try {
    const rawValue = storage.getItem(key);
    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    return null;
  }
}

export function writeJson<T>(key: string, value: T): T {
  const storage = globalThis.localStorage;
  if (storage) {
    storage.setItem(key, JSON.stringify(value));
  }

  return value;
}

export function removeStorageValue(key: string) {
  const storage = globalThis.localStorage;
  if (storage) {
    storage.removeItem(key);
  }
}

export function saveAuthSession(session: AuthSession): AuthSession {
  return writeJson(AUTH_STORAGE_KEY, session);
}

export function getStoredAuthSession(): AuthSession | null {
  return readJson<AuthSession>(AUTH_STORAGE_KEY);
}

export function clearAuthSession() {
  removeStorageValue(AUTH_STORAGE_KEY);
}
