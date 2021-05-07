import React, { useEffect, useState } from 'react'
import { readRemoteFile } from 'react-papaparse'
import styled from 'styled-components'

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
          <Head>Name</Head>
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


    </Container>
  )
}

export default About

const Container = styled.div`
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
