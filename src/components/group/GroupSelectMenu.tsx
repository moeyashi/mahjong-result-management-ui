import { FC, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { groupState } from "hooks/states/groupState";
import { ownerGroupsState, guestGroupsState } from "hooks/states/userState";
import {
  ButtonProps,
  Button,
  Menu,
  ListSubheader,
  MenuItem,
  Divider,
} from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import Group from "models/Group";

export const GroupSelectMenu: FC = () => {
  const [selectedGroup, setSelectedGroup] = useRecoilState(groupState);
  const ownerGroups = useRecoilValue(ownerGroupsState);
  const guestGroups = useRecoilValue(guestGroupsState);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick: ButtonProps["onClick"] = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeGroup = (group: Group) => () => {
    setSelectedGroup(group);
    setAnchorEl(null);
  };

  return (
    <>
      <Button color="inherit" onClick={handleClick}>
        {selectedGroup?.name || "グループを選択"}
        <ArrowDropDown />
      </Button>
      <Menu
        id="groups-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <ListSubheader>所有グループ</ListSubheader>
        {ownerGroups.map((g) => (
          <MenuItem key={g.id} onClick={handleChangeGroup(g)}>
            {g.name}
          </MenuItem>
        ))}
        <Divider style={{ marginTop: 8 }} />
        <ListSubheader>ゲスト参加グループ</ListSubheader>
        {guestGroups.map((g) => (
          <MenuItem key={g.id} onClick={handleChangeGroup(g)}>
            {g.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
