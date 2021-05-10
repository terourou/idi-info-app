import { useEffect, useState } from 'react';
import { readRemoteFile } from 'react-papaparse';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'

import styled from 'styled-components';
import Info from './components/Info';
import Landing from './components/Landing';
import Variables from './components/Variables';
import About from './components/About';

// var protobuf = require("protobufjs")

function App() {

  // const [first, setFirst] = useState(true)
  const [data, setData] = useState([])

  useEffect(() => {

    readRemoteFile(
      "/data.csv",
      {
        header: true,
        complete: (results) => {

          setData(
            results.data
              .filter(row => row.variable_name)
              .map(row => ({
                ...row,
                // agency_collection: row.agency + " / " + row.collection,
                agency_table: row.agency + " / " + row.table_name,
              }))
          )
        }
      }
    )

    showInfo()
  }, [])

  const showInfo = () => {
    const el = document.getElementById("InstructionsContainer")
    if (el) el.classList.add("visible")
  }

  return (
    <Router>
      <Container>
        <LeftPanel>
          <Header>
            <p>Filter variables by searching below. Use commas for 'AND' matching.</p>
            <InfoOutlinedIcon
              onClick={() => showInfo()}
             />
          </Header>
          <Variables data={data} />
        </LeftPanel>

        <RightPanel>
          <Switch>
            <Route path="/:table/:variable">
              <Info data={data} />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/">
              <Landing />
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

  @media (max-width: 800px) {
    flex-direction: column-reverse;
  }
`

const LeftPanel = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  height: 100%;
  @media (max-width: 1200px) {
    width: 60%;
  }
  @media (max-width: 800px) {
    width: 100%;
  }
`

const Header = styled.div`
  padding: 10px;

  h1 {
    margin-bottom: 10px;
  }
  p {
    font-size: 0.9em;
  }
  .MuiSvgIcon-root {
    display: none
  }

  @media (max-width: 800px) {
    display: flex;
    align-items: center;

    p {
      flex: 1;
    }
    .MuiSvgIcon-root {
      display: inline;
      padding-left: 10px;
    }
  }
`

const RightPanel = styled.div`
  flex: 1;

  @media (max-width: 800px) {

  }
`
