import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyD9XnGf_qa6QOIHfF31BCPTfa7DLmdlZGI",
  authDomain: "podcastify-59b5f.firebaseapp.com",
  projectId: "podcastify-59b5f",
  storageBucket: "podcastify-59b5f.appspot.com",
  messagingSenderId: "912107205117",
  appId: "1:912107205117:web:7a903ea06994",
  measurementId: "G-LX1NSF6BBW"
};

export function initFirebase() {
  const app = initializeApp(firebaseConfig);
  return getAuth(app);
}