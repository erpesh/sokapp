import Image from "next/image";
import checkmark from "../assets/checkmark.svg";
import crossIcon from "../assets/cross-icon.svg";
import chevronDown from "../assets/chevron-down-icon.svg";
import {IAppointment} from "../utils/dateTimeFormattersCalculators";
import {useWindowWidth} from "@react-hook/window-size";
import {useState} from "react";

interface Props {
  appointment: IAppointment
}

const AppointmentCard = ({appointment}: Props) => {

  const pageWidth = useWindowWidth();

  const [detailsOpened, setDetailsOpened] = useState(false);

  const detailsTrigger = () => setDetailsOpened(!detailsOpened);

  if (pageWidth < 650) {
    return (
      <div className={"appointment-card"}>
        <div className={"appointment-main"}>
          <div className={"basic-appointment"}>
            <div className={"appointment-card-part"}>
              <label>Time</label>
              <span>{appointment.datetime.toDate().toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/London'
              })}</span>
            </div>
            <div className={"appointment-card-part"}>
              <label>Student name</label>
              <span>{appointment.studentName}</span>
            </div>
          </div>
          <div className={"details-btn-wrap"}>
            <button className={"clear-btn"} onClick={detailsTrigger}><Image src={chevronDown} alt={"details"}/></button>
          </div>
        </div>
        {detailsOpened && <div className={"appointment-card-details"}>
          <div className={"appointment-card-part"}>
            <label>Age</label>
            <span>{appointment.studentAge}</span>
          </div>
          <div className={"appointment-card-part"}>
            <label>Tel number</label>
            <span><a className={"tel"} href={`tel:${appointment.telNumber}`}>{appointment.telNumber}</a></span>
          </div>
          <div className={"appointment-card-part"}>
            <label>Paid</label>
            <span className={"appointment-paid-icon"}>
              <Image
                src={appointment.paid ? checkmark : crossIcon}
                alt={appointment.paid ? "Paid" : "Not paid"}
              />
            </span>
          </div>
        </div>}
      </div>
    )
  }

  return (
    <div className={"appointment-card"}>
      <div className={"appointment-card-part"}>
        <label>Time</label>
        <span>{appointment.datetime.toDate().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/London'
        })}</span>
      </div>
      <div className={"appointment-middle"}>
        <div className={"appointment-card-part"}>
          <label>Student name</label>
          <span>{appointment.studentName}</span>
        </div>
        <div className={"appointment-card-part"}>
          <label>Age</label>
          <span>{appointment.studentAge}</span>
        </div>
        <div className={"appointment-card-part"}>
          <label>Tel number</label>
          <span><a className={"tel"} href={`tel:${appointment.telNumber}`}>{appointment.telNumber}</a></span>
        </div>
      </div>
      <div className={"appointment-card-part"}>
        <label>Paid</label>
        <span className={"appointment-paid-icon"}>
          <Image
            src={appointment.paid ? checkmark : crossIcon}
            alt={appointment.paid ? "Paid" : "Not paid"}
          />
        </span>
      </div>
    </div>
  );
};

export default AppointmentCard;