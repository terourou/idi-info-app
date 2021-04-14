import { useEffect, useState } from 'react';
import { readRemoteFile } from 'react-papaparse';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import styled from 'styled-components';
import Info from './components/Info';
import Variables from './components/Variables';

// var protobuf = require("protobufjs")

function App() {

  const [data, setData] = useState([])

  useEffect(() => {
    // protobuf.load("/idi.proto", function(err, root) {
    //   if (err)
    //     throw err

    //   const VariableList = root.lookupType("IDI.VariableList")
    //   const Variable = root.lookupType("IDI.Variable")

    //   // console.log(VariableList)
    //   // const variables = VariableList.decode()
    //   readFile("/data.pb", (err, data) => {
    //     if (err) throw err
    //     var reader = protobuf.Reader.create(data)
    //     console.log(reader)
    //   })

    // })

    // setData([])

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
          <Header>
            <h1>What's in the IDI?</h1>
            <p>Filter variables by searching below. Use commas for 'AND' matching.</p>
          </Header>
          <Variables data={data} />
        </LeftPanel>

        <RightPanel>
          <Switch>
            <Route path="/:table/:variable">
              <Info data={data} />
            </Route>
            <Route path="/">
              <p>Search for terms using the search box. Click the arrow to show details here.</p>
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
    flex-direction: column;
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
`

const RightPanel = styled.div`
  flex: 1;
  margin: 10px;
  @media (max-width: 800px) {
    width: 100%;
  }
`
