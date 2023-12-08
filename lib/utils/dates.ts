export function determineDay() {
  const today = new Date();
  const dec1 = new Date("December 1 2023");
  const dec26 = new Date("December 26 2023");

  if (today < dec1) {
    return -Number.MAX_SAFE_INTEGER;
  }
  if (today > dec26) {
    return Number.MAX_SAFE_INTEGER;
  }

  return today.getDate();
}

export function currentDay() {
  return Math.min(25, Math.max(0, determineDay()));
}