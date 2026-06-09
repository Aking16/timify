export type TimeStorageType = {
  total: number,
  savedTimes: number[]
}

export function getTimeStorage( ): TimeStorageType | null {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem("saved-times")

  if (!data) return null

  return JSON.parse(data)
}

export function saveTimeStorage(data: TimeStorageType) {
  localStorage.setItem("saved-times", JSON.stringify(data))
}

export function deleteTimeStorage() {
  localStorage.removeItem("saved-times")
}