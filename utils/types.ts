export interface ILessonDaysTimes {
  day: string
  time: string[]
}

export interface ITeacherInfo {
  uid: string
  studentName: string
  studentAge: number
  lessonDuration: string
  lessonPrice: number
  lessonDaysTimes: ILessonDaysTimes[]
}