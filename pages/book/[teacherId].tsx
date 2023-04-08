import {useRouter} from "next/router";
import React, {useContext, useEffect, useState} from "react";
import {collection, getDocs, query, where, addDoc, DocumentData, Timestamp} from "firebase/firestore";
import {db} from "../../lib/initFirebase";
import {ITeacherInfo, IAppointment} from "../../utils/types";
import DateCard from "../../components/date-card";
import {getMatchingDatesInNextThreeWeeks, IMatchingDate} from "../../utils/getMatchingDates";
import AuthContext from "../../context/authContext";

const Book = () => {

  const teachersInfoRef = collection(db, "teachersInfo");
  const appointmentsRef = collection(db, "appointments");

  const router = useRouter();
  const {currentUser} = useContext(AuthContext);
  const {teacherId} = router.query;

  // const [teacherInfo, setTeacherInfo] = useState<ITeacherInfo | null>(null);
  const [datesInThreeWeeks, setDatesInThreeWeeks] = useState<IMatchingDate[]>([]);
  const [teacherLessonTimes, setTeacherLessonTimes] = useState<string[]>([]);
  const [activeTimes, setActiveTimes] = useState<string[]>([]);

  const [studentName, setStudentName] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [activeDate, setActiveDate] = useState(0);
  const [activeTime, setActiveTime] = useState(0);

  async function getTeacherInfoAndAppointments() {

    let lessonTimes = undefined;

    // Teacher info
    const todosQuery = query(teachersInfoRef, where("uid", "==", teacherId));
    const querySnapshotTI = await getDocs(todosQuery);
    querySnapshotTI.forEach((doc) => {
      const data = doc.data() as ITeacherInfo;
      lessonTimes = data.lessonTimes;
    });

    // Appointments
    const appointmentsQuery = query(
      appointmentsRef,
      where("teacherUid", "==", teacherId),
    )
    const querySnapshotA = await getDocs(appointmentsQuery);
    let appointments : IAppointment[] = [];
    querySnapshotA.forEach((doc) => {
      const appointmentsData = doc.data() as IAppointment;
      appointments.push(appointmentsData);
    });

    const reservedDates = appointments.map(appointment => formatTimestamp(appointment.datetime))

    lessonTimes = lessonTimes.filter(lessonTime => {
      return !reservedDates.includes(lessonTime);
    })


    setTeacherLessonTimes(lessonTimes);
    setDatesInThreeWeeks(getMatchingDatesInNextThreeWeeks(lessonTimes));
  }

  function getActiveTimes() {
    if (teacherLessonTimes && datesInThreeWeeks.length > 0) {
      let lessonTimes = teacherLessonTimes.filter(item => item.split(" ")[0] === datesInThreeWeeks[activeDate].day);
      const activeLessonTimes = lessonTimes.map(item => item.split(" ")[1]);
      setActiveTimes(activeLessonTimes);
    }
  }

  function getTimestamp(dateString: string, timeString: string): Timestamp {
    const date = new Date(`${dateString} ${new Date().getFullYear()} ${timeString}`);
    return Timestamp.fromMillis(date.getTime());
  }

  function formatTimestamp(timestamp: Timestamp): string {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = timestamp.toDate();
    const dayOfWeek = weekdays[date.getDay()];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${dayOfWeek} ${hours}:${minutes}`;
  }

  const bookNewLesson = async (e) => {
    e.preventDefault();

    await addDoc(appointmentsRef, {
      paid: true,
      teacherUid: teacherId as string,
      uid: currentUser?.uid as string,
      datetime: getTimestamp(datesInThreeWeeks[activeDate].date, activeTimes[activeTime])
    } as DocumentData)
      .then(result => console.log(result))
  }

  useEffect(() => {
    if (teacherId) {
      getTeacherInfoAndAppointments();
    }
  }, [teacherId])

  // useEffect(() => {
  //   if (teacherInfo?.lessonTimes){
  //     setDatesInTwoWeeks(getMatchingDatesInNextThreeWeeks(teacherInfo.lessonTimes));
  //   }
  // }, [teacherInfo])

  useEffect(() => {
    getActiveTimes();
  }, [activeDate, datesInThreeWeeks])

  return (
    <div className={"page"}>
      <h1>Book your next lesson</h1>
      <form className={"book-form"}>
        <div className={"book-credentials"}>
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
            <h3>Choose date of your lesson</h3>
            <div className={"book-date"}>
              {datesInThreeWeeks.map((item, index) => (
                <DateCard
                  key={item.date}
                  value={item.date}
                  onClick={() => {
                    setActiveDate(index);
                    setActiveTime(0);
                  }}
                  isActive={index == activeDate}
                />
              ))}
            </div>
          </div>
          <div className={"book-date-wrap"}>
            <h3>Choose time of your lesson</h3>
            <div className={"book-date"}>
              {activeTimes
                .map((item, index) => (
                  <DateCard
                    key={item}
                    value={item}
                    onClick={() => setActiveTime(index)}
                    isActive={index == activeTime}
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