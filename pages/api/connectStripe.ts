import {stripe} from "../../lib/stripe";
import {NextApiRequest, NextApiResponse} from "next";
import {db} from "../../lib/initFirebase";
import {updateDoc, doc} from "firebase/firestore";

async function updateStripeId(docId: string, stripeId: string) {
  try {
    const columnName = "stripeAccountId";

    const documentRef = doc(db, "teachersInfo", docId);
    await updateDoc(documentRef, {
      [columnName]: stripeId,
    });

    console.log("Document updated successfully.");
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}

async function createAndConnectStripeAccount(email: string, docId: string, stripeId: string | null) {
  try {

    let connectedAccountId = stripeId as string;

    if (!stripeId) {
      const account = await stripe.accounts.create({
        type: 'standard',
        country: 'GB',
        email,
      });

      connectedAccountId = account.id;

      await updateStripeId(docId, connectedAccountId);
    }

    const accountLink = await stripe.accountLinks.create({
      account: connectedAccountId,
      refresh_url: `https://sokapp.vercel.app/settings/lessons`,
      return_url: `https://sokapp.vercel.app/settings/lessons/updateStripe?docId=${docId}`,
      type: 'account_onboarding',
    });

    return accountLink.url;
  } catch (error) {
    console.error('Error creating and connecting Stripe account:', error);
    throw error; // Rethrow the error to be handled in the calling function or route
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const body = JSON.parse(req.body);

  switch(req.method) {
    case 'POST':
      // Post data
      try {
        const email = body.email;
        const docId = body.docId;
        const stripeId = body.stripeId;

        const url = await createAndConnectStripeAccount(email, docId, stripeId);

        res.status(200).json({url});
      } catch (e: any) {
        res.status(500).json(e.message);
      }
      break;

    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}