import Image from "next/image";
import checkmark from "../assets/checkmark.svg";
import minusIcon from "../assets/minus-icon.svg";
import TimeIcon from "@/components/time-icon";

interface Props {
  value: string
  onClick: () => void
  isActive?: boolean
  isDisabled?: boolean
  isCheckbox?: boolean
  isRemovable?: boolean
}

const DateCard = ({value, onClick, isActive, isDisabled, isCheckbox, isRemovable} : Props) => {
  return (
    <span
      className={"date-card " +
        (isActive ? "active-card" : "") +
        (isDisabled ? "disabled-card" : "")
    }

      onClick={isDisabled ? () => {} : onClick}
    >
      {value.includes(':') && <TimeIcon timeString={value}/>}
      {value}
    </span>
  );
};

export default DateCard;