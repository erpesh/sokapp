import React from 'react';
import Image from "next/image";
import googleIcon from "../assets/google-icon.png";
import facebookIcon from "../assets/facebook-icon.svg";
import {FacebookAuthProvider, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../lib/initFirebase";
import {Scope, useScopedI18n} from "../locales";
import {User} from "@firebase/auth";

interface Props {
  isRegister?: boolean
  addSecondaryDetails?: (user: User) => void
}

const AuthProviders = ({isRegister, addSecondaryDetails} : Props) => {

  const ts = useScopedI18n("scope.auth" as Scope);

  const signInWithProvider = async (provider: GoogleAuthProvider | FacebookAuthProvider) => {
    try {
      await signInWithPopup(auth, provider).then(async (userCredential) => {
        if (addSecondaryDetails)
          await addSecondaryDetails(userCredential.user);
      })
    }
    catch(error) {
      console.log(error);
    }
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithProvider(provider);
  }

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    await signInWithProvider(provider);
  }

  return (
    <div className={"auth-providers"}>
      <div onClick={signInWithGoogle} id="customBtn" className="customGPlusSignIn">
        <span className="icon"><Image alt={"Google icon"} src={googleIcon}/></span>
        <span className="buttonText">{ts(`${isRegister ? "register" : "login"}With`, {provider: "Google"})}</span>
      </div>
      <div onClick={signInWithFacebook} id="customBtn" className="customGPlusSignIn">
        <span className="icon"><Image alt={"Google icon"} src={facebookIcon}/></span>
        <span className="buttonText">{ts(`${isRegister ? "register" : "login"}With`, {provider: "Facebook"})}</span>
      </div>
    </div>
  );
};

export default AuthProviders;