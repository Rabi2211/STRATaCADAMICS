import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export type StoreSettings = {
  storeName: string;
  supportEmail: string;
  storeDescription: string;
  shippingPolicy: string;
  notifications: {
    orderConfirmations: boolean;
    shippingUpdates: boolean;
    orderDelivered: boolean;
    customerInquiries: boolean;
  };
};

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "STRATA Market",
  supportEmail: "support@stratamarket.com",
  storeDescription: "A curated store for independent brands creating high-quality, timeless products.",
  shippingPolicy: "Free shipping on orders over R100. Ships within 2–5 business days.",
  notifications: {
    orderConfirmations: true,
    shippingUpdates: true,
    orderDelivered: false,
    customerInquiries: true,
  },
};

export async function loadStoreSettings(): Promise<StoreSettings> {
  if (!db) return DEFAULT_STORE_SETTINGS;
  try {
    const snapshot = await getDoc(doc(db, "storeSettings", "market"));
    if (!snapshot.exists()) return DEFAULT_STORE_SETTINGS;
    const data = snapshot.data();
    return {
      ...DEFAULT_STORE_SETTINGS,
      ...data,
      notifications: { ...DEFAULT_STORE_SETTINGS.notifications, ...(data.notifications ?? {}) },
    } as StoreSettings;
  } catch (error) {
    console.warn("Unable to load store settings", error);
    return DEFAULT_STORE_SETTINGS;
  }
}

export async function saveStoreSettings(settings: StoreSettings): Promise<void> {
  if (!db) throw new Error("Firestore is unavailable.");
  await setDoc(doc(db, "storeSettings", "market"), settings, { merge: true });
}
