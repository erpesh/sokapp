import {Timestamp} from "firebase/firestore";
import {ILessonDaysTimes, TDateLocale, TLocale} from "./types";

export interface ILessonTime {
  time: string,
  isReserved: boolean
}

export interface ILessonDateInfo {
  date: Date,
  dateString: string,
  day: string,
  times: ILessonTime[],
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
  locale: TLocale
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
      const date = dateLoop.toLocaleDateString(localeFormatter(locale), {month: "short", day: "numeric"});
      const [lessonDay]: ILessonDaysTimes[] = lessonDates.filter(item => item.day === dayOfWeek);
      const lessonTimes = lessonDay.time.map(item => {
        return {
          time: item,
          isReserved: checkIsReserved(reservedDates, dateLoop, item)
        }
      })

      // Create and add the ILessonDateInfo object to the lessonDateInfoArray
      const lessonDateInfo: ILessonDateInfo = {
        date: dateLoop,
        dateString: date,
        day: dayOfWeek,
        times: lessonTimes,
        isReserved: lessonTimes.every(item => item.isReserved)
      };
      lessonDateInfoArray.push(lessonDateInfo);
    }
  }

  return lessonDateInfoArray;
}

export interface IGroupedByDay {
  dateString: string,
  appointments: IAppointment[]
}

export const localeFormatter = (locale: TLocale) : TDateLocale => {
  if (locale === "en") return "en-GB";
  else if (locale === "uk") return "uk-UA";
  else if (locale === "ru") return "ru-RU";
}

