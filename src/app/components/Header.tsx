import { AppBar, Toolbar, Typography } from '@material-ui/core';

export default ({ }: { pathname?: any }) => {

  return (
    <AppBar>
      <Toolbar>
        <Typography>成績管理</Typography>
      </Toolbar>
    </AppBar>
  );
};
