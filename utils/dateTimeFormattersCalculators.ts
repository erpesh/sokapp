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

export function getTimeIntervals(duration: string): string[] {
  let timeIntervals: string[] = [];
  let interval: number;

  switch (duration) {
    case "30 min":
      interval = 30;
      break;
    case "1 hour":
      interval = 60;
      break;
    case "2 hours":
      interval = 120;
      break;
    default:
      throw new Error("Invalid duration: " + duration);
  }

  const startDate = new Date(0, 0, 0, 0, 0, 0);
  const endDate = new Date(0, 0, 0, 23, 59, 0);

  for (let currentTime = startDate; currentTime <= endDate; currentTime.setMinutes(currentTime.getMinutes() + interval)) {
    const hour = currentTime.getHours().toString().padStart(2, "0");
    const minute = currentTime.getMinutes().toString().padStart(2, "0");
    timeIntervals.push(`${hour}:${minute}`);
  }

  return timeIntervals;
}

interface IGroupedByDay {
  dateString: string,
  appointments: IAppointment[]
}

export const localeFormatter = (locale: TLocale) : TDateLocale => {
  if (locale === "en") return "en-GB";
  else if (locale === "uk") return "uk-UA";
  else if (locale === "ru") return "ru-RU";
}

export function groupedByDay(appointments: IAppointment[], locale: TLocale) : IGroupedByDay[]  {
  const groupedByDay = appointments.reduce((acc, appointment) => {
    // Convert the Timestamp to a Date object
    const appointDate = appointment.datetime.toDate();

    // Get the date string in the format "20th April"
    const dateString = appointDate.toLocaleDateString(localeFormatter(locale), {
      day: "numeric",
      month: "long",
    });

    // Add the appointment to the array for the corresponding date
    if (!acc[dateString]) {
      acc[dateString] = [appointment];
    } else {
      acc[dateString].push(appointment);
    }

    return acc;
  }, {});

  return Object.entries(groupedByDay).map(([dateString, appointments]) => {
    return {
      dateString: dateString,
      appointments: appointments as IAppointment[]
    }
  });
}
