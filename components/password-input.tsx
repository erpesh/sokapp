import React, {useState} from 'react';
import eyeIcon from "../assets/eye-icon.png";
import Image from "next/image";

interface Props {
  password: string,
  setPassword: (password: string) => void,
  isConfirm?: boolean
}

const PasswordInput = ({password, setPassword, isConfirm} : Props) => {

  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const togglePassword = () => setIsPasswordShown(!isPasswordShown);

  return (
    <span className={"password-input-wrap"}>
      <input
        placeholder={isConfirm ? "Confirm password" : "Password"}
        name="password"
        autoComplete={"new-password"}
        type={isPasswordShown ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        required/>
      <div onClick={togglePassword}>
        <Image alt={"Eye icon"} src={eyeIcon}/>
      </div>
    </span>
  );
};

export default PasswordInput;