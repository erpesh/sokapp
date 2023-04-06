import React, {useContext, useEffect} from 'react';
import Link from "next/link";
import {useRouter} from "next/router";
import {signOut} from "firebase/auth";
import {auth} from "../initFirebase";
import AuthContext from "../context/authContext";

const NavBar = () => {
  const router = useRouter();

  const {currentUser} = useContext(AuthContext);

  const signUserOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        // setIsAuth(false);
      })
  };

  useEffect(() => {
    console.log(currentUser);
  }, [])

  return (
    <header>
      <nav>
        <div className={"firstPart"}>
          <span><Link href={"/search"}>Search</Link></span>
          <span><Link href={"/keywords"}>Keywords</Link></span>
          <span><Link href={"/addProduct"}>Add Product</Link></span>
        </div>
        <div className={"secondPart"}>
          {currentUser ? <>
          <span>
            <Link href={"/"}>{currentUser?.displayName}</Link>
          </span>
            <span onClick={signUserOut}>Log out</span>
          </> : <>
            <span><Link href={"/login"}>Log in</Link></span>
            <span><Link href={"/register"}>Register</Link></span>
          </>}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;