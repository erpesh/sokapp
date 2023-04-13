import Image from "next/image";
import checkmark from "../assets/checkmark.svg";
import minusIcon from "../assets/minus-icon.svg";

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
      {value}
      {isCheckbox && isActive && !isRemovable && <Image src={checkmark} alt={"Checkmark"}/>}
      {isRemovable && <Image className={"remove-image"} src={minusIcon} alt={"Remove"} onClick={onClick}/>}
    </span>
  );
};

export default DateCard;