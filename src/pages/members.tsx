import App from "../components/App";
import { NextPage } from "next";
import { Container, Paper } from "@material-ui/core";
import { MemberList } from "components/member/MemberList";

const MemberPage: NextPage = () => {
  return (
    <App>
      <Container maxWidth="sm">
        <div style={{ marginBottom: 8, marginTop: 8 }}>
          <Paper>
            <MemberList />
          </Paper>
        </div>
      </Container>
    </App>
  );
};

export default MemberPage;
