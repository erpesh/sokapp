import withAuth from "../utils/withAuth";
import {useContext, useEffect, useState} from "react";
import AuthContext from "../context/authContext";
import {db} from "../lib/initFirebase";
import {collection, doc, DocumentData, getDocs, query, updateDoc, where} from "firebase/firestore";
import {ITeacherInfo} from "../utils/types";
import DateCard from "../components/date-card";
import addIcon from "../assets/add-icon.svg";
import Image from "next/image";
import {updateProfile} from "firebase/auth";
import useWarnBeforeLeavingPage from "../hooks/useWarnBeforeLeavingPage";

const LESSON_DURATIONS = ["30 min", "1 hour", "2 hours"];
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

enum InputOnChange {
  fullName,
  lessonDuration,
  lessonPrice,
  lessonDays,
  removeTime,
  addTime
}

const Settings = () => {

  const [changesMade, setChangesMade] = useState(false);
  useWarnBeforeLeavingPage(changesMade);

  const {currentUser, isTeacher} = useContext(AuthContext);
  const [documentId, setDocumentId] = useState("");
  const [teacherInfo, setTeacherInfo] = useState<ITeacherInfo>();

  const [fullName, setFullName] = useState(currentUser?.displayName);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [newTime, setNewTime] = useState("");
  const [newTimeMessage, setNewTimeMessage] = useState("");

  const teachersInfoRef = collection(db, "teachersInfo");

  const getTeacherInfoCopy = (): ITeacherInfo => {
    return {...teacherInfo} as ITeacherInfo
  };

  async function getTeacherInfo() {
    const teachersInfoQuery = query(teachersInfoRef, where("uid", "==", currentUser?.uid));
    const querySnapshotTI = await getDocs(teachersInfoQuery);
    querySnapshotTI.forEach((doc) => {
      const data = doc.data() as ITeacherInfo;
      setDocumentId(doc.id);
      setTeacherInfo(data);
      setChangesMade(false);
    });
  }

  async function updateTeachersInfo(e) {
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
  }

  const handleSettingsChange = (name: InputOnChange, value) => {
    const tiCopy = getTeacherInfoCopy();
    switch (name) {
      case InputOnChange.fullName:
        setFullName(value);
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
            setNewTimeMessage("This time is already active")
          } else {
            tiCopy.lessonDaysTimes[activeDayIndex].time.push(value);
            tiCopy.lessonDaysTimes[activeDayIndex].time.sort();
            setNewTimeMessage("");
          }
        } else {
          setNewTimeMessage("Time should be in \"14:30\"-like format")
        }
        break;

      default:
        break;
    }
    setTeacherInfo(tiCopy);
    setChangesMade(true);
  }

  useEffect(() => {
    if (currentUser && isTeacher)
      getTeacherInfo();
  }, [currentUser, isTeacher])

  if (!teacherInfo) return <div>Loading</div>

  return (
    <div className={"page"}>
      <h1 style={{marginBottom: "1rem"}}>{currentUser?.displayName}</h1>
      <div className={"double-input-container"}>
        <div className={"form-input-wrap"}>
          <label>Full name</label>
          <input
            type={"text"}
            placeholder={"Full name"}
            value={fullName}
            onChange={e => handleSettingsChange(InputOnChange.fullName, e.currentTarget.value)}
          />
        </div>
        <div className={"form-input-wrap"}>
          <label>Lesson duration</label>
          <select
            value={teacherInfo.lessonDuration}
            onChange={e => handleSettingsChange(InputOnChange.lessonDuration, e.currentTarget.value)}
          >
            {LESSON_DURATIONS.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className={"form-input-wrap"}>
          <label>Lesson price</label>
          <input
            type={"number"}
            placeholder={"Lesson price"}
            value={teacherInfo.lessonPrice}
            onChange={e => handleSettingsChange(InputOnChange.lessonPrice, e.currentTarget.value)}
          />
        </div>
      </div>
      <div className={"lesson-times-setting"}>
        <h2 style={{margin: "1.5rem 0"}}>Days of lessons</h2>
        <div className={"lesson-days"}>
          {DAYS_OF_WEEK.map(dayOfWeek => <DateCard
            key={dayOfWeek}
            value={dayOfWeek}
            isActive={teacherInfo?.lessonDaysTimes?.map(item => item.day).includes(dayOfWeek)}
            onClick={() => handleSettingsChange(InputOnChange.lessonDays, dayOfWeek)}
            isCheckbox
          />)}
        </div>
        {teacherInfo.lessonDaysTimes.length > 0 && <>
          <h2 style={{margin: "1.5rem 0"}}>Lesson times</h2>
          <div style={{marginBottom: "1.25rem"}}>
            <select
              value={activeDayIndex}
              onChange={(e) => {setActiveDayIndex(Number(e.currentTarget.value))}}
              style={{width: "125px"}}
            >
              {teacherInfo.lessonDaysTimes.map((item, index) => <option key={item.day}
                                                                        value={index}>{item.day}</option>)}
            </select>
          </div>
          <div className={"lesson-times"}>
            <div className={"lesson-days"}>
              {teacherInfo.lessonDaysTimes[activeDayIndex].time.length > 0 ? teacherInfo.lessonDaysTimes[activeDayIndex].time.map(item => {
                return <DateCard
                  key={item}
                  value={item}
                  onClick={() => handleSettingsChange(InputOnChange.removeTime, item)}
                  isRemovable
                  isActive
                />
              }) : <div>Add lesson times</div>}
            </div>
            <div className={"add-time"}>
              <h3>Add new time</h3>
              <form className={"add-time-wrap"}>
                <input type={"text"}
                       placeholder={"Add new time"}
                       value={newTime}
                       onChange={(e) => setNewTime(e.currentTarget.value)}
                />
                <button type={"submit"} className={"basic-button"} onClick={(e) => {
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
      <div className={"settings-buttons"}>
        <button className={"basic-button"} onClick={updateTeachersInfo} disabled={!changesMade}>Update</button>
        <button className={"basic-button"} onClick={getTeacherInfo} disabled={!changesMade}>Cancel changes</button>
      </div>
    </div>
  );
};

export default withAuth(Settings);