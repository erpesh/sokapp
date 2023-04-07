import admin from 'firebase-admin';

import {serviceAccount} from "./initFirebase";

try {
  console.log("RANRANRANRAN")
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: "sokur-appointment"
    });
  }
}
catch (error) {
  console.log(error)
}

export const db = admin.firestore();
export default admin;
