import { useEffect, useState } from 'react';
import { readRemoteFile } from 'react-papaparse';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'

import styled from 'styled-components';
import Info from './components/Info';
import Landing from './components/Landing';
import Variables from './components/Variables';
import About from './components/About';

// import { actionTypes } from './reducer'
import { useStateValue } from './StateProvider'
import Admin from './components/Admin';

// var protobuf = require("protobufjs")

function App() {
  
  return (
    <div>
      The IDI Search App has moved: <a href="https://idisearch.terourou.org">idisearch.terourou.org</a>.
    </div>
   )

  // const [first, setFirst] = useState(true)
  const [data, setData] = useState([])
  const [{ user, dbname }] = useStateValue()
  const [possMatch, setPossMatch] = useState([])

  useEffect(() => {
    readRemoteFile(
      `/possible_matches.csv`,
      {
        header: true,
        complete: (results) => {
          setPossMatch(
            results.data
          )
        }
      }
    )
  }, [])

  useEffect(() => {
    setData([])
    readRemoteFile(
      `/${dbname}.csv`,
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
  }, [dbname])

  const showInfo = () => {
    const el = document.getElementById("InstructionsContainer")
    if (el) el.classList.add("visible")
  }

  return (
    <Router>
      <Container>
        <LeftPanel>
          <Navbar>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/about">About the IDI</Link>
              { user && user.isAdmin && <Link to="/admin">Admin</Link> }
            </nav>
          </Navbar>
          <Header>
            <InfoOutlinedIcon
              onClick={() => showInfo()}
             />
          </Header>
          <Variables data={data} />
        </LeftPanel>

        <RightPanel>
          <Switch>
            <Route path="/:table/:variable">
              <Info data={data} matches={possMatch} />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/admin">
              <Admin />
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

const Navbar = styled.div`

  nav {
    display: flex;
    align-items: center;
    margin: 0 1em;

    > a {
      display: inline-block;
      padding: 10px 20px;
      text-decoration: none;
      font-size: 0.8em;
      text-transform: uppercase;
      color: darkblue;
      border-bottom: solid 1px darkblue;

      &:hover {
        opacity: 0.8;
        background: rgba(0,0,0,0.05);
      }
    }
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
