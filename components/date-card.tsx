
interface Props {
  value: string
  onClick: () => void
  isActive: boolean
  isDisabled: boolean
}

const DateCard = ({value, onClick, isActive, isDisabled} : Props) => {
  return (
    <span className={"date-card " + (isActive ? "active-card" : "") + (isDisabled ? "disabled-card" : "")} onClick={isDisabled ? () => {} : onClick}>
      {value}
    </span>
  );
};

export default DateCard;