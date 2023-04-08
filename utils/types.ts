import {Timestamp} from "firebase/firestore";

export interface ITeacherInfo {
  uid: string
  lessonDuration: number,
  lessonPrice: number,
  lessonTimes: string[]
}
export interface IAppointment {
  datetime: Timestamp
  paid: boolean,
  teacherUid: string,
  uid: string
}