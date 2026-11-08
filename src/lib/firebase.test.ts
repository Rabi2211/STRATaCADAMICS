import { describe, expect, it } from "vitest";
import { getFirebaseService, isFirebaseConfigured } from "./firebase";

describe("firebase config", () => {
  it("allows a missing measurement id", () => {
    expect(
      isFirebaseConfigured({
        apiKey: "AIzaSyB0FEMK8GVYi2QT1-_JIAxVdg81MdL7_Gs",
        authDomain: "stratacadamics.firebaseapp.com",
        projectId: "stratacadamics",
        storageBucket: "stratacadamics.firebasestorage.app",
        messagingSenderId: "1049637491870",
        appId: "1:1049637491870:web:d27bee9a39ea46a327978f",
        measurementId: undefined,
      })
    ).toBe(true);
  });

  it("rejects incomplete configs", () => {
    expect(
      isFirebaseConfigured({
        apiKey: "AIzaSyB0FEMK8GVYi2QT1-_JIAxVdg81MdL7_Gs",
        authDomain: "",
        projectId: "stratacadamics",
        storageBucket: "stratacadamics.firebasestorage.app",
        messagingSenderId: "1049637491870",
        appId: "1:1049637491870:web:d27bee9a39ea46a327978f",
        measurementId: undefined,
      })
    ).toBe(false);
  });

  it("returns null when a Firebase service is unavailable", () => {
    expect(
      getFirebaseService(() => {
        throw new Error("Service storage is not available");
      })
    ).toBeNull();
  });
});
