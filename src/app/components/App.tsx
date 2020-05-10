import { Header } from "./Header";

import React, { FC } from "react";
import firebase from "firebase";
import "@firebase/firestore";
import * as Ballcap from "@1amageek/ballcap";
import config from "../firebase-config";

if (firebase.apps.length === 0) {
  Ballcap.initialize(firebase.initializeApp(config).firestore());
}

const App: FC<{ children?: any }> = ({ children }) => {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
};

export default App;
