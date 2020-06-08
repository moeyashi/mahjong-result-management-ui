import firebase from "lib/firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { FC } from "react";
import { Grid, Typography } from "@material-ui/core";
import { LockOpen } from "@material-ui/icons";

const _uiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

export const Login: FC<{ uiConfig?: firebaseui.auth.Config }> = ({
  uiConfig = {},
}) => {
  return (
    <Grid container spacing={1}>
      <Grid
        item
        xs={12}
        justify="center"
        alignItems="center"
        alignContent="center"
      >
        <Typography variant="h2" align="center">
          <LockOpen color="primary" />
        </Typography>
        <Typography variant="h5" align="center">
          Please sign in
        </Typography>
      </Grid>
      <Grid item xs={12} justify="center" alignItems="center">
        <StyledFirebaseAuth
          uiConfig={{ ..._uiConfig, ...uiConfig }}
          firebaseAuth={firebase.auth()}
        />
      </Grid>
    </Grid>
  );
};
