import React, {useState} from 'react';
import {useI18n} from "@/locales";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";

interface Props {
  password: string,
  setPassword: (password: string) => void,
  isConfirm?: boolean
}

const PasswordInput = ({password, setPassword, isConfirm} : Props) => {

  const t = useI18n();

  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const togglePassword = () => setIsPasswordShown(!isPasswordShown);

  return (
    <span className={"password-input-wrap"}>
      <input
        placeholder={isConfirm ? t("confirmPassword") : t("password")}
        name="password"
        autoComplete={"new-password"}
        type={isPasswordShown ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        required/>
      <div onClick={togglePassword}>
        {isPasswordShown ? <AiFillEye size={20}/> : <AiFillEyeInvisible size={20}/>}
      </div>
    </span>
  );
};

export default PasswordInput;