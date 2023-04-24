export interface ILessonDaysTimes {
  day: string
  time: string[]
}

export interface ITeacherInfo {
  uid: string
  teacherName: string
  teacherEmail: string
  lessonDuration: string
  lessonPrice: number
  lessonDaysTimes: ILessonDaysTimes[]
}