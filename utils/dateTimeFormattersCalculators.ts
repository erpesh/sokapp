import {Timestamp} from "firebase/firestore";
import {ILessonDaysTimes, TDateLocale, TLocale} from "./types";

export interface ILessonTime {
  time: string,
  isReserved: boolean
}

export interface ILessonDateInfo {
  date: Date,
  day: string,
  times: ILessonTime[],
  slots: number,
  isReserved: boolean
}

export interface IAppointment {
  price: number
  studentName: string
  studentAge: number
  telNumber: string
  docId: string
  datetime: Timestamp
  paid: boolean
  teacherUid: string
  uid: string
}

export function getTimestamp(fullDate: Date, dateString: string, timeString: string): Timestamp {
  const date = new Date(`${dateString} ${fullDate.getFullYear()} ${timeString}`);
  return Timestamp.fromMillis(date.getTime());
}

function checkIsReserved(reservedAppointments: Date[], dateLoop: Date, lessonTime: string) {
  return reservedAppointments.some(item => {
    return item.getDate() === dateLoop.getDate() &&
      item.toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'}) === lessonTime
  })
}

export default function generateLessonDateInfo(
  lessonDates: ILessonDaysTimes[],
  appointments: IAppointment[],
): ILessonDateInfo[] {
  // Get the current date and calculate the start and end dates of the three-week period
  const currentDate = new Date();
  const dateInOneDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
  const threeWeeksFromNow = new Date(dateInOneDay.getTime() + (20 * 24 * 60 * 60 * 1000));
  const daysOfWeek = lessonDates.map(item => item.day);
  const reservedDates = appointments.map(item => item.datetime.toDate());

  // Create an array to store the lesson date info objects
  const lessonDateInfoArray: ILessonDateInfo[] = [];

  // Loop through the dates in the three-week period
  for (let dateLoop = dateInOneDay; dateLoop <= threeWeeksFromNow; dateLoop.setDate(dateLoop.getDate() + 1)) {
    // Check if the current date is one of the days of the week in the `daysOfWeek` array
    const dayOfWeek = dateLoop.toLocaleDateString("en-GB", {weekday: "long"});
    if (daysOfWeek.includes(dayOfWeek)) {
      // If the current date is one of the specified days of the week, create a lesson date info object
      const [lessonDay]: ILessonDaysTimes[] = lessonDates.filter(item => item.day === dayOfWeek);
      const lessonTimes = lessonDay.time.map(item => {
        return {
          time: item,
          isReserved: checkIsReserved(reservedDates, dateLoop, item)
        }
      })

      // Create and add the ILessonDateInfo object to the lessonDateInfoArray
      const lessonDateInfo: ILessonDateInfo = {
        date: new Date(dateLoop),
        day: dayOfWeek,
        times: lessonTimes,
        slots: lessonTimes.filter(item => !item.isReserved).length,
        isReserved: lessonTimes.every(item => item.isReserved)
      };
      lessonDateInfoArray.push(lessonDateInfo);
    }
  }

  return lessonDateInfoArray;
}

export const localeFormatter = (locale: TLocale) : TDateLocale => {
  if (locale === "en") return "en-GB";
  else if (locale === "uk") return "uk-UA";
  return "ru-RU";
}

export const formatLocaleDate = (date: Date, locale: TLocale) => {
  return date.toLocaleDateString(localeFormatter(locale), {month: "short", day: "numeric"});
}

export function getDaysOfCurrentAndNextMonthWithDayOfWeek(): { date: Date; dayOfWeek: number }[] {
  const today = new Date();
  const currentMonth = today.getMonth();
  const nextMonth = (currentMonth + 1) % 12; // Wrap around to January if December

  const daysInCurrentMonth = new Date(today.getFullYear(), nextMonth, 0).getDate();
  const daysInNextMonth = new Date(today.getFullYear(), nextMonth + 1, 0).getDate();

  const currentMonthDays: { date: Date; dayOfWeek: number }[] = [];
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    const date = new Date(today.getFullYear(), currentMonth, i);
    const dayOfWeek = date.getDay();
    currentMonthDays.push({ date, dayOfWeek });
  }

  const nextMonthDays: { date: Date; dayOfWeek: number }[] = [];
  for (let i = 1; i <= daysInNextMonth; i++) {
    const date = new Date(today.getFullYear(), nextMonth, i);
    const dayOfWeek = date.getDay();
    nextMonthDays.push({ date, dayOfWeek });
  }

  return [...currentMonthDays, ...nextMonthDays];
}

