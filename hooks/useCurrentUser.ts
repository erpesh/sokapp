import {useEffect, useState} from "react";
import {UserImpl} from "@firebase/auth/dist/internal";
import {auth} from "../initFirebase";
import {User} from "@firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";

export default function useCurrentUser(): [User | null, (user: UserImpl) => void] {

  const [user, loading, error] = useAuthState(auth);
  const [ currentUser, setCurrentUser ] = useState<User | null>(null);

  useEffect(() => {
    setCurrentUser(auth.currentUser ? auth.currentUser : null);
  }, [user, loading])

  return [currentUser, setCurrentUser];
}