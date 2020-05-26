import firebase from "lib/firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { FC } from "react";

const uiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

export const Login: FC = () => {
  return (
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  );
};
