// import 'firebase/firestore' // If you need it
// import 'firebase/storage' // If you need it
import 'firebase/analytics'; // If you need it
import firebase from 'firebase/app';
import 'firebase/auth'; // If you need it
import { createContext, useContext, useEffect, useState } from 'react';

const clientCredentials = {
  apiKey: 'AIzaSyAx07Fn5PNaoHlT7mDPjO_KunhMmsBRBrM',
  authDomain: 'free-242007.firebaseapp.com',
  databaseURL: 'https://free-242007.firebaseio.com',
  projectId: 'free-242007',
  storageBucket: 'free-242007.appspot.com',
  messagingSenderId: '897557736055',
  appId: '1:897557736055:web:7ae0de328023124a',
  measurementId: 'G-XVDY8MFWE5',
};

// Check that `window` is in scope for the analytics module!
if (typeof window !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(clientCredentials);
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
