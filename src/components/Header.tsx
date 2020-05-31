import { FC } from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import { useRecoilValue } from "recoil";
import { uidState } from "hooks/states/userState";
import { GroupSelectMenu } from "./group/GroupSelectMenu";

const Header: FC = () => {
  const uid = useRecoilValue(uidState);

  return (
    <AppBar position="sticky">
      <Toolbar variant="dense">{uid && <GroupSelectMenu />}</Toolbar>
    </AppBar>
  );
};

export default Header;
