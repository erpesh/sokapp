import {addDoc, collection, DocumentData, Timestamp} from "firebase/firestore";
import {db} from "../lib/initFirebase";

export default async function bookLesson(data: any, paid: boolean, ts: (val: string, params?: any) => string) {

  const appointmentsRef = collection(db, "appointments");

  const {
    price,
    studentName,
    studentAge,
    telNumber,
    teacherUid,
    uid,
    userEmail,
    datetime,
    teacherName,
    teacherEmail,
    lessonDate,
    lessonTime
  } = data;

  await addDoc(appointmentsRef, {
    price: price,
    studentName: studentName,
    studentAge: Number(studentAge),
    telNumber: telNumber,
    paid: paid,
    teacherUid: teacherUid as string,
    uid: uid as string,
    datetime: Timestamp.fromMillis(datetime)
  } as DocumentData)
    .then(result => console.log(result))

  await fetch(`/api/sendEmail`,
    {
      method: "POST",
      body: JSON.stringify({
        email: userEmail,
        teacherEmail: teacherEmail,
        emailSubject: ts("lessonBooking"),
        userBookingHtml: ts("userBookingConfirmationHtml", {teacherName, lessonDate, lessonTime}),
        teacherBookingHtml: ts("teacherBookingHtml", {studentName, lessonDate, lessonTime}),
      })
    }).then(res => console.log(res));
}