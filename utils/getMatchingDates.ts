export interface IMatchingDate {
  date: string;
  day: string
}

export function getMatchingDatesInNextThreeWeeks(array: string[]): IMatchingDate[] {
  const daysOfWeek = array.map(item => item.split(" ")[0]);
  const today = new Date();
  const twoWeeksFromNow = new Date(today.getTime() + (21 * 24 * 60 * 60 * 1000));
  const matchingDates: IMatchingDate[] = [];

  for (let date = new Date(); date <= twoWeeksFromNow; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.toLocaleString("en-us", {weekday: "long"});
    if (daysOfWeek.includes(dayOfWeek)) {
      matchingDates.push({
        date: date.toLocaleDateString("en-US", {month: "short", day: "numeric"}),
        day: dayOfWeek
      });
    }
  }

  return matchingDates;
}