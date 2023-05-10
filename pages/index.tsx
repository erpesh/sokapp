import {useEffect} from "react";
import {useRouter} from "next/router";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    router.push("/appointments");
  }, [])

  return (
    <div className={"page"}>
      {/*<button onClick={setClaims}>Claims</button>*/}
    </div>
  )
}
