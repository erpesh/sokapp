
interface Props {
  value: string
  onClick: () => void
  isActive: boolean
}

const DateCard = ({value, onClick, isActive} : Props) => {
  return (
    <span className={"date-card" + (isActive ? " active-card" : "")} onClick={onClick}>
      {value}
    </span>
  );
};

export default DateCard;