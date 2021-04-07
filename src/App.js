import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { readRemoteFile } from 'react-papaparse'

import styled from 'styled-components';
import './App.css'
import Info from './components/Info';
import Variables from './components/Variables';

function App() {

  const [data, setData] = useState([])

  useEffect(() => {
    readRemoteFile(
      "/data.csv",
      {
        header: true,
        complete: (results) => {
          console.log("DATA LOADED")
          setData(results.data.filter(row => row.variable_name))
        }
      }
    )
  }, [])

  return (
    <Router>
      <Container>
        <LeftPanel>
          <h1>What's in the IDI?</h1>
          <Variables data={data} />
        </LeftPanel>

        <RightPanel>
          <Switch>
            <Route path="/:table/:variable">
              <Info data={data} />
            </Route>
            <Route path="/">
              <p>Search for terms on the left. Click the arrow to show details here.</p>
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

  h1 {
    margin: 10px;
  }
`

const RightPanel = styled.div`
  flex: 1;
  margin: 10px;
  /* background: blue; */
`
