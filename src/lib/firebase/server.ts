const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

let appInstance;

export async function initServerApp() {
  if (appInstance) {
    return appInstance;
  }

  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    const errorMessage = 'Firebase Admin SDK credentials are not set in .env file. Please check your environment variables.';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const admin = await import('firebase-admin/app');
  if (admin.getApps().length > 0) {
    appInstance = admin.getApp();
    return appInstance;
  }

  appInstance = admin.initializeApp({
    credential: admin.cert(serviceAccount),
  });

  return appInstance;
}
