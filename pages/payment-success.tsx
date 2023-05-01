import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {stripe} from "../lib/stripe";

const PaymentSuccess = () => {

  const router = useRouter();
  const { session_id } = router.query;

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const confirmPayment = async () => {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id as string);
      if (session.payment_status === "paid") {
        setLoading(false);
        setSuccess(true);
      } else {
        setLoading(false);
        setSuccess(false);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    confirmPayment();
  }, [])

  if (loading) return <div>Loading</div>

  return (
    <div>
      {success ? `success ${session_id}` : `not success ${session_id}`}
    </div>
  );
};

export default PaymentSuccess;