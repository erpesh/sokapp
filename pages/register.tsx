import React, {useState} from 'react';
import {auth, db} from "../lib/initFirebase";
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import AuthProviders from "../components/auth-providers";
import Link from "next/link";
import PasswordInput from "../components/password-input";
import Switch from "react-switch";
import {useRouter} from "next/router";
import {addDoc, collection, DocumentData} from "firebase/firestore";
import {Scope, useI18n, useScopedI18n} from "../locales";

const Register = () => {

  const t = useI18n();
  const ts = useScopedI18n("scope.auth" as Scope);

  const teachersInfoRef = collection(db, "teachersInfo");

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [forename, setForename] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);

  const addTeacherInfoDoc = async (teacherEmail: string | null, teacherName: string | null, uid: string) => {
    return await addDoc(teachersInfoRef, {
      lessonDaysTimes: [],
      lessonDuration: "1 hour",
      lessonPrice: 10,
      teacherEmail: teacherEmail,
      teacherName: teacherName,
      uid: uid

    } as DocumentData)
      .then(result => console.log(result))
  }

  const signUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!privacyPolicy) {
      alert("Accept Privacy Policy to proceed");
      return;
    }
    if (password === confirmPassword) {
      try {
        await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {

          setLoading(true);

          const user = userCredential.user;

          const res = await fetch("api/register", {
            method: "POST",
            body: JSON.stringify({
              uid: user.uid,
              userRole: isTeacher ? "teacher" : "user"
            })
          }).then( async () => {
            await userCredential.user.getIdToken(true);
          })

          if (isTeacher) await addTeacherInfoDoc(user.email, user.displayName, user.uid);

          await updateProfile(userCredential.user, {
            displayName: `${forename} ${lastName}`
          });

          await router.push("/");
          window.location.reload();
        })
      }
      catch (error: any) {
        if (error?.code === 'auth/email-already-in-use') {
          alert("This email is already in use");
        } else if (error?.code === 'auth/weak-password') {
          alert("Your password is weak")
        } else {
          alert("Something went wrong, try again")
        }
      }
    }
    else alert("Passwords don't match");
  }

  if (loading) return <div>Loading</div>

  return (
    <div className={"page max-width-smaller"}>
      <h1>{t("register")}</h1>
      <form onSubmit={signUpWithEmail} className={"register-form"}>
        <div className={"full-name-cont"}>
          <div className={"auth-inp-wrap"}>
            <label>Forename</label>
            <input
              placeholder={"Forename"}
              name={"forename"}
              autoComplete={"given-name"}
              type={"text"}
              value={forename}
              onChange={(e) => setForename(e.currentTarget.value)}
              required/>
          </div>
          <div className={"auth-inp-wrap"}>
            <label>Last name</label>
            <input
              placeholder={"Last name"}
              name={"family-name"}
              autoComplete={"family-name"}
              type={"text"}
              value={lastName}
              onChange={(e) => setLastName(e.currentTarget.value)}
              required/>
          </div>
        </div>
        <div className={"auth-inp-wrap"}>
          <label>Email</label>
          <input
            placeholder={"Email"}
            autoComplete={"email"}
            name="email"
            type={"email"}
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required/>
        </div>
        <div className={"auth-inp-wrap"}>
          <label>{t("password")}</label>
          <PasswordInput password={password} setPassword={setPassword}/>
        </div>
        <div className={"auth-inp-wrap"}>
          <label>{t("confirmPassword")}</label>
          <PasswordInput password={confirmPassword} setPassword={setConfirmPassword} isConfirm />
        </div>
        <div className={"checkbox-container"}>
          <input
            type={"checkbox"}
            checked={isTeacher}
            onChange={e => setIsTeacher(e.currentTarget.checked)}
          />
          <span>{ts("signInAsTeacher")}</span>
        </div>
        <div className={"checkbox-container"}>
          <input
            type={"checkbox"}
            checked={privacyPolicy}
            onChange={e => setPrivacyPolicy(e.currentTarget.checked)}
          />
          <span>{ts("privacyPolicy1")}<Link href="/privacy-policy">{ts("privacyPolicy2")}</Link>.</span>
        </div>
        <input type={"submit"} className={"submit-auth"} value={t("submit")}/>
      </form>
      <AuthProviders isRegister/>
      <span className={"auth-suggest"}>{ts("alreadyHaveAcc")} <Link href={"/login"}>{ts("loginHere")}.</Link></span>

    </div>
  );
};

export default Register;