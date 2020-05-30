import React, { FC, ReactNode } from "react";
import Header from "./Header";
import { useRecoilValue } from "recoil";
import { Login } from "./Login";
import { useSubscribe } from "hooks/useSubscribe";
import { uidState, userLoadingState } from "hooks/states/userState";
import { Backdrop, CircularProgress } from "@material-ui/core";

const App: FC<{ children: ReactNode }> = ({ children }) => {
  const loadingUser = useRecoilValue(userLoadingState);
  const uid = useRecoilValue(uidState);
  useSubscribe();

  return (
    <main>
      <Header />
      {loadingUser ? (
        <Backdrop open style={{ zIndex: 9999 }}>
          <CircularProgress />
        </Backdrop>
      ) : uid ? (
        children
      ) : (
        <Login />
      )}
    </main>
  );
};

export default App;
