import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  getTimeStorage,
  saveTimeStorage,
  deleteTimeStorage,
  getRunningTimerStorage,
  saveRunningTimerStorage,
  deleteRunningTimerStorage,
  getRunningCountdownStorage,
  saveRunningCountdownStorage,
  deleteRunningCountdownStorage,
} from "@/lib/time-local-storage";

describe("time-local-storage", () => {
  let store: Record<string, string> = {};

  const localStorageMock = {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };

  beforeEach(() => {
    store = {};
    vi.stubGlobal("localStorage", localStorageMock);
    vi.stubGlobal("window", { localStorage: localStorageMock, addEventListener: vi.fn(), dispatchEvent: vi.fn() });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe("saved-times", () => {
    it("returns null when no data in localStorage", () => {
      expect(getTimeStorage()).toBeNull();
    });

    it("saves and retrieves time storage data", () => {
      const data = { total: 3600, savedTimes: [600, 1200, 1800] };
      saveTimeStorage(data);
      expect(getTimeStorage()).toEqual(data);
    });

    it("overwrites existing saved times", () => {
      saveTimeStorage({ total: 100, savedTimes: [50] });
      saveTimeStorage({ total: 200, savedTimes: [100, 100] });
      expect(getTimeStorage()).toEqual({ total: 200, savedTimes: [100, 100] });
    });

    it("deletes time storage", () => {
      saveTimeStorage({ total: 3600, savedTimes: [3600] });
      deleteTimeStorage();
      expect(getTimeStorage()).toBeNull();
    });

    it("returns null when JSON is invalid", () => {
      store["saved-times"] = "not-valid-json";
      expect(() => getTimeStorage()).toThrow();
    });
  });

  describe("running-timer", () => {
    it("returns null when no data in localStorage", () => {
      expect(getRunningTimerStorage()).toBeNull();
    });

    it("saves and retrieves running timer data", () => {
      const data = { isRunning: true, seconds: 1500 };
      saveRunningTimerStorage(data);
      expect(getRunningTimerStorage()).toEqual(data);
    });

    it("saves stopped timer state", () => {
      const data = { isRunning: false, seconds: 3600 };
      saveRunningTimerStorage(data);
      expect(getRunningTimerStorage()).toEqual(data);
    });

    it("deletes running timer storage", () => {
      saveRunningTimerStorage({ isRunning: true, seconds: 500 });
      deleteRunningTimerStorage();
      expect(getRunningTimerStorage()).toBeNull();
    });

    it("dispatches event on save", () => {
      const dispatchSpy = vi.fn();
      vi.stubGlobal("window", {
        localStorage: localStorageMock,
        dispatchEvent: dispatchSpy,
      });

      saveRunningTimerStorage({ isRunning: true, seconds: 100 });
      expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
      expect(dispatchSpy.mock.calls[0][0].type).toBe("runningTimerUpdated");
    });

    it("dispatches event on delete", () => {
      const dispatchSpy = vi.fn();
      vi.stubGlobal("window", {
        localStorage: localStorageMock,
        dispatchEvent: dispatchSpy,
      });

      deleteRunningTimerStorage();
      expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
      expect(dispatchSpy.mock.calls[0][0].type).toBe("runningTimerUpdated");
    });
  });

  describe("running-countdown", () => {
    it("returns null when no data in localStorage", () => {
      expect(getRunningCountdownStorage()).toBeNull();
    });

    it("saves and retrieves running countdown data", () => {
      const data = {
        isRunning: true,
        id: "countdown-1",
        title: "Test Countdown",
        duration: 300,
        remaining: 250,
        startedAt: Date.now() - 50000,
      };
      saveRunningCountdownStorage(data);
      expect(getRunningCountdownStorage()).toEqual(data);
    });

    it("deletes running countdown storage", () => {
      saveRunningCountdownStorage({
        isRunning: true,
        id: "cd-1",
        title: "",
        duration: 100,
        remaining: 50,
        startedAt: Date.now(),
      });
      deleteRunningCountdownStorage();
      expect(getRunningCountdownStorage()).toBeNull();
    });

    it("dispatches event on save", () => {
      const dispatchSpy = vi.fn();
      vi.stubGlobal("window", {
        localStorage: localStorageMock,
        dispatchEvent: dispatchSpy,
      });

      saveRunningCountdownStorage({
        isRunning: true,
        id: "cd-1",
        title: "",
        duration: 100,
        remaining: 50,
        startedAt: Date.now(),
      });
      expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
      expect(dispatchSpy.mock.calls[0][0].type).toBe("runningCountdownUpdated");
    });
  });

  describe("SSR safety", () => {
    it("returns null for getTimeStorage when window is undefined", () => {
      vi.unstubAllGlobals();
      const originalWindow = globalThis.window;
      // @ts-expect-error - testing SSR scenario
      delete globalThis.window;
      try {
        expect(getTimeStorage()).toBeNull();
        expect(getRunningTimerStorage()).toBeNull();
        expect(getRunningCountdownStorage()).toBeNull();
      } finally {
        globalThis.window = originalWindow;
      }
    });

    it("returns null for save functions when window is undefined", () => {
      vi.unstubAllGlobals();
      const originalWindow = globalThis.window;
      // @ts-expect-error - testing SSR scenario
      delete globalThis.window;
      try {
        expect(saveRunningTimerStorage({ isRunning: true, seconds: 100 })).toBeNull();
        expect(saveRunningCountdownStorage({
          isRunning: true, id: "cd-1", title: "",
          duration: 100, remaining: 50, startedAt: Date.now(),
        })).toBeNull();
        deleteRunningTimerStorage();
        deleteRunningCountdownStorage();
        deleteTimeStorage();
      } finally {
        globalThis.window = originalWindow;
      }
    });
  });
});
