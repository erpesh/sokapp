import { useRouter } from 'next/router';
import {updateDoc, doc, DocumentData} from 'firebase/firestore';
import { useEffect } from 'react';
import {db} from "../../../lib/initFirebase";


const updateFirestoreDocument = async (docId: string) => {
  const documentRef = doc(db, "teachersInfo", docId);

  await updateDoc(documentRef, { stripeLinked: true } as DocumentData);
};

const UpdateStripePage = () => {
  const router = useRouter();

  useEffect(() => {
    const { docId } = router.query;

    // Check if the request is coming from the expected return_url
    const expectedReturnUrl = 'https://sokapp.vercel.app/settings/lessons/updateStripe';
    const isFromExpectedReturnUrl = router.asPath.startsWith(expectedReturnUrl);

    if (docId && isFromExpectedReturnUrl) {
      updateFirestoreDocument(docId as string)
        .then(() => {
          console.log('Firestore document updated successfully');
        })
        .catch((error) => {
          console.error('Error updating Firestore document:', error);
        })
        .finally(() => {
          router.push("/settings/lessons");
        })
    }
  }, [router.query]);

  return null;
};

export default UpdateStripePage;
