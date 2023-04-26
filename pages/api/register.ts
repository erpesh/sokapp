// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import admin from "../../lib/firebaseAdmin";

async function addCustomClaimsToUser(uid: string, role: "teacher" | "user") {
  const auth = admin.auth();
  const res = await auth.setCustomUserClaims(uid, { userRole: role });
  console.log(`Custom claims added to user ${uid}`);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method === "POST") {
    const body = JSON.parse(req.body);
    try {
      const uid = body.uid;
      const userRole = body.userRole;
      const response = await addCustomClaimsToUser(uid, userRole);
      res.status(200).json(response);
    } catch (e: any) {
      res.status(500).json(e.message);
    }
  }
  else res.status(200).json("private");
}
