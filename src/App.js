import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import './App.css'
import Info from './components/Info';
import Variables from './components/Variables';

function App() {
  return (
    <Router>
      <Container>
        <LeftPanel>
          <Variables />
        </LeftPanel>

        <RightPanel>
          <Switch>
            <Route path="/:table/:variable">
              <Info />
            </Route>
            <Route path="/">
              <h1>No variable selected</h1>
            </Route>
          </Switch>
        </RightPanel>
      </Container>
    </Router>
  )
}

export default App;

const Container = styled.div`
  display: flex;
  height: 100vh;
`

const LeftPanel = styled.div`
  width: 40%;
`

const RightPanel = styled.div`
  flex: 1;
  margin: 10px;
  /* background: blue; */
`
