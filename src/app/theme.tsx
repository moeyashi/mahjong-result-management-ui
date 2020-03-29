import red from '@material-ui/core/colors/red';
import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      paper: '#fafafa',
      default: '#eeeeee',
    },
  },
  typography: {
    h1: {
      fontSize: '4rem',
      lineHeight: 1.5,
    },
  },
  props: {
    MuiButton: {
      color: 'primary',
      variant: 'contained',
    },
  },
});

export default theme;
