import React, { useEffect, useState } from 'react'
import { readRemoteFile } from 'react-papaparse'
import styled from 'styled-components'
import BackButton from './BackButton'

function About() {

  const [stats, setStats] = useState([])

  useEffect(() => {
    // setStats(
    //   [
    //     {
    //       "key": "IDI20210104",
    //       "refresh": "2021-01-04",
    //       "tables": 103,
    //       "variables": "15034",
    //     },
    //     {
    //       "key": "IDI20201004",
    //       "refresh": "2020-10-04",
    //       "tables": 102,
    //       "variables": "14343",
    //     },
    //   ]
    // )
    readRemoteFile(
      "/idistats.csv",
      {
        header: true,
        complete: (results) => {
          setStats(results.data)
        }
      }
    )
  }, [])

  return (
    <Container>
      <BackButton />

      <Content>
        <h1>About the IDI</h1>

        <p>
            The IDI is New Zealand's Integrated Data Infrastructure, provided by Statistics NZ.
            It houses data from government and non-government sources.
            More information can be obtained from <a href="https://www.stats.govt.nz/integrated-data/integrated-data-infrastructure/">https://www.stats.govt.nz/integrated-data/integrated-data-infrastructure/</a>.
        </p>

        <h2>IDI Statistics</h2>

        <p>Here are some basic statistics about the information in the IDI.</p>

        <Table>
          <Row>
            <Head>Collection</Head>
            <Head>Number of Tables</Head>
            <Head>Number of Variables</Head>
          </Row>
          {stats.map(tab => (
            <Row key={tab.table}>
              <Cell>{tab.table}</Cell>
              <Cell>{tab.tables}</Cell>
              <Cell>{tab.variables}</Cell>
            </Row>
          ))}
        </Table>
      </Content>
    </Container>
  )
}

export default About

const Container = styled.div`
  overflow-y: scroll;
  height: 100%;

  @media(max-width: 800px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    /* box-shadow: 2px 2px 10px 2px rgba(0,0,0,0.2); */
    z-index: 10;
    /* margin: 10px; */
  }
`

const Content = styled.div`
  padding: 1em;

  h2 {
    margin-top: 2em;
  }

`

const Table = styled.div`
  display: table;
  margin: 1em 1em 2em;
`
const Row = styled.div`
  display: table-row;
`
const Cell = styled.div`
  display: table-cell;
  padding: 0.2em 1em;
`
const Head = styled(Cell)`
  font-weight: bold;
  border-bottom: solid 1px black;
`
