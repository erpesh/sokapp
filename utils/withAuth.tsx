import {NextComponentType} from "next";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/lib/initFirebase";

interface WithAuthProps {}
interface WithAuthRoleProps {
  role: string
}
function withAuth<T extends WithAuthProps = WithAuthProps>(Component: NextComponentType<T>) {
  const Auth = (props: T) => {

    const router = useRouter();
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
      return <div>Loading</div>
    }

    if (!user) {
      router.push("/login");
    }

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
}

export function withAuthRole<T extends WithAuthRoleProps = WithAuthRoleProps>(
  Component: NextComponentType<T>,
  role: string
) {
  const Auth = (props: Omit<T, keyof WithAuthRoleProps>) => {

    const router = useRouter();
    const [user, loading, error] = useAuthState(auth);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

      if (!loading) {
        setIsLoading(false);
      }

      user?.getIdTokenResult().then((idTokenResult) => {

        if (idTokenResult.claims.userRole !== role) {
          router.back();
        }
      })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [loading]);

    if (isLoading) {
      return <div>Loading</div>
    }

    if (!user) {
      router.push("/login")
    }

    return <Component {...props}/>;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;

}

export default withAuth;