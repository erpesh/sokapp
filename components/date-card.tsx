import TimeIcon from "@/components/time-icon";

interface Props extends React.HTMLAttributes<HTMLSpanElement>{
  value: string
  onClick: () => void
  isActive?: boolean
  isDisabled?: boolean
}

const DateCard = ({value, onClick, isActive, isDisabled, ...props} : Props) => {
  return (
    <span
      className={"date-card " +
        (isActive ? "active-card" : "") +
        (isDisabled ? "disabled-card" : "")
    }
      onClick={isDisabled ? () => {} : onClick}
      {...props}
    >
      {value.includes(':') && <TimeIcon timeString={value}/>}
      {value}
    </span>
  );
};

export default DateCard;