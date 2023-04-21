import {useRouter} from "next/router";
import React, {useContext, useEffect, useState} from "react";
import {collection, getDocs, query, where, addDoc, DocumentData} from "firebase/firestore";
import {db} from "../../lib/initFirebase";
import {ITeacherInfo} from "../../utils/types";
import DateCard from "../../components/date-card";
import generateLessonDateInfo, {
  getTimestamp, IAppointment,ILessonDateInfo
} from "../../utils/dateTimeFormattersCalculators";
import AuthContext from "../../context/authContext";
import useLocalStorageState from "use-local-storage-state";
import PhoneInput from 'react-phone-number-input'

const Book = () => {

  const teachersInfoRef = collection(db, "teachersInfo");
  const appointmentsRef = collection(db, "appointments");

  const router = useRouter();
  const {currentUser} = useContext(AuthContext);
  const {teacherId} = router.query;

  const [lessonDatesInfo, setLessonDatesInfo] = useState<ILessonDateInfo[]>([]);

  const [studentName, setStudentName] = useLocalStorageState<string>("studentName", { ssr: true, defaultValue: "" });
  const [studentAge, setStudentAge] = useLocalStorageState<string>("studentAge", { ssr: true, defaultValue: "" });
  const [telNumber, setTelNumber] = useLocalStorageState<string>("telNumber", { ssr: true, defaultValue: "" });
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
    const activeDateValue = generatedLessonDateInfo.findIndex(item => !item.isReserved);
    const activeTimeValue = generatedLessonDateInfo[activeDateValue].times.findIndex(item => !item.isReserved);

    setActiveDate(activeDateValue);
    setActiveTime(activeTimeValue);
    setLessonDatesInfo(generatedLessonDateInfo);
  }

  const bookNewLesson = async (e) => {
    e.preventDefault();

    await addDoc(appointmentsRef, {
      studentName: studentName,
      studentAge: Number(studentAge),
      telNumber: telNumber,
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
      <form className={"book-form"} onSubmit={bookNewLesson}>
        <div className={"double-input-container"}>
          <div className={"form-input-wrap"}>
            <label>Student Name</label>
            <input
              placeholder={"Student Name"}
              type={"text"}
              value={studentName.toString()}
              onChange={(e) => setStudentName(e.currentTarget.value)}
              required/>
          </div>
          <div className={"form-input-wrap"}>
            <label>Student Age</label>
            <input
              placeholder={"Student Age"}
              type={"number"}
              value={studentAge.toString()}
              onChange={(e) => setStudentAge(e.currentTarget.value)}
              min={1}
              max={99}
              required/>
          </div>
          <div className={"form-input-wrap"}>
            <label>Telephone Number</label>
            <input
              placeholder={"Telephone Number"}
              type={"tel"}
              autoComplete={"tel"}
              value={telNumber?.toString()}
              onChange={(e) => setTelNumber(e.currentTarget.value)}
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
        <input type={"submit"} className={"submit-book"}/>
      </form>
    </div>
  );
};

export default Book;