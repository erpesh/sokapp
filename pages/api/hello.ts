// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import admin from "../../lib/firebaseAdmin";

async function addCustomClaimsToUser(uid: string) {
  // const user = await admin.auth().getUser(uid);
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  console.log(`Custom claims added to user ${uid}`);
  return '12';
}

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  // const nn = await addCustomClaimsToUser('BfogrP0V1POnIzBTdyME7csyiH42')

  console.log("asfdasf")

  if (req.method === "POST") {
    const body = JSON.parse(req.body);
    try {
      const uid = body.uid;
      const response = await addCustomClaimsToUser(uid);
      res.status(200).json(response);
    } catch (e: any) {
      res.status(500).json(e.message);
    }
  }

  // res.status(200).json({ name: nn })
}
