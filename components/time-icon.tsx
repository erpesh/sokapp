import {PiSunHorizonFill, PiSunFill, PiMoonFill} from 'react-icons/pi';

interface Props {
  timeString: string
}

const TimeIconComponent = ({timeString}: Props) => {
  const [hoursString, minutesString] = timeString.split(':');
  const hours = parseInt(hoursString, 10);

  let Icon;

  if (hours < 12) {
    Icon = PiSunHorizonFill; // Morning icon
  } else if (hours < 17) {
    Icon = PiSunFill; // Daytime icon
  } else {
    Icon = PiMoonFill; // Nighttime icon
  }

  return (
    <span className={'time-icon'}>
        <Icon/>
    </span>
  );
};

export default TimeIconComponent;