import { Grid } from '@material-ui/core';
import App from '../components/App';

export default () => (
  <App>
    <p>Index Page</p>
    <Grid container={true}>
      <Grid item={true} xs={12}>
        hoge
      </Grid>
    </Grid>
  </App>
);
