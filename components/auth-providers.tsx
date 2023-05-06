import React from 'react';
import Image from "next/image";
import googleIcon from "../assets/google-icon.png";
import facebookIcon from "../assets/facebook-icon.svg";
import {FacebookAuthProvider, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../lib/initFirebase";
import {Scope, useScopedI18n} from "../locales";

interface Props {
  isRegister?: boolean
}

const AuthProviders = ({isRegister} : Props) => {

  const ts = useScopedI18n("scope.auth" as Scope);

  const signInWithProvider = (provider: GoogleAuthProvider | FacebookAuthProvider) => {
    try {
      signInWithPopup(auth, provider)
    }
    catch(error) {
      console.log(error);
    }
  }

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithProvider(provider);
  }

  const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithProvider(provider);
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