// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import admin from "../../lib/firebaseAdmin";
import {stripe} from "../../lib/stripe";

async function addCustomClaimsToUser(uid: string, role: "teacher" | "user") {
  const res = await admin.auth().setCustomUserClaims(uid, { userRole: role });
  console.log(`Custom claims added to user ${uid}`);
}

async function createAndConnectStripeAccount(email: string) {
  console.log("entered")
  const account = await stripe.accounts.create({
    type: 'standard',
    country: 'GB',
    email,
  });

  const connectedAccountId = account.id;
  console.log("created acc", connectedAccountId, email)

  const accountLink = await stripe.accountLinks.create({
    account: connectedAccountId,
    refresh_url: 'https://sokapp.vercel.app/appointments',
    return_url: 'https://sokapp.vercel.app/register',
    type: 'account_onboarding',
  });

  console.log("linked")

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
        const userRole = body.userRole;

        const response = await addCustomClaimsToUser(uid, userRole);

        res.status(200).json(response);
      } catch (e: any) {
        res.status(500).json(e.message);
      }
      break;

    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
