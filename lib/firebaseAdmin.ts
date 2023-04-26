import admin from 'firebase-admin';

import {serviceAccount} from "./initFirebase";

try {
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

export default admin;
