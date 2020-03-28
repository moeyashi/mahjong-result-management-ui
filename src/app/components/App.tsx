import { Container, Toolbar } from '@material-ui/core';
import Header from './Header';

const App = ({ children }: { children?: any }) => (
  <main>
    <Header />
    <Toolbar />
    <Container>
      {children}
    </Container>
  </main>
);

export default App;
