import App from "../components/App";
import { NextPage } from "next";
import ResultPost from "../components/form/ResultPost";

const Index: NextPage = () => {
  return (
    <App>
      <ResultPost />
    </App>
  );
};

export default Index;
