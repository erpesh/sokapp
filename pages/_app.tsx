import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NavBar from "../components/NavBar";
import AuthContext from "../context/authContext";
import useCurrentUser from "../hooks/useCurrentUser";
import {ComponentType, ReactNode} from "react";

export default function App({ Component, pageProps }: AppProps) {

  const [currentUser, setCurrentUser] = useCurrentUser();

  return <MultiContextProvider providers={[
    stackContext(AuthContext.Provider, {value : {currentUser, setCurrentUser}})
  ]}>
    <NavBar/>
    <Component {...pageProps} />
  </MultiContextProvider>
}

type StackContext = (children: ReactNode) => ReactNode;

function stackContext<P, >(Provider: ComponentType<P>, props: P): StackContext {
  return function StackContext(children) {
    return <Provider {...props}>{children}</Provider>;
  };
}

interface MultiContextProviderProps {
  providers: Array<StackContext>
  children: ReactNode
}

function MultiContextProvider({ providers = [], children }: MultiContextProviderProps) {
  const stack = providers.reduce((previousValue, stackContext) => stackContext(previousValue), children);

  return <>{stack}</>;
}
