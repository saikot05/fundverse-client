/**
 * Calculates the number of days remaining until a given target date.
 * Returns 0 if the target date is in the past.
 */
export const getDaysRemaining = (deadlineStr: string): number => {
  const diffTime = new Date(deadlineStr).getTime() - Date.now();
  if (diffTime <= 0) return 0;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Formats credit amount as standard currency string e.g. "1,500 Credits"
 */
export const formatCredits = (amount: number): string => {
  return `${amount.toLocaleString()} Credits`;
};
