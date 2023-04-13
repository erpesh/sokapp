import { createContext } from "react";
import {User} from "@firebase/auth";

interface AuthContextInterface {
  currentUser: User | null,
  isTeacher: boolean,
  signUserOut: () => void
}

const AuthContext = createContext<AuthContextInterface>({
  currentUser: null,
  isTeacher: false,
  signUserOut: () => {/* Do nothing */}
});

export default AuthContext;