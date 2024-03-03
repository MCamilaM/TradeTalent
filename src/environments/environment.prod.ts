import { Constants } from './environment.constants';

export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: Constants.API_KEY,
    authDomain: Constants.AUTH_DOMAIN,
    projectId: Constants.PROJECT_ID,
    storageBucket: Constants.STORAGE_BUCKET,
    messagingSenderId: Constants.MESSAGING_SENDER_ID,
    appId: Constants.APP_ID
  }
};

