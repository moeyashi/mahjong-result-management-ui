import { FC, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  IconButtonProps,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { useRecoilValue } from "recoil";
import { uidState } from "hooks/states/userState";
import { GroupSelectMenu } from "./group/GroupSelectMenu";
import { MoreVert, Group } from "@material-ui/icons";
import { MenuItemLink } from "./nextlink/MenuItemLink";
import { ButtonLink } from "./nextlink/ButtonLink";

const HeaderMenu: FC = () => {
  const uid = useRecoilValue(uidState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  if (!uid) {
    return null;
  }
  const isMenuOpen = Boolean(anchorEl);
  const handleMenuOpen: IconButtonProps["onClick"] = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton color="inherit" edge="end" onClick={handleMenuOpen}>
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id="header-menu"
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItemLink href="/members">
          <ListItemIcon>
            <Group />
          </ListItemIcon>
          <ListItemText>メンバー管理</ListItemText>
        </MenuItemLink>
      </Menu>
    </>
  );
};

const Header: FC = () => {
  const uid = useRecoilValue(uidState);

  return (
    <AppBar position="sticky">
      <Toolbar variant="dense">
        <ButtonLink href="/" color="inherit">
          home
        </ButtonLink>
        <div style={{ flexGrow: 1 }}>{uid && <GroupSelectMenu />}</div>
        {uid && <HeaderMenu />}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
