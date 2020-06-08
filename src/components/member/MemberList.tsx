import { FC, useState, useEffect } from "react";
import { useRecoilValueLoadable, useRecoilValue } from "recoil";
import { groupMembersAsyncState, groupState } from "hooks/states/groupState";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Button,
} from "@material-ui/core";
import { AccountCircle, PersonAdd, Done } from "@material-ui/icons";
import { GroupMember } from "models/GroupMember";
import { lightGreen } from "@material-ui/core/colors";

export const MemberList: FC = () => {
  const group = useRecoilValue(groupState);
  const { state, contents } = useRecoilValueLoadable(groupMembersAsyncState);
  const [inviteURL, setInviteURL] = useState("");

  useEffect(() => {
    if (!group) {
      return;
    }
    setInviteURL(group.inviteURL());
  }, [group]);

  if (state === "hasError") {
    console.error(contents);
  }

  if (!group || state === "loading") {
    return <>loading...</>;
  }

  const handleCreateInviteURL = async () => {
    const url = await group.createInviteURL(new Date(2030, 0, 1));
    if (!url) {
      alert("URLの発行に失敗しました。");
    }
    setInviteURL(url);
  };

  return (
    <List>
      {(contents as GroupMember[]).map((m, idx, array) => (
        <ListItem key={m.id} divider={array.length === idx + 1}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary={m.name} />
        </ListItem>
      ))}
      {!inviteURL && (
        <ListItem button onClick={handleCreateInviteURL}>
          <ListItemIcon>
            <PersonAdd />
          </ListItemIcon>
          <ListItemText primary="招待URLを発行" />
        </ListItem>
      )}
      {inviteURL && (
        <ListItem>
          <ListItemIcon style={{ color: lightGreen["700"] }}>
            <Done />
          </ListItemIcon>
          <ListItemText
            secondary={`有効期限：${group.inviteParamExpiration.toLocaleDateString()}`}
          >
            <TextField
              id="invite-url"
              label="招待URL"
              fullWidth
              type="url"
              value={inviteURL}
              variant="outlined"
              InputProps={{
                readOnly: true,
                // endAdornment: (
                //   <InputAdornment position="end">
                //     <IconButton
                //       aria-label="toggle password visibility"
                //       // onClick={handleClickShowPassword}
                //       edge="end"
                //     >
                //       <Assignment />
                //     </IconButton>
                //   </InputAdornment>
                // ),
              }}
            />
          </ListItemText>
          <Button
            variant="contained"
            style={{ marginLeft: 8 }}
            onClick={handleCreateInviteURL}
          >
            再発行
          </Button>
        </ListItem>
      )}
    </List>
  );
};
