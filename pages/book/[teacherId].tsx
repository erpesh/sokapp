import {useRouter} from "next/router";
import React, {useContext, useEffect, useState} from "react";
import {collection, getDocs, query, where, addDoc, DocumentData, serverTimestamp} from "firebase/firestore";
import {db} from "../../lib/initFirebase";
import {ITeacherInfo} from "../../utils/types";
import DateCard from "../../components/date-card";
import generateLessonDateInfo, {
  getTimestamp, IAppointment,ILessonDateInfo
} from "../../utils/dateTimeFormattersCalculators";
import AuthContext from "../../context/authContext";

const Book = () => {

  const teachersInfoRef = collection(db, "teachersInfo");
  const appointmentsRef = collection(db, "appointments");

  const router = useRouter();
  const {currentUser} = useContext(AuthContext);
  const {teacherId} = router.query;

  const [lessonDatesInfo, setLessonDatesInfo] = useState<ILessonDateInfo[]>([]);

  const [studentName, setStudentName] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [activeDate, setActiveDate] = useState(0);
  const [activeTime, setActiveTime] = useState(0);

  async function getTeacherInfoAndAppointments() {

    let lessonTimes = undefined;

    // Teacher info
    const teachersInfoQuery = query(teachersInfoRef, where("uid", "==", teacherId));
    const querySnapshotTI = await getDocs(teachersInfoQuery);
    querySnapshotTI.forEach((doc) => {
      const data = doc.data() as ITeacherInfo;
      lessonTimes = data.lessonDaysTimes;
    });

    // Appointments
    const appointmentsQuery = query(
      appointmentsRef,
      where("teacherUid", "==", teacherId),
      where("datetime", ">", new Date())
    )
    const querySnapshotA = await getDocs(appointmentsQuery);
    let appointments : IAppointment[] = [];
    querySnapshotA.forEach((doc) => {
      const appointmentsData = doc.data() as IAppointment;
      appointments.push(appointmentsData);
    });

    const generatedLessonDateInfo = generateLessonDateInfo(lessonTimes, appointments);

    setActiveDate(generatedLessonDateInfo.findIndex(item => !item.isReserved));
    setLessonDatesInfo(generatedLessonDateInfo);
  }

  const bookNewLesson = async (e) => {
    e.preventDefault();

    await addDoc(appointmentsRef, {
      paid: true,
      teacherUid: teacherId as string,
      uid: currentUser?.uid as string,
      datetime: getTimestamp(
        lessonDatesInfo[activeDate].date,
        lessonDatesInfo[activeDate].dateString,
        lessonDatesInfo[activeDate].times[activeTime].time
      )
    } as DocumentData)
      .then(result => console.log(result))
  }

  useEffect(() => {
    if (teacherId) {
      getTeacherInfoAndAppointments();
    }
  }, [teacherId])

  return (
    <div className={"page"}>
      <h1>Book your next lesson</h1>
      <form className={"book-form"}>
        <div className={"double-input-container"}>
          <div className={"form-input-wrap"}>
            <label>Student Name</label>
            <input
              placeholder={"Student Name"}
              type={"text"}
              value={studentName}
              onChange={(e) => setStudentName(e.currentTarget.value)}
              required/>
          </div>
          <div className={"form-input-wrap"}>
            <label>Student Age</label>
            <input
              placeholder={"Student Age"}
              type={"number"}
              value={studentAge}
              onChange={(e) => setStudentAge(e.currentTarget.value)}
              min={1}
              max={99}
              required/>
          </div>
        </div>
        <div className={"book-date-time"}>
          <div className={"book-date-wrap"}>
            <h3>Choose date of the lesson</h3>
            <div className={"book-date"}>
              {lessonDatesInfo.map((item, index) => (
                <DateCard
                  key={item.dateString}
                  value={item.dateString}
                  onClick={() => {
                    setActiveDate(index);
                    setActiveTime(lessonDatesInfo[index].times.findIndex(item => !item.isReserved));
                  }}
                  isActive={index === activeDate}
                  isDisabled={item.isReserved}
                />
              ))}
            </div>
          </div>
          <div className={"book-date-wrap"}>
            <h3>Choose time of the lesson</h3>
            <div className={"book-date"}>
              {lessonDatesInfo[activeDate]?.times
                .map((item, index) => (
                  <DateCard
                    key={item.time}
                    value={item.time}
                    onClick={() => setActiveTime(index)}
                    isActive={index === activeTime}
                    isDisabled={item.isReserved}
                  />
                ))}
            </div>
          </div>
        </div>
        <input type={"submit"} className={"submit-book"} onClick={bookNewLesson}/>
      </form>
    </div>
  );
};

export default Book;