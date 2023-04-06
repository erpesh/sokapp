import React from 'react';
import Image from "next/image";
import googleIcon from "../assets/google-icon.png";
import facebookIcon from "../assets/facebook-icon.svg";
import {FacebookAuthProvider, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../initFirebase";


const AuthProviders = () => {

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(result => {
        localStorage.setItem("isAuth", "true");
      })
  }

  const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then(result => {
        localStorage.setItem("isAuth", "true");
      })
  }

  return (
    <div className={"auth-providers"}>
      <div onClick={signInWithGoogle} id="customBtn" className="customGPlusSignIn">
        <span className="icon"><Image alt={"Google icon"} src={googleIcon}/></span>
        <span className="buttonText">Register with Google</span>
      </div>
      <div onClick={signInWithFacebook} id="customBtn" className="customGPlusSignIn">
        <span className="icon"><Image alt={"Google icon"} src={facebookIcon}/></span>
        <span className="buttonText">Register with Facebook</span>
      </div>
    </div>
  );
};

export default AuthProviders;