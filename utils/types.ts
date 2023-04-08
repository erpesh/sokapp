import {Timestamp} from "firebase/firestore";

export interface ITeacherInfo {
  uid: string
  lessonDuration: number,
  lessonPrice: number,
  lessonTimes: string[]
}