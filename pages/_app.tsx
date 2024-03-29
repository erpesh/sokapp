import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NavBar from "../components/nav-bar";
import AuthContext from "../context/authContext";
import useCurrentUser from "../hooks/useCurrentUser";
import {ComponentType, ReactNode} from "react";
import {I18nProvider} from "@/locales";
import en from "../locales/en";

export default function App({ Component, pageProps }: AppProps) {

  const [currentUser, isTeacher, signUserOut] = useCurrentUser();

  return <MultiContextProvider providers={[
      stackContext(I18nProvider, {locale: pageProps.locale, fallback: <p>Loading initial locale client-side</p>, fallbackLocale: en}),
      stackContext(AuthContext.Provider, {value : {currentUser, isTeacher, signUserOut}})
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
