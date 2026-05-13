// Utility function to calculate duration from start time to now or end time
export function calculateDuration({
  startTime,
  endTime,
  showFormatted = false,
}: {
  startTime: Date | null;
  endTime?: Date | null;
  showFormatted: boolean;
}): string | number {
  if (!startTime) return 0;

  const end = endTime || new Date();

  const calculated = Math.floor((end.getTime() - startTime.getTime()) / 1000);

  if (showFormatted) {
    return formatDuration(calculated);
  }

  return calculated;
}

// Format duration for display
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}
