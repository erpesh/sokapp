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
  stripeAccountId?: string
  stripeLinked?: boolean
  paymentMethod: TPaymentMethod
}

export type TPaymentMethod = "online" | "on-site" | "both";

export type TLocale = "en" | "uk" | "ru";
export type TDateLocale = "en-GB" | "uk-UA" | "ru-RU";