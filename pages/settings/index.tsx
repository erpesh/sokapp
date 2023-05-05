import withAuth from "../../utils/withAuth";
import SettingsMenu from "../../components/settings-menu";
import {Scope, useChangeLocale, useCurrentLocale, useScopedI18n} from "../../locales";
import React, {useState} from "react";
import PasswordInput from "../../components/password-input";

const LOCALES = [
  {name: "English", value: "en"},
  {name: "Українська", value: "uk"},
  {name: "Русский", value: "ru"}
];

const Settings = () => {

  const ts = useScopedI18n("scope.settings" as Scope);
  const tsp = useScopedI18n("scope.auth" as Scope);
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

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
              disabled
            />
          </div>
          <div className={"form-input-wrap"}>
            <div className={"form-input-wrap"}>
              <label>{tsp("currentPassword")}</label>
              <PasswordInput password={currentPassword} setPassword={setCurrentPassword}/>
            </div>
            <div className={"form-input-wrap"}>
              <label>{tsp("newPassword")}</label>
              <PasswordInput password={newPassword} setPassword={setNewPassword}/>
            </div>
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