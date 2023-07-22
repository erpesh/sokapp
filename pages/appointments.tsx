import withAuth from "../utils/withAuth";
import {useContext, useEffect, useMemo, useState} from "react";
import AuthContext from "../context/authContext";
import {db} from "@/lib/initFirebase";
import {collection, getDocs, query, where} from "firebase/firestore";
import {IAppointment, localeFormatter} from "@/utils/dateTimeFormattersCalculators";
import useLocalStorageState from "use-local-storage-state";
import {useScopedI18n, useCurrentLocale, useI18n} from "@/locales";

const APPOINTMENT_STATUSES = ["Upcoming", "Held", "All"];
const DATE_ORDERS = ["Most recent", "Least recent"];

type TAppointmentStatuses = "Upcoming" | "Held" | "All";
type TDateOrders = "Most recent" | "Least recent";

const Appointments = () => {

  const currentLocale = useCurrentLocale();
  const t = useI18n();
  const ts = useScopedI18n("scope.appointments");

  const {currentUser, isTeacher} = useContext(AuthContext);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);

  // filters
  const [statusFilter, setStatusFilter] = useLocalStorageState<TAppointmentStatuses>("statusFilter", {defaultValue: "Upcoming"});
  const [dateOrder, setDateOrder] = useLocalStorageState<TDateOrders>("dateOrder", {defaultValue: "Most recent"});

  const appointmentsRef = collection(db, "appointments");

  async function getAppointments() {
    try {
      const appointmentsQuery = query(
        appointmentsRef,
        where(isTeacher ? "teacherUid" : "uid", "==", currentUser?.uid)
      );
      const querySnapshotAppointments = await getDocs(appointmentsQuery);

      const appointmentsList: IAppointment[] = [];

      querySnapshotAppointments.forEach((doc) => {
        const data = doc.data() as IAppointment;
        data.docId = doc.id;
        appointmentsList.push(data);
      });
      setAppointments(appointmentsList);
    }
    catch (error) {
      console.error(error)
    }
  }

  const getFilteredAppointments = () => {
    let appointmentsCopy = [...appointments];
    const currentDate = new Date();

    if (statusFilter === "Upcoming")
      appointmentsCopy = appointmentsCopy.filter(item => item.datetime.toDate() > currentDate);
    else if (statusFilter === "Held")
      appointmentsCopy = appointmentsCopy.filter(item => item.datetime.toDate() < currentDate);

    if (dateOrder === "Most recent")
      appointmentsCopy = appointmentsCopy.sort((a, b) => a.datetime.toMillis() - b.datetime.toMillis());
    else if (dateOrder === "Least recent")
      appointmentsCopy = appointmentsCopy.sort((a, b) => b.datetime.toMillis() - a.datetime.toMillis());

    return appointmentsCopy;
  }

  const filteredAppointments = useMemo(() => getFilteredAppointments(), [statusFilter, dateOrder, appointments]);

  useEffect(() => {
    if (currentUser?.uid){
      getAppointments();
    }
  }, [currentUser, isTeacher])

  if (!appointments) return <div>Loading</div>

  return (
    <div className={"page"}>
      <div className={"appointment-filters"}>
        <div className={"filter-select-wrap"}>
          <label>{ts('lessonStatus')}</label>
          <select
            value={statusFilter!}
            onChange={e => setStatusFilter(e.currentTarget.value as TAppointmentStatuses)}
            className={"filter"}
          >
            {APPOINTMENT_STATUSES.map(item => <option key={item} value={item}>{ts(item)}</option>)}
          </select>
        </div>
        <div className={"filter-select-wrap"}>
          <label>{ts('dateOrder')}</label>
          <select
            value={dateOrder!}
            onChange={e => setDateOrder(e.currentTarget.value as TDateOrders)}
            className={"filter"}
          >
            {DATE_ORDERS.map(item => <option key={item} value={item}>{ts(item)}</option>)}
          </select>
        </div>
      </div>
      <div className={"appointments"}>
        {filteredAppointments.length > 0 ? <table className={"appointments-table"}>
          <thead>
          <tr>
            <th>{t("date")}</th>
            <th>{t("time")}</th>
            <th>{t("studentName")}</th>
            <th>{ts("age")}</th>
            <th>{t("telNumber")}</th>
            <th>{ts("price")}</th>
            <th>{ts("paid")}</th>
          </tr>
          </thead>
          <tbody>
          {filteredAppointments.map((item, index) => (
            <tr key={index}>
              <td>{item.datetime.toDate().toLocaleDateString(localeFormatter(currentLocale), {
                day: "numeric",
                month: "long",
              })}</td>
              <td>{item.datetime.toDate().toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/London'
              })}</td>
              <td>{item.studentName}</td>
              <td>{item.studentAge}</td>
              <td>{item.telNumber}</td>
              {item.price ? <td>&#163;{item.price}</td> : <td></td>}
              <td>{t(item.paid ? "yes" : "no")}</td>
            </tr>
          ))}
          </tbody>
        </table> : <div className={"no-results"}>{ts("noResults")}</div>}
      </div>
    </div>
  );
};

export default withAuth(Appointments);