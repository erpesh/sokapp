import {useRouter} from "next/router";
import {useContext, useEffect, useState} from "react";
import {stripe} from "../lib/stripe";
import {addDoc, collection, DocumentData, Timestamp} from "firebase/firestore";
import AuthContext from "../context/authContext";
import {db} from "../lib/initFirebase";
import {Scope, useScopedI18n} from "../locales";

const PaymentSuccess = () => {

  const ts = useScopedI18n("scope.email" as Scope);

  const {currentUser} = useContext(AuthContext);
  const appointmentsRef = collection(db, "appointments");

  const router = useRouter();
  const { session_id } = router.query;

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const confirmPayment = async () => {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id as string);
      if (session.payment_status === "paid") {

        const {
          studentName,
          studentAge,
          telNumber,
          teacherUid,
          uid,
          userEmail,
          datetime,
          teacherName,
          teacherEmail,
          lessonDate,
          lessonTime
        } = session.metadata;

        await addDoc(appointmentsRef, {
          studentName: studentName,
          studentAge: Number(studentAge),
          telNumber: telNumber,
          paid: true,
          teacherUid: teacherUid as string,
          uid: uid as string,
          datetime: Timestamp.fromMillis(datetime)
        } as DocumentData)
          .then(result => console.log(result))

        const email = currentUser?.email;
        if (email) {
          await fetch(`/api/sendEmail`,
            {
              method: "POST",
              body: JSON.stringify({
                studentName: studentName,
                email: userEmail,
                teacherName: teacherName,
                teacherEmail: teacherEmail,
                lessonDate: lessonDate,
                lessonTime: lessonTime,
                emailSubject: ts("lessonBooking"),
                userBookingHtml: ts("userBookingConfirmationHtml"),
                teacherBookingHtml: ts("teacherBookingHtml"),
              })
            });
        }

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
    if (session_id)
      confirmPayment();
  }, [session_id])

  if (loading) return <div>Loading</div>

  return (
    <div>
      {success ? `success ${session_id}` : `not success ${session_id}`}
    </div>
  );
};

export default PaymentSuccess;