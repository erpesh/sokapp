import {useState} from 'react';
import {auth} from "../lib/initFirebase";
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import AuthProviders from "../components/auth-providers";
import Link from "next/link";
import PasswordInput from "../components/password-input";

const Register = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signUpWithEmail = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // Update the user's display name
        return updateProfile(userCredential.user, {
          displayName: username
        });
      })
        .catch((error) => {
          // Handle errors here
          console.error(error);
        });
    } else alert("Passwords don't match");
  }

  return (
    <div className={"page max-width-smaller"}>
      <h1>Register</h1>
      <form onSubmit={signUpWithEmail} className={"register-form"}>
        <div>
          <label>Username</label>
          <input
            placeholder={"Username"}
            type={"text"}
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            required/>
        </div>
        <div>
          <label>Email</label>
          <input
            placeholder={"Email"}
            type={"email"}
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required/>
        </div>
        <div>
          <label>Password</label>
          <PasswordInput password={password} setPassword={setPassword}/>
        </div>
        <div>
          <label>Confirm password</label>
          <PasswordInput password={confirmPassword} setPassword={setConfirmPassword} isConfirm />
        </div>
        <input type={"submit"} className={"submit-auth"}/>
      </form>
      <AuthProviders isRegister/>
      <span className={"auth-suggest"}>Already have an account? <Link href={"/login"}>Log in</Link> here.</span>

    </div>
  );
};

export default Register;