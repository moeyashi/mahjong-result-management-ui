import App from "../components/App";
import { NextPage } from "next";
import ResultPost from "../components/form/ResultPost";
import ResultTable from "../components/result/ResultTable";

const Index: NextPage = () => {
  return (
    <App>
      <ResultPost />
      <ResultTable />
    </App>
  );
};

export default Index;
