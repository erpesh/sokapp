import React, {useContext, useEffect, useState} from 'react';
import {auth} from "../lib/initFirebase";
import {signInWithEmailAndPassword} from "firebase/auth";
import AuthProviders from "../components/auth-providers";
import Link from "next/link";
import PasswordInput from "../components/password-input";
import {useRouter} from "next/router";
import AuthContext from "../context/authContext";

const Login = () => {

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
    if (currentUser) router.push("/");
  }, [currentUser, router])

  return (
    <div className={"page max-width-smaller"}>
      <h1>Login</h1>
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
          <label>Password</label>
          <PasswordInput password={password} setPassword={setPassword}/>
        </div>
        <input type={"submit"} className={"submit-auth"}/>
      </form>
      <AuthProviders/>
      <span className={"auth-suggest"}>Don&apos;t have an account? <Link href={"/register"}>Register</Link> here.</span>
    </div>
  );
};

export default Login;