import React, { FC, ReactNode } from "react";
import Header from "./Header";

const App: FC<{ children: ReactNode }> = ({ children }) => (
  <main>
    <Header />
    {children}
  </main>
);

export default App;
