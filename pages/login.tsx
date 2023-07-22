import React, {useContext, useEffect, useState} from 'react';
import {auth} from "@/lib/initFirebase";
import {signInWithEmailAndPassword} from "firebase/auth";
import AuthProviders from "../components/auth-providers";
import Link from "next/link";
import PasswordInput from "../components/password-input";
import {useRouter} from "next/router";
import AuthContext from "../context/authContext";
import {useI18n, useScopedI18n} from "@/locales";

const Login = () => {

  const t = useI18n();
  const ts = useScopedI18n("scope.auth");

  const router = useRouter();
  const {currentUser} = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logInWithEmail = (e: React.FormEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password).then(r => console.log(r));
    router.push("/");
  }

  useEffect(() => {
    if (currentUser) router.push("/appointments");
  }, [currentUser])

  return (
    <div className={"page max-width-smaller"}>
      <h1>{t("logIn")}</h1>
      <form onSubmit={logInWithEmail} className={"register-form"}>
        <div>
          <label>Email</label>
          <input
            placeholder={"Email"}
            autoComplete={"email"}
            type={"email"}
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required/>
        </div>
        <div>
          <label>{t("password")}</label>
          <PasswordInput password={password} setPassword={setPassword}/>
        </div>
        <input type={"submit"} className={"submit-auth"} value={t("submit")}/>
      </form>
      <AuthProviders/>
      <span className={"auth-suggest"}>{ts("dontHaveAcc")} <Link href={"/register"}>{ts("registerHere")}.</Link></span>
    </div>
  );
};

export default Login;