/**
 * Get the ordinal suffix for a day number (1st, 2nd, 3rd, 4th, etc.)
 */
export const getDaySuffix = (day: number): string => {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

/**
 * Format date for subject line (e.g., "27th Feb 2026, Friday")
 */
export const formatDateForSubject = (date: Date): string => {
  const day = date.getDate();
  const suffix = getDaySuffix(day);
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const weekday = date.toLocaleString("en-US", { weekday: "long" });
  return `${day}${suffix} ${month} ${year}, ${weekday}`;
};

/**
 * Generate subject line for DSR email
 */
export const generateSubject = (date: Date): string => {
  return `STATUS REPORT ${formatDateForSubject(date)}`;
};
