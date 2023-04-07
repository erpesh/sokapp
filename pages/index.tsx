import {auth} from "../lib/initFirebase";
import {signOut} from "firebase/auth";

export default function Home() {

  const signUserOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        // setIsAuth(false);
      })
  };

  return (
    <div className={"page"}>
      Sokur
      <button onClick={signUserOut}>Logout</button>
    </div>
  )
}
