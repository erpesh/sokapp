import {useContext} from 'react';
import Link from "next/link";
import AuthContext from "../context/authContext";
import Image from "next/image";
import fullLogo from "../assets/full-logo.svg";
import smallLogo from "../assets/logo.svg";
import logoutIcon from "../assets/logout-icon.svg";
import settingsIcon from "../assets/settings-icon.svg";
import scheduleIcon from "../assets/schedule-icon.svg";
import {useI18n} from "../locales";

const NavBar = () => {

  const t = useI18n();
  const {currentUser, signUserOut} = useContext(AuthContext);

  return (
    <header>
      <nav>
        <div className={"firstPart"}>
          <Link href={"/"} className={"logo-nav"}>
            <Image className={"full-logo"} src={fullLogo} alt={"logo"}/>
            <Image className={"small-logo"} src={smallLogo} alt={"logo"}/>
          </Link>
          <div className={"nav-links"}>
              <span className={"nav-span"}>
                <Link href={"/book/BfogrP0V1POnIzBTdyME7csyiH42"}>
                  {t("bookLessonFirst")}<span className={"lesson-text"}>{" " + t("bookLessonSecond")}</span>
                </Link>
              </span>
          </div>
        </div>
        <div className={"secondPart"}>
          {currentUser ? <>
              <span className={"nav-span"}>
                <Link href={"/appointments"}>
                  <Image className={"nav-icon"} src={scheduleIcon} alt={"appointments"}/>
                  <span className={"nav-span desktop-display"}>{t("appointments")}</span>
                </Link>
              </span>
              <span className={"nav-span"}>
                <Link href={"/settings"}>
                  <Image className={"nav-icon"} src={settingsIcon} alt={"settings"}/>
                  <span className={"nav-span desktop-display"}>{t("settings")}</span>
                </Link>
              </span>
              <span className={"nav-span logout-wrap"} onClick={signUserOut}>
                <Image className={"logout-icon"} src={logoutIcon} alt={"log out"}/>
              </span>
          </> : <>
            <span className={"nav-span"}><Link href={"/login"}>{t("logIn")}</Link></span>
          </>}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;