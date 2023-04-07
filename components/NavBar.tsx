import React, {useContext, useEffect} from 'react';
import Link from "next/link";
import {useRouter} from "next/router";
import {signOut} from "firebase/auth";
import {auth} from "../lib/initFirebase";
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

  useEffect( () => {
    currentUser?.getIdTokenResult().then((idTokenResult) => {
      // Confirm the user is an Admin.
      if (!!idTokenResult.claims.admin) {
        // Show admin UI.
        console.log("admin")
      } else {
        // Show regular user UI.
        console.log(idTokenResult)
      }
    })
      .catch((error) => {
        console.log(error);
      });
  }, [currentUser])

  return (
    <header>
      <nav>
        <div className={"firstPart"}>
          <span><Link href={"/book/BfogrP0V1POnIzBTdyME7csyiH42"}>Book a Session</Link></span>
          {/*<span><Link href={"/keywords"}>Keywords</Link></span>*/}
          {/*<span><Link href={"/addProduct"}>Add Product</Link></span>*/}
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