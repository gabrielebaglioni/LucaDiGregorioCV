/**
 * Browser-reported IANA timezone (e.g. "Europe/Berlin") from the user's system.
 */
export function getBrowserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

/**
 * Short label for UI: last segment of IANA id, underscores → spaces.
 * e.g. "Europe/Berlin" → "Berlin", "America/New_York" → "New York"
 */
export function formatCityLabelFromTimeZone(timeZone) {
  if (!timeZone) return "Local";
  if (timeZone === "UTC") return "UTC";

  const segments = timeZone.split("/");
  if (segments.length === 0) return timeZone;

  const tail = segments[segments.length - 1].replace(/_/g, " ");

  if (timeZone.startsWith("Etc/")) {
    return tail;
  }

  return tail;
}

export function formatLocalClockTime(date = new Date()) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }).format(date);
}
