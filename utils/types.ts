export interface ILessonDaysTimes {
  day: string
  time: string[]
}

export interface ITeacherInfo {
  uid: string
  lessonDuration: string
  lessonPrice: number
  lessonDaysTimes: ILessonDaysTimes[]
}