import { Container, Dialog, LinearProgress, Toolbar } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useUser } from '../lib/firebaseClient';
import Header from './Header';

const App = ({ children }: { children?: any }) => {
  const router = useRouter();
  const { user, loadingUser } = useUser();

  if (loadingUser) {
    return (
      <Dialog open={true} fullScreen={true}>
        <LinearProgress />
      </Dialog>
    );
  }

  if (!user) {
    router.push('/login');
    return (
      <Dialog open={true} fullScreen={true}>
        <LinearProgress />
      </Dialog>
    );
  }

  return (
    <main>
      <Header />
      <Toolbar />
      <Container>
        {children}
      </Container>
    </main>
  );
};

export default App;
