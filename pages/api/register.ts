// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import admin from "../../lib/firebaseAdmin";
import {stripe} from "../../lib/stripe";

async function addCustomClaimsToUser(uid: string, role: "teacher" | "user") {
  const res = await admin.auth().setCustomUserClaims(uid, { userRole: role });
  console.log(`Custom claims added to user ${uid}`);
}

async function createAndConnectStripeAccount(email: string) {
  const account = await stripe.accounts.create({
    type: 'standard',
    country: 'GB',
    email,
  });

  const connectedAccountId = account.id;

  const accountLink = await stripe.accountLinks.create({
    account: connectedAccountId,
    refresh_url: 'https://example.com/reauth',
    return_url: 'https://example.com/return',
    type: 'account_onboarding',
  });

  return accountLink.url;
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
        const uid = body.uid;
        const email = body.email;
        const userRole = body.userRole;

        const res = await addCustomClaimsToUser(uid, userRole);

        if (userRole === "teacher") {
          const url = await createAndConnectStripeAccount(email);
          res.status(200).json({url});
        }
        res.status(200).json(res);
      } catch (e: any) {
        res.status(500).json(e.message);
      }
      break;

    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
