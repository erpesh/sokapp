import {useContext} from 'react';
import Link from "next/link";
import AuthContext from "../context/authContext";

const NavBar = () => {

  const {currentUser, isTeacher, signUserOut} = useContext(AuthContext);

  return (
    <header>
      <nav>
        <div className={"firstPart"}>
          <span><Link href={"/book/BfogrP0V1POnIzBTdyME7csyiH42"}>Book a Session</Link></span>
          {isTeacher && <span><Link href={"/settings"}>Settings</Link></span>}
          {isTeacher && <span><Link href={"/appointments"}>Appointments</Link></span>}
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