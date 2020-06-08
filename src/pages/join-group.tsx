import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  TextField,
  TextFieldProps,
  Typography,
} from "@material-ui/core";
import { AssignmentInd } from "@material-ui/icons";
import { Login } from "components/Login";
import { uidState, userLoadingState } from "hooks/states/userState";
import { useSubscribe } from "hooks/useSubscribe";
import { firestore } from "lib/firebase";
import Group from "models/Group";
import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useSnackbar } from "notistack";
import { FC, FormEvent, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const useGroup = () => {
  const router = useRouter();
  const groupId = router.query.groupId as string | undefined;
  const [group, setGroup] = useState<Group>();
  useEffect(() => {
    let didCancel = false;
    const fetch = async (): Promise<void> => {
      if (!firestore || !groupId) {
        return;
      }
      const snap = await firestore.collection("groups").doc(groupId).get();
      if (!didCancel) {
        setGroup(Group.fromSnap(snap));
      }
    };
    fetch();
    return () => {
      didCancel = true;
    };
  }, [groupId]);
  return group;
};

const JoinGroup: FC = () => {
  const router = useRouter();
  const inviteParam = router.query.inviteParam as string | undefined;
  const { enqueueSnackbar } = useSnackbar();
  const uid = useRecoilValue(uidState);
  const group = useGroup();
  const [name, setName] = useState("");
  const handleChange: TextFieldProps["onChange"] = (e) => {
    setName(e.target.value);
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inviteParam || !uid || !group || !name) {
      return;
    }
    const result = await group.addMember(uid, name, inviteParam);
    if (result) {
      alert(result);
      return;
    }
    enqueueSnackbar(
      `${group.name}に参加しました。左上のプルダウンから選択できます。`,
      { variant: "success" }
    );
    router.push("/");
  };
  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h2" align="center">
        <AssignmentInd />
      </Typography>
      <Typography variant="h5" align="center">
        {group?.name}への参加
      </Typography>
      <TextField
        label="名前"
        required
        autoFocus
        fullWidth
        margin="normal"
        value={name}
        onChange={handleChange}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={!group}
      >
        join
      </Button>
    </form>
  );
};

const JoinGroupPage: NextPage = () => {
  const loadingUser = useRecoilValue(userLoadingState);
  const uid = useRecoilValue(uidState);
  useSubscribe();

  return (
    <main>
      <Container maxWidth="xs">
        {loadingUser ? (
          <Backdrop open style={{ zIndex: 9999 }}>
            <CircularProgress />
          </Backdrop>
        ) : uid ? (
          <JoinGroup />
        ) : (
          <Login
            uiConfig={{
              signInSuccessUrl: undefined,
              callbacks: { signInSuccessWithAuthResult: () => false },
            }}
          />
        )}
      </Container>
    </main>
  );
};

export default JoinGroupPage;
