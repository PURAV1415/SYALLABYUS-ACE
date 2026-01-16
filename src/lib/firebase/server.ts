import type {App} from 'firebase-admin/app';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

let appInstance: App | undefined;

export async function initServerApp(): Promise<App> {
  if (appInstance) {
    return appInstance;
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
