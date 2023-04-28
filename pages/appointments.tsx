import withAuth from "../utils/withAuth";
import {useContext, useEffect, useState} from "react";
import AuthContext from "../context/authContext";
import {db} from "../lib/initFirebase";
import {collection, getDocs, orderBy, query, where} from "firebase/firestore";
import {groupedByDay, IAppointment} from "../utils/dateTimeFormattersCalculators";
import AppointmentCard from "../components/appointment-card";
import {useRouter} from "next/router";
import useLocalStorageState from "use-local-storage-state";

const APPOINTMENT_STATUSES = ["Upcoming", "Held", "All"];
const DATE_ORDERS = ["Most recent", "Least recent"];

type TAppointmentStatuses = "Upcoming" | "Held" | "All";
type TDateOrders = "Most recent" | "Least recent";

const Appointments = () => {

  const router = useRouter();
  const {currentUser, isTeacher} = useContext(AuthContext);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);

  // filters
  const [statusFilter, setStatusFilter] = useLocalStorageState<TAppointmentStatuses>("statusFilter", {ssr: true, defaultValue: "Upcoming"});
  const [dateOrder, setDateOrder] = useLocalStorageState<TDateOrders>("dateOrder", {ssr: true, defaultValue: "Most recent"});

  const appointmentsRef = collection(db, "appointments");

  async function getAppointments() {
    const appointmentsQuery = query(
      appointmentsRef,
      where("teacherUid", "==", currentUser?.uid)
    );
    const querySnapshotAppointments = await getDocs(appointmentsQuery);

    const appointmentsList = [];
    querySnapshotAppointments.forEach((doc) => {
      const data = doc.data() as IAppointment;
      data.docId = doc.id;
      appointmentsList.push(data);
    });
    setAppointments(appointmentsList);
  }

  const getFilteredAppointments = () => {
    let appointmentsCopy = [...appointments];
    const currentDate = new Date();

    if (statusFilter === "Upcoming") {
      appointmentsCopy = appointmentsCopy.filter(item => item.datetime.toDate() > currentDate);
    }
    else if (statusFilter === "Held") {
      appointmentsCopy = appointmentsCopy.filter(item => item.datetime.toDate() < currentDate);
    }

    if (dateOrder === "Most recent") {
      appointmentsCopy = appointmentsCopy.sort((a, b) => a.datetime.toMillis() - b.datetime.toMillis());
    }
    else if (dateOrder === "Least recent") {
      appointmentsCopy = appointmentsCopy.sort((a, b) => b.datetime.toMillis() - a.datetime.toMillis());
    }

    return appointmentsCopy;
  }

  useEffect(() => {
    if (currentUser && isTeacher)
      getAppointments();
  }, [currentUser, isTeacher])

  if (!appointments) return <div>Loading</div>

  return (
    <div className={"page"}>
      <div className={"appointment-filters"}>
        <div className={"filter-select-wrap"}>
          <label>Lesson status</label>
          <select
            value={statusFilter!}
            onChange={e => setStatusFilter(e.currentTarget.value as TAppointmentStatuses)}
            className={"filter"}
          >
            {APPOINTMENT_STATUSES.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className={"filter-select-wrap"}>
          <label>Date order</label>
          <select
            value={dateOrder!}
            onChange={e => setDateOrder(e.currentTarget.value as TDateOrders)}
            className={"filter"}
          >
            {DATE_ORDERS.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>
      <div className={"appointment-cards"}>
        {groupedByDay(getFilteredAppointments()).map(([dateString, appointments]) => (
          <div className={"appointment-piece"} key={dateString}>
            <p>{dateString}</p>
            {appointments.map((appointment: IAppointment) => (
              <AppointmentCard key={appointment.docId} appointment={appointment}/>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(Appointments);