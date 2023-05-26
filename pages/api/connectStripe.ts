import {stripe} from "../../lib/stripe";
import {NextApiRequest, NextApiResponse} from "next";

async function createAndConnectStripeAccount(email: string) {
  try {
    console.log("entered");
    const account = await stripe.accounts.create({
      type: 'standard',
      country: 'GB',
      email,
    });

    const connectedAccountId = account.id;
    console.log("created acc", connectedAccountId, email)

    const accountLink = await stripe.accountLinks.create({
      account: connectedAccountId,
      refresh_url: 'https://sokapp.vercel.app/settings/lessons',
      return_url: 'https://sokapp.vercel.app/settings/lessons',
      type: 'account_onboarding',
    });

    console.log("linked")

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

        const url = await createAndConnectStripeAccount(email);

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