import { createContext } from "react";
import {User} from "@firebase/auth";

interface AuthContextInterface {
  currentUser: User | null,
  setCurrentUser: (user: User) => void
}

const AuthContext = createContext<AuthContextInterface>({
  currentUser: null,
  setCurrentUser: () => { /* Do nothing. */ }
});

export default AuthContext;