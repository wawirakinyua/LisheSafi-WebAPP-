/**
 * defaultAppState.js
 * ---------------------------------------------------------------------------
 * The shape of the plaintext application state that lives ONLY in React
 * memory on the client. This exact object is what gets passed to
 * encryptJSON() before it is ever written to the (mock) cloud ledger — the
 * cloud never sees this shape, only its ciphertext.
 * ---------------------------------------------------------------------------
 */
export function buildDefaultAppState(displayName = 'there') {
  return {
    profile: {
      displayName,
      weightStartKg: 58,
      weightCurrentKg: 58,
      weightTargetKg: 55,
    },
    today: {
      dateLabel: new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' }),
      caloriesConsumed: 0,
      caloriesTarget: 1800,
      waterLitres: 0,
      proteinGramsToday: 0,
      proteinGoalGrams: 60,
    },
    foodLog: [],
    calendarDays: Array(35).fill(null),
    todayIndex: new Date().getDate() - 1,
    progressHistory: {
      calories7day: [0, 0, 0, 0, 0, 0, 0],
      weight7day: [58, 58, 58, 58, 58, 58, 58],
      streakDays: 0,
      onTargetDaysThisMonth: 0,
      avgWaterLitres: 0,
    },
  };
}
