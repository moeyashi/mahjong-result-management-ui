// import 'firebase/storage' // If you need it
import 'firebase/analytics'; // If you need it
import firebase from 'firebase/app';
import 'firebase/auth'; // If you need it
import 'firebase/firestore'; // If you need it
import { createContext, useContext, useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const clientCredentials = {
  apiKey: 'AIzaSyDlHyhD4WZZOHsV_mA9DlBLJl9v7FHq5QM',
  authDomain: 'mahjong-7374d.firebaseapp.com',
  databaseURL: 'https://mahjong-7374d.firebaseio.com',
  projectId: 'mahjong-7374d',
  storageBucket: 'mahjong-7374d.appspot.com',
  messagingSenderId: '367309424099',
  appId: '1:367309424099:web:a914b87378838a48720cd6',
  measurementId: 'G-VD4ZDKJLMQ',
};

export let firebaseDb: firebase.firestore.Firestore;
// Check that `window` is in scope for the analytics module!
if (typeof window !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(clientCredentials);
  firebaseDb = firebase.firestore();
  // To enable analytics. https://firebase.google.com/docs/analytics/get-started
  if ('measurementId' in clientCredentials) { firebase.analytics(); }
}

export default firebase;

type User = Pick<firebase.User, 'uid' | 'displayName' | 'email' | 'photoURL' >;
type SetUser = (user: User) => void;

export const UserContext = createContext<{user?: User, setUser?: SetUser, loadingUser: boolean}>({loadingUser: true});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState<User>();
  const [loadingUser, setLoadingUser] = useState(true); // Helpful, to update the UI accordingly.

  useEffect(() => {
    // Listen authenticated user
    const unsubscriber = firebase.auth().onAuthStateChanged(async (result) => {
      try {
        if (result) {
          // User is signed in.
          const { uid, displayName, email, photoURL } = result;
          // You could also look for the user doc in your Firestore (if you have one):
          // const userDoc = await firebase.firestore().doc(`users/${uid}`).get()
          setUser({ uid, displayName, email, photoURL });
        } else { setUser(undefined); }
      } catch (error) {
        // Most probably a connection error. Handle appropiately.
        throw error;
      } finally {
        setLoadingUser(false);
      }
    });

    // Unsubscribe auth listener on unmount
    return () => unsubscriber();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook that shorhands the context!
export const useUser = () => useContext(UserContext);

const uiConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],
};

export const SignInScreen = () => {
  return (
    <div>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
};
