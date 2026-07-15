const WEEKDAYS_SW = ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi'];
const MONTHS_SW = [
  'Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni',
  'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba',
];

/** Formats a date as "Jumatatu, 13 Julai" — always the real current date. */
export function formatSwahiliDate(date = new Date()) {
  const weekday = WEEKDAYS_SW[date.getDay()];
  const month = MONTHS_SW[date.getMonth()];
  return `${weekday}, ${date.getDate()} ${month}`;
}
