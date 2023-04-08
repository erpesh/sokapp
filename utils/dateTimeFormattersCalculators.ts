import {Timestamp} from "firebase/firestore";

export interface ILessonTime {
  time: string,
  isReserved: boolean
}

export interface ILessonDateInfo {
  date: string,
  day: string,
  times: ILessonTime[],
  isReserved: boolean
}

export interface IAppointment {
  datetime: Timestamp
  paid: boolean,
  teacherUid: string,
  uid: string
}

export function getTimestamp(dateString: string, timeString: string): Timestamp {
  const date = new Date(`${dateString} ${new Date().getFullYear()} ${timeString}`);
  return Timestamp.fromMillis(date.getTime());
}

function checkIsReserved(reservedAppointments: Date[], dateLoop: Date, lessonTime: string) {
  return reservedAppointments.some(item => {
    return item.getDate() === dateLoop.getDate() &&
      item.toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'}) === lessonTime.split(" ")[1]
  })
}

export default function generateLessonDateInfo(
  lessonDates: string[],
  appointments: IAppointment[]
): ILessonDateInfo[] {
  // Get the current date and calculate the start and end dates of the three-week period
  const currentDate = new Date();
  const dateInOneDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
  const threeWeeksFromNow = new Date(dateInOneDay.getTime() + (20 * 24 * 60 * 60 * 1000));
  const daysOfWeek = lessonDates.map(item => item.split(" ")[0]);
  const reservedDates = appointments.map(item => item.datetime.toDate());

  // Create an array to store the lesson date info objects
  const lessonDateInfoArray: ILessonDateInfo[] = [];

  // Loop through the dates in the three-week period
  for (let dateLoop = dateInOneDay; dateLoop <= threeWeeksFromNow; dateLoop.setDate(dateLoop.getDate() + 1)) {
    // Check if the current date is one of the days of the week in the `daysOfWeek` array
    const dayOfWeek = dateLoop.toLocaleDateString("en-US", {weekday: "long"});
    if (daysOfWeek.includes(dayOfWeek)) {
      // If the current date is one of the specified days of the week, create a lesson date info object
      const date = dateLoop.toLocaleDateString("en-US", {month: "short", day: "numeric"});
      const lessonTimes: ILessonTime[] = lessonDates
        .filter(item => item.split(" ")[0] === dayOfWeek)
        .map(item => {
          return {
            time: item.split(" ")[1],
            isReserved: checkIsReserved(reservedDates, dateLoop, item)
          }
        });

      // Create and add the ILessonDateInfo object to the lessonDateInfoArray
      const lessonDateInfo: ILessonDateInfo = {
        date,
        day: dayOfWeek,
        times: lessonTimes,
        isReserved: lessonTimes.every(item => item.isReserved)
      };
      lessonDateInfoArray.push(lessonDateInfo);
    }
  }

  return lessonDateInfoArray;
}