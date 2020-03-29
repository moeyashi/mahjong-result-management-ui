import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { useUser } from '../lib/firebaseClient';

export default ({ }: { pathname?: any }) => {
  const { user } = useUser();

  return (
    <AppBar>
      <Toolbar>
        <Typography>Title</Typography>
        <Typography>{user?.displayName}</Typography>
      </Toolbar>
    </AppBar>
  );
};
