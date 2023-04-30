import {auth} from "../lib/initFirebase";
import {signOut} from "firebase/auth";
import {useContext, useEffect} from "react";
import AuthContext from "../context/authContext";

export default function Home() {

  const {currentUser} = useContext(AuthContext);

  const setClaims = async () => {
    const res = await fetch("api/register", {
      method: "POST",
      body: JSON.stringify({
        uid: currentUser?.uid,
        userRole: "teacher"
      })
    })
    console.log(res);
  };

  useEffect(() => {

  }, [])

  return (
    <div className={"page"}>
      <button onClick={setClaims}>Claims</button>
    </div>
  )
}
