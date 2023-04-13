import {useEffect, useState} from "react";
import {auth} from "../lib/initFirebase";
import {User} from "@firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import {signOut} from "firebase/auth";
import {useRouter} from "next/router";

type ICurrentUserHook = [User | null, boolean, () => void];

export default function useCurrentUser(): ICurrentUserHook {

  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    user?.getIdTokenResult().then((idTokenResult) => {
      setIsTeacher(!!idTokenResult.claims.teacher);
    })
      .catch((error) => {
        console.log(error);
      });
  }, [user])

  const signUserOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        setIsTeacher(false);
      })
    router.push("/login");
  };

  return <[User | null, boolean, () => void]> [user, isTeacher, signUserOut];
}