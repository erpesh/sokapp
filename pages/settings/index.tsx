import withAuth from "../../utils/withAuth";
import SettingsMenu from "../../components/settings-menu";
import {Scope, useChangeLocale, useCurrentLocale, useI18n, useScopedI18n} from "../../locales";
import React, {useContext, useState} from "react";
import {updateEmail, updatePassword} from "firebase/auth";
import PasswordInput from "../../components/password-input";
import AuthContext from "../../context/authContext";

const LOCALES = [
  {name: "English", value: "en"},
  {name: "Українська", value: "uk"},
  {name: "Русский", value: "ru"}
];

const Settings = () => {

  const t = useI18n();
  const ts = useScopedI18n("scope.settings" as Scope);
  const tsp = useScopedI18n("scope.auth" as Scope);
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();

  const {currentUser} = useContext(AuthContext);

  const [email, setEmail] = useState(currentUser?.email);
  const [newPassword, setNewPassword] = useState("");

  const [emailChanged, setEmailChanged] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const isEmailValid = (email: string) => {
    // regular expression to validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  const isPasswordValid = (password: string) => {
    // Define your password requirements here
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

    return passwordRegex.test(password);
  };

  const updateUserEmail = async () => {
    if (!(currentUser && email)) {
      alert("Enter email.")
      return;
    }
    if (isEmailValid(email)) {
      await updateEmail(currentUser, email)
        .then(() => {
          console.log("Email updated successfully");
        })
        .catch((error) => {
          console.error(error);
        });
    } else alert("Email is not valid");
  }

  const updateUserPassword = async () => {
    if (!(currentUser && newPassword)) {
      alert("Enter password.")
      return;
    }
    if (isPasswordValid(newPassword)) {
      await updatePassword(currentUser, newPassword)
        .then(() => {
          console.log("Password updated successfully");
        })
        .catch((error) => {
          console.error(error);
        });
    } else alert("Password is not valid");
  }

  const emailOnChange = (e) => {
    setEmail(e.currentTarget.value);
    setEmailChanged(true);
  }

  const passwordOnChange = (password: string) => {
    setNewPassword(password);
    setPasswordChanged(true);
  }

  return (
    <div className={"page settings-page"}>
      <SettingsMenu/>
      <div className={"setting-page"}>
        <h1 className={"setting-title"}>{ts("Account")}</h1>
        <div className={"setting-account-cont"}>
          <div className={"form-input-wrap"}>
            <label>Email</label>
            <input
              type={"email"}
              placeholder={"Email"}
              value={email}
              onChange={emailOnChange}
            />
            <button
              className={"basic-button mrg-top-10"}
              onClick={updateUserEmail}
              disabled={!emailChanged}
            >
              {t("update")}
            </button>
          </div>
          <div className={"form-input-wrap"}>
            <label>{tsp("newPassword")}</label>
            <PasswordInput password={newPassword} setPassword={passwordOnChange}/>
            <button
              className={"basic-button mrg-top-10"}
              onClick={updateUserPassword}
              disabled={!passwordChanged}
            >
              {t("update")}
            </button>
          </div>
          <div className={"form-input-wrap"}>
            <label>{ts("language")}</label>
            <select value={currentLocale} onChange={e => changeLocale(e.currentTarget.value)}>
              {LOCALES.map(item => <option key={item.name} value={item.value}>{item.name}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Settings);