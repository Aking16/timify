export type TimeStorageType = {
  total: number;
  savedTimes: number[];
};

export function getTimeStorage(): TimeStorageType | null {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem("saved-times");

  if (!data) return null;

  return JSON.parse(data);
}

export function saveTimeStorage(data: TimeStorageType) {
  localStorage.setItem("saved-times", JSON.stringify(data));
}

export function deleteTimeStorage() {
  localStorage.removeItem("saved-times");
}

export type RunningTimerType = {
  isRunning: boolean;
  seconds: number;
};

export function getRunningTimerStorage(): RunningTimerType | null {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem("running-timer");

  if (!data) return null;

  return JSON.parse(data);
}

export function saveRunningTimerStorage(data: RunningTimerType) {
  if (typeof window === "undefined") return null;

  localStorage.setItem("running-timer", JSON.stringify(data));

  window.dispatchEvent(new Event("runningTimerUpdated"));
}

export function deleteRunningTimerStorage() {
  if (typeof window === "undefined") return null;

  localStorage.removeItem("running-timer");

  window.dispatchEvent(new Event("runningTimerUpdated"));
}

export type RunningCountdownType = {
  isRunning: boolean;
  id: string;
  title: string;
  duration: number;
  remaining: number;
  startedAt: number;
};

export function getRunningCountdownStorage(): RunningCountdownType | null {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem("running-countdown");

  if (!data) return null;

  return JSON.parse(data);
}

export function saveRunningCountdownStorage(data: RunningCountdownType) {
  if (typeof window === "undefined") return null;

  localStorage.setItem("running-countdown", JSON.stringify(data));

  window.dispatchEvent(new Event("runningCountdownUpdated"));
}

export function deleteRunningCountdownStorage() {
  if (typeof window === "undefined") return null;

  localStorage.removeItem("running-countdown");

  window.dispatchEvent(new Event("runningCountdownUpdated"));
}
