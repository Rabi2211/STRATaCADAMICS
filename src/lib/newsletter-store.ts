import { resolveApiBaseUrl } from "./api-config";
import { getStoredAuthSession } from "./storage";

export type NewsletterSubscriptionResult = {
  ok: boolean;
  alreadySubscribed?: boolean;
};

export type NewsletterCampaign = {
  id: string;
  subject: string;
  content: string;
  sent: number;
  failed: number;
  recipientCount: number;
  createdAt: string | null;
};

const API_BASE_URL = resolveApiBaseUrl(import.meta.env.VITE_API_URL);

async function newsletterRequest<T>(path: string, init: RequestInit): Promise<T> {
  const session = getStoredAuthSession();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
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
    throw new Error(payload?.error ?? "Newsletter request failed.");
  }

  return payload as T;
}

export function subscribeToNewsletter(email: string): Promise<NewsletterSubscriptionResult> {
  return newsletterRequest<NewsletterSubscriptionResult>("/api/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function sendNewsletterUpdate(input: { subject: string; content: string }): Promise<{ ok: boolean; sent: number; failed: number }> {
  return newsletterRequest("/api/newsletter/send", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function fetchNewsletterCampaigns(): Promise<{ campaigns: NewsletterCampaign[] }> {
  return newsletterRequest<{ campaigns: NewsletterCampaign[] }>("/api/newsletter/campaigns", {
    method: "GET",
  });
}
