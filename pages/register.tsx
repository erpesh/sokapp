import {useState} from 'react';
import {auth, db} from "../lib/initFirebase";
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import AuthProviders from "../components/auth-providers";
import Link from "next/link";
import PasswordInput from "../components/password-input";
import Switch from "react-switch";
import {useRouter} from "next/router";
import {addDoc, collection, DocumentData} from "firebase/firestore";

const Register = () => {

  const teachersInfoRef = collection(db, "teachersInfo");

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [forename, setForename] = useState("Beta");
  const [lastName, setLastName] = useState("Inoue");
  const [email, setEmail] = useState("betak9894@gmail.com");
  const [password, setPassword] = useState("Wormixtoper24");
  const [confirmPassword, setConfirmPassword] = useState("Wormixtoper24");
  const [isTeacher, setIsTeacher] = useState(false);

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

  const signUpWithEmail = async (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      try {
        await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
          // Update the user's display name
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
      catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          alert("This email is already in use");
        } else if (error.code === 'auth/weak-password') {
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
      <h1>Register</h1>
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
          <label>Password</label>
          <PasswordInput password={password} setPassword={setPassword}/>
        </div>
        <div className={"auth-inp-wrap"}>
          <label>Confirm password</label>
          <PasswordInput password={confirmPassword} setPassword={setConfirmPassword} isConfirm />
        </div>
        <div className={"auth-inp-wrap"}>
          <Switch onChange={(checked) => setIsTeacher(checked)} checked={isTeacher} />
        </div>
        <input type={"submit"} className={"submit-auth"}/>
      </form>
      <AuthProviders isRegister/>
      <span className={"auth-suggest"}>Already have an account? <Link href={"/login"}>Log in</Link> here.</span>

    </div>
  );
};

export default Register;