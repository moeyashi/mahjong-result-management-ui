import App from "../components/App";
import { NextPage } from "next";
import ResultPost from "../components/form/ResultPost";
import ResultTable from "../components/result/ResultTable";
import { Container } from "@material-ui/core";

const Index: NextPage = () => {
  return (
    <App>
      <Container>
        <div style={{ marginBottom: 8, marginTop: 8 }}>
          <ResultPost />
        </div>
        <div style={{ marginBottom: 8, marginTop: 8 }}>
          <ResultTable />
        </div>
      </Container>
    </App>
  );
};

export default Index;
