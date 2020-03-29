import { Container, Toolbar } from '@material-ui/core';
import { SignInScreen, useUser } from '../lib/firebaseClient';
import Header from './Header';

const App = ({ children }: { children?: any }) => {
  const { user, loadingUser } = useUser();

  if (loadingUser) {
    return <p>loading</p>;
  }

  if (!user) {
    return (
      <main>
        <Header />
        <Toolbar />
        <SignInScreen />
      </main>
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
