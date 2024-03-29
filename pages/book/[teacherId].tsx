import {useRouter} from "next/router";
import React, {useContext, useEffect, useState} from "react";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "@/lib/initFirebase";
import {ITeacherInfo} from "@/utils/types";
import DateCard from "../../components/date-card";
import generateLessonDateInfo, {
  formatLocaleDate,
  getTimestamp,
  IAppointment,
  ILessonDateInfo
} from "../../utils/dateTimeFormattersCalculators";
import AuthContext from "../../context/authContext";
import useLocalStorageState from "use-local-storage-state";
import {useI18n, useScopedI18n, useCurrentLocale} from "@/locales";
import Switch from "react-switch";
import bookLesson from "../../utils/bookLesson";
import {Tooltip} from "react-tooltip";

const Book = () => {

  const t = useI18n();
  const ts = useScopedI18n("scope.book");
  const tsp = useScopedI18n("scope.email");
  const currentLocale = useCurrentLocale();

  const teachersInfoRef = collection(db, "teachersInfo");
  const appointmentsRef = collection(db, "appointments");

  const router = useRouter();
  const {currentUser} = useContext(AuthContext);
  const {teacherId} = router.query;

  const [teacherInfo, setTeacherInfo] = useState<ITeacherInfo>();
  const [lessonDatesInfo, setLessonDatesInfo] = useState<ILessonDateInfo[]>([]);

  const [studentName, setStudentName] = useLocalStorageState<string>("studentName", { defaultValue: ""});
  const [studentAge, setStudentAge] = useLocalStorageState<string>("studentAge", {defaultValue: ""});
  const [telNumber, setTelNumber] = useLocalStorageState<string>("telNumber", {defaultValue: ""});
  const [onlinePayment, setOnlinePayment] = useState(false);
  const [activeDate, setActiveDate] = useState(0);
  const [activeTime, setActiveTime] = useState(0);

  async function getTeacherInfoAndAppointments() {
    try {
      let lessonTimes = undefined;

      // Teacher info
      const teachersInfoQuery = query(teachersInfoRef, where("uid", "==", teacherId));
      const querySnapshotTI = await getDocs(teachersInfoQuery);
      querySnapshotTI.forEach((doc) => {
        const data = doc.data() as ITeacherInfo;
        setTeacherInfo(data);
        lessonTimes = data.lessonDaysTimes;
      });

      // Appointments
      const appointmentsQuery = query(
        appointmentsRef,
        where("teacherUid", "==", teacherId),
        where("datetime", ">", new Date())
      )
      const querySnapshotA = await getDocs(appointmentsQuery);

      let appointments: IAppointment[] = [];
      querySnapshotA.forEach((doc) => {
        const appointmentsData = doc.data() as IAppointment;
        appointments.push(appointmentsData);
      });

      const generatedLessonDateInfo = generateLessonDateInfo(lessonTimes ? lessonTimes : [], appointments);
      const activeDateValue = generatedLessonDateInfo.findIndex(item => !item.isReserved);
      const activeTimeValue = generatedLessonDateInfo[activeDateValue].times.findIndex(item => !item.isReserved);

      setActiveDate(activeDateValue);
      setActiveTime(activeTimeValue);
      setLessonDatesInfo(generatedLessonDateInfo);
    }
    catch (error) {
      console.error(error);
    }
  }

  const bookNewLesson = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      router.push("/login");
      return;
    }

    const lessonTime = lessonDatesInfo[activeDate].times[activeTime].time;

    const metadata = {
      price: teacherInfo ? teacherInfo.lessonPrice : 0,
      studentName: studentName,
      studentAge: Number(studentAge),
      telNumber: telNumber,
      teacherUid: teacherId as string,
      uid: currentUser.uid,
      userEmail: currentUser.email,
      datetime: getTimestamp(
        lessonDatesInfo[activeDate].date,
        formatLocaleDate(lessonDatesInfo[activeDate].date, 'en'),
        lessonTime
      ).toDate(),
      teacherName: teacherInfo?.teacherName,
      teacherEmail: teacherInfo?.teacherEmail,
      lessonDate: formatLocaleDate(lessonDatesInfo[activeDate].date, currentLocale),
      lessonTime: lessonTime
    };

    if (onlinePayment) {
      const res = await fetch(`/api/checkout`,
        {
          method: "POST",
          body: JSON.stringify({
            amount: teacherInfo?.lessonPrice,
            description: `Private lesson with ${teacherInfo?.teacherName}`,
            stripeId: teacherInfo?.stripeAccountId,
            cancel_url: router.asPath,
            metadata: metadata
          })
        });

      const session = await res.json();
      if (session.url) {
        window.location.href = session.url;
      }
    }
    else {
      await bookLesson(metadata, false, tsp)
        .then(() => {
          router.push("/appointments");
      })
    }
  }

  useEffect(() => {
    if (teacherId)
      getTeacherInfoAndAppointments();
  }, [teacherId])

  let PaymentComponent = <span className={"switch-message"}>{ts("onlyOnSite", {teacherName: teacherInfo?.teacherName})}</span>

  if (teacherInfo?.paymentMethod === "online")
    PaymentComponent = <span className={"switch-message"}>{ts("onlyOnline", {teacherName: teacherInfo?.teacherName})}</span>

  else if (teacherInfo?.paymentMethod === "both")
    PaymentComponent = <>
      <Switch onChange={(checked) => setOnlinePayment(checked)} checked={onlinePayment}/>
      <span className={"switch-message"}>{ts("payOnline")}</span>
    </>

  return (
    <div className={"page"}>
      <h1>{ts("bookLessonTitle", {teacherName: teacherInfo?.teacherName})}</h1>
      <form className={"book-form"} onSubmit={bookNewLesson}>
        <div className={"double-input-container"}>
          <div className={"form-input-wrap"}>
            <label>{t("studentName")}</label>
            <input
              placeholder={t("studentName")}
              type={"text"}
              value={studentName.toString()}
              onChange={(e) => setStudentName(e.currentTarget.value)}
              required/>
          </div>
          <div className={"form-input-wrap"}>
            <label>{ts("studentAge")}</label>
            <input
              placeholder={ts("studentAge")}
              type={"number"}
              value={studentAge.toString()}
              onChange={(e) => setStudentAge(e.currentTarget.value)}
              min={1}
              max={99}
              required/>
          </div>
          <div className={"form-input-wrap"}>
            <label>{t("telNumber")}</label>
            <input
              placeholder={t("telNumber")}
              type={"tel"}
              autoComplete={"tel"}
              value={telNumber?.toString()}
              onChange={(e) => setTelNumber(e.currentTarget.value)}
              required/>
          </div>
        </div>
        <div className={"book-date-time"}>
          <div className={"book-date-wrap"}>
            <h3 className={'book-part-title'}>{ts("chooseDateOfLesson")}</h3>
            <div className={"book-date"}>
              {lessonDatesInfo.map((item, index) => (
                <DateCard
                  key={item.date.getTime()}
                  value={formatLocaleDate(item.date, currentLocale)}
                  onClick={() => {
                    setActiveDate(index);
                    setActiveTime(lessonDatesInfo[index].times.findIndex(item => !item.isReserved));
                  }}
                  isActive={index === activeDate}
                  isDisabled={item.isReserved}
                  data-tooltip-id={"date-tip"}
                  data-tooltip-content={item.slots + ts('slots')}
                />
              ))}
              <Tooltip delayShow={150} id={'date-tip'}/>
            </div>
          </div>
          <div className={"book-date-wrap"}>
            <h3 className={'book-part-title'}>{ts("chooseTimeOfLesson")}</h3>
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
        <div className={"switch-container"}>
          {PaymentComponent}
        </div>
        <input type={"submit"} className={"default-button"} value={t("submit")}/>
      </form>
    </div>
  );
};

export default Book;