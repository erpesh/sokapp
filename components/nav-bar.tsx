import {useContext} from 'react';
import Link from "next/link";
import AuthContext from "../context/authContext";
import {useWindowWidth} from "@react-hook/window-size";
import Image from "next/image";
import fullLogo from "../assets/full-logo.svg";
import smallLogo from "../assets/logo.svg";
import logoutIcon from "../assets/logout-icon.svg";
import settingsIcon from "../assets/settings-icon.svg";
import scheduleIcon from "../assets/schedule-icon.svg";

const NavBar = () => {

  const pageWidth = useWindowWidth();

  const {currentUser, isTeacher, signUserOut} = useContext(AuthContext);

  if (isTeacher) {
    return (
      <header>
        <nav>
          <div className={"firstPart"}>
            <Link href={"/"} className={"logo-nav"}>
              {pageWidth > 550 ? <Image className={"full-logo"} src={fullLogo} alt={"logo"}/> :
                <Image className={"small-logo"} src={smallLogo} alt={"logo"}/>}
            </Link>
            <div className={"nav-links"}>
              <span className={"nav-span"}><Link href={"/book/BfogrP0V1POnIzBTdyME7csyiH42"}>Book{pageWidth > 400 && " a lesson"}</Link></span>
            </div>
          </div>
          <div className={"secondPart"}>
            <span className={"nav-span"}>
              <Link href={"/appointments"}>
                <Image className={"nav-icon"} src={scheduleIcon} alt={"appointments"}/>
              </Link>
            </span>
            <span className={"nav-span"}>
              <Link href={"/settings"}>
                <Image className={"nav-icon"} src={settingsIcon} alt={"settings"}/>
              </Link>
            </span>
            <span className={"nav-span logout-wrap"} onClick={signUserOut}>
              <Image className={"logout-icon"} src={logoutIcon} alt={"log out"}/>
            </span>
          </div>
        </nav>
      </header>
    );
  } else {
    return (
      <header>
        <nav>
          <div className={"firstPart"}>
            <Link href={"/"} className={"logo-nav"}>
              {pageWidth > 550 ? <Image className={"full-logo"} src={fullLogo} alt={"logo"}/> :
                <Image className={"small-logo"} src={smallLogo} alt={"logo"}/>}
            </Link>
            <div className={"nav-links"}>
              <span className={"nav-span"}><Link href={"/book/BfogrP0V1POnIzBTdyME7csyiH42"}>Book{pageWidth > 400 && " a lesson"}</Link></span>
            </div>
          </div>
          <div className={"secondPart"}>
            {currentUser ? <>
              <span className={"nav-span"}>
                <Link href={"/appointments"}>
                  <Image className={"nav-icon"} src={scheduleIcon} alt={"appointments"}/>
                </Link>
              </span>
              <span className={"nav-span logout-wrap"} onClick={signUserOut}>
                <Image className={"logout-icon"} src={logoutIcon} alt={"log out"}/>
              </span>
            </> : <>
              <span className={"nav-span"}><Link href={"/login"}>Log in</Link></span>
            </>}
          </div>
        </nav>
      </header>
    );
  }
};

export default NavBar;