import firebase from "firebase/app";
import "firebase/firestore";
import config from "./firebase-config";

export let firestore: firebase.firestore.Firestore;
if (firebase.apps.length === 0) {
  firebase.initializeApp(config);
  firestore = firebase.firestore();
}
export default firebase;
