import {withAuthRole} from "@/utils/withAuth";
import React, {useContext, useEffect, useState, MouseEvent} from "react";
import AuthContext from "../../../context/authContext";
import {db} from "@/lib/initFirebase";
import {collection, doc, DocumentData, getDocs, query, updateDoc, where} from "firebase/firestore";
import {ITeacherInfo, TPaymentMethod} from "@/utils/types";
import DateCard from "../../../components/date-card";
import addIcon from "../../../assets/add-icon.svg";
import Image from "next/image";
import {updateProfile} from "firebase/auth";
import useWarnBeforeLeavingPage from "../../../hooks/useWarnBeforeLeavingPage";
import {useI18n, useScopedI18n} from "@/locales";
import SettingsMenu from "../../../components/settings-menu";
import absoluteUrl from "../../../utils/absoluteUrl";
import {BiCopyAlt} from "react-icons/bi";
import {Tooltip} from "react-tooltip";

const LESSON_DURATIONS = ["30 min", "1 hour", "2 hours"];
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const PAYMENT_METHODS: TPaymentMethod[] = ["on-site", "online", "both"];

enum InputOnChange {
  fullName,
  lessonDuration,
  lessonPrice,
  lessonDays,
  removeTime,
  addTime,
  paymentMethods,
}

const Settings = () => {

  const t = useI18n();
  const ts = useScopedI18n("scope.settings");

  const [changesMade, setChangesMade] = useState(false);
  useWarnBeforeLeavingPage(changesMade);

  const {currentUser, isTeacher} = useContext(AuthContext);
  const [documentId, setDocumentId] = useState("");
  const [teacherInfo, setTeacherInfo] = useState<ITeacherInfo>();

  const [fullName, setFullName] = useState("");
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [newTime, setNewTime] = useState("");
  const [newTimeMessage, setNewTimeMessage] = useState("");

  const teachersInfoRef = collection(db, "teachersInfo");

  const getTeacherInfoCopy = (): ITeacherInfo => {
    return {...teacherInfo} as ITeacherInfo
  };

  async function getTeacherInfo() {
    try {
      const teachersInfoQuery = query(teachersInfoRef, where("uid", "==", currentUser?.uid));
      const querySnapshotTI = await getDocs(teachersInfoQuery);
      querySnapshotTI.forEach((doc) => {
        const data = doc.data() as ITeacherInfo;
        setDocumentId(doc.id);
        setTeacherInfo(data);
        setChangesMade(false);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function updateTeachersInfo(e: MouseEvent<HTMLElement>) {
    e.preventDefault();

    const teacherInfoDoc = doc(db, "teachersInfo", documentId);
    await updateDoc(teacherInfoDoc, teacherInfo as DocumentData)
      .then(() => console.log("User info updated successfully!"))
      .catch((error) => {
        console.error(error);
      });

    if (currentUser) {
      updateProfile(currentUser, {
        displayName: fullName,
      })
        .then(() => {
          console.log("Display name updated successfully!");
        })
        .catch((error) => {
          console.error(error);
        });
    }

    setChangesMade(false);
  }

  const handleSettingsChange = (name: InputOnChange, value: string) => {
    const tiCopy = getTeacherInfoCopy();
    switch (name) {
      case InputOnChange.fullName:
        setFullName(value);
        tiCopy.teacherName = value;
        break;

      case InputOnChange.lessonDuration:
        tiCopy.lessonDuration = value;
        break;

      case InputOnChange.lessonPrice:
        tiCopy.lessonPrice = Number(value);
        break;

      case InputOnChange.lessonDays:
        if (teacherInfo?.lessonDaysTimes?.map(item => item.day).includes(value)) {
          // @ts-ignore
          tiCopy.lessonDaysTimes = teacherInfo?.lessonDaysTimes?.filter(item => item.day !== value);
          setActiveDayIndex(0);
        } else {
          tiCopy.lessonDaysTimes.push({day: value, time: []})
        }
        break;

      case InputOnChange.removeTime:
        tiCopy.lessonDaysTimes[activeDayIndex].time = tiCopy.lessonDaysTimes[activeDayIndex].time.filter(item => item !== value)
        break;

      case InputOnChange.addTime:
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (timeRegex.test(value)) {
          if (tiCopy.lessonDaysTimes[activeDayIndex].time.includes(value)) {
            setNewTimeMessage(t("theTimeActive"));
          } else {
            tiCopy.lessonDaysTimes[activeDayIndex].time.push(value);
            tiCopy.lessonDaysTimes[activeDayIndex].time.sort();
            setNewTimeMessage("");
          }
        } else {
          setNewTimeMessage(t("timeShouldFormat"));
        }
        break;

      case InputOnChange.paymentMethods:
        tiCopy.paymentMethod = value as TPaymentMethod;
        break;

      default:
        break;
    }
    setTeacherInfo(tiCopy);
    setChangesMade(true);
  }

  const connectStripeAccount = async () => {
    if (changesMade) {
      alert(ts("submitBeforeConnecting"));
      return;
    }

    const res = await fetch(`/api/connectStripe`,
      {
        method: "POST",
        body: JSON.stringify({
          email: currentUser?.email,
          docId: documentId,
          stripeId: teacherInfo?.stripeAccountId
        })
      });

    const session = await res.json();
    if (session.url) {
      window.location.href = session.url;
    }
  }

  useEffect(() => {
    setFullName(currentUser?.displayName!);

    if (currentUser?.uid) {
      getTeacherInfo();
    }
  }, [currentUser, isTeacher])

  if (!teacherInfo) return <div>Loading</div>

  return (
    <div className={"page settings-page"}>
      <SettingsMenu/>
      <div className={"setting-page"}>
        <h1 className={"setting-title"}>{ts("lessonSettings")}</h1>
        <div className={"form-input-wrap"}>
          <label>{ts("teacherLink")}</label>
          <div className={"teacher-link"}>
            <span
              title={ts("copyLink")}
              onClick={() => navigator.clipboard.writeText(absoluteUrl(`/book/${currentUser?.uid}`))}
              data-tooltip-id="copy-link"
              data-tooltip-content={ts('linkCopied')}
            >
              {absoluteUrl(`/book/${currentUser?.uid}`)}
              <BiCopyAlt size={20}/>
            </span>
            <Tooltip openOnClick delayHide={2000} id="copy-link"/>
          </div>
        </div>
        <div className={"double-input-container"}>
          <div className={"form-input-wrap"}>
            <label>{t("fullName")}</label>
            <input
              type={"text"}
              placeholder={"Full name"}
              value={fullName}
              onChange={e => handleSettingsChange(InputOnChange.fullName, e.currentTarget.value)}
            />
          </div>
          <div className={"form-input-wrap"}>
            <label>{t("lessonDuration")}</label>
            <select
              value={teacherInfo.lessonDuration}
              onChange={e => handleSettingsChange(InputOnChange.lessonDuration, e.currentTarget.value)}
            >
              {LESSON_DURATIONS.map(item => <option key={item} value={item}>{t(item)}</option>)}
            </select>
          </div>
          <div className={"form-input-wrap"}>
            <label>{t("lessonPrice")}</label>
            <input
              type={"number"}
              placeholder={"Lesson price"}
              value={teacherInfo.lessonPrice}
              onChange={e => handleSettingsChange(InputOnChange.lessonPrice, e.currentTarget.value)}
            />
          </div>
        </div>
        <div className={"lesson-times-setting"}>
          <h2 style={{margin: "1rem 0 0"}}>{ts("daysOfLessons")}</h2>
          <div className={"lesson-days"}>
            {DAYS_OF_WEEK.map(dayOfWeek => <DateCard
              key={dayOfWeek}
              value={t(dayOfWeek)}
              isActive={teacherInfo?.lessonDaysTimes?.map(item => item.day).includes(dayOfWeek)}
              onClick={() => handleSettingsChange(InputOnChange.lessonDays, dayOfWeek)}
            />)}
          </div>
          {teacherInfo.lessonDaysTimes.length > 0 && <>
              <h2 style={{margin: "1rem 0"}}>{ts("lessonTimes")}</h2>
              <div>
                  <select
                      value={activeDayIndex}
                      onChange={(e) => {
                        setActiveDayIndex(Number(e.currentTarget.value))
                      }}
                      style={{width: "125px"}}
                  >
                    {teacherInfo.lessonDaysTimes.map((item, index) => (
                      <option key={item.day} value={index}>{t(item.day)}</option>
                    ))}
                  </select>
              </div>
              <div className={"lesson-times"}>
                  <div className={"lesson-days"}>
                    {teacherInfo.lessonDaysTimes[activeDayIndex].time.length > 0 ? teacherInfo.lessonDaysTimes[activeDayIndex].time.map(item => {
                      return (
                        <>
                          <DateCard
                            key={item}
                            value={item}
                            onClick={() => handleSettingsChange(InputOnChange.removeTime, item)}
                            isActive
                            data-tooltip-id={"day-tip"}
                            data-tooltip-content={ts('clickToRemove')}
                          />
                          <Tooltip delayShow={150} id={'day-tip'}/>
                        </>)
                    }) : <div>{ts("addLessonTimes")}</div>}
                  </div>
                  <div className={"add-time"}>
                      <h3>{ts("addNewTime")}</h3>
                      <form className={"add-time-wrap"}>
                          <input type={"text"}
                                 placeholder={ts("addNewTime")}
                                 value={newTime}
                                 onChange={(e) => setNewTime(e.currentTarget.value)}
                          />
                          <button type={"submit"} className={"transparent-button"} onClick={(e) => {
                            e.preventDefault();
                            handleSettingsChange(InputOnChange.addTime, newTime)
                          }}>
                              <Image className={"plus-icon"} src={addIcon} alt={"Add new time"}/>
                          </button>
                      </form>
                      <p className={"message"}>{newTimeMessage}</p>
                  </div>
              </div>
          </>}
        </div>
        <div className={"payment-methods"}>
          <h2>{ts("paymentMethods")}</h2>
          <div className={"form-input-wrap"}>
            <label>{ts("paymentMethod")}</label>
            <select
              value={teacherInfo.paymentMethod}
              onChange={e => handleSettingsChange(InputOnChange.paymentMethods, e.currentTarget.value)}
              style={{width: "150px"}}
            >
              {teacherInfo.stripeLinked ? PAYMENT_METHODS.map(item => <option key={item}
                                                                              value={item}>{t(item)}</option>) :
                <option value={"on-site"}>{t("on-site")}</option>}
            </select>
          </div>
          <div className={"payment-account"}>
            {!teacherInfo.stripeLinked ?
              <span className={"text-button"} onClick={connectStripeAccount}>{ts("connectPayments")}</span> :
              (teacherInfo.paymentMethod === "online" || teacherInfo.paymentMethod === "both") &&
                <p className={"card-connected"}>{ts("cardConnected")}</p>}
          </div>
        </div>
        <div className={"settings-buttons"}>
          <button style={{margin: 0}} className={"default-button"} onClick={updateTeachersInfo} disabled={!changesMade}>
            {t("update")}
          </button>
          <button style={{margin: 0}} className={"default-button"} onClick={getTeacherInfo} disabled={!changesMade}>
            {t("cancelChanges")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAuthRole(Settings, "teacher");