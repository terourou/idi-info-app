import React, { useEffect, useState } from 'react'
import { readRemoteFile } from 'react-papaparse'
import styled from 'styled-components'

function About() {

  const [stats, setStats] = useState([])

  useEffect(() => {
    setStats(
      [
        {
          "table": "IDI20210104",
          "tables": 103,
          "variables": "15034",
        },
        {
          "table": "IDI20201004",
          "tables": 102,
          "variables": "14343",
        },
      ]
    )
    // readRemoteFile(
    //   "/idistats.csv",
    //   {
    //     header: true,
    //     complete: (results) => {
    //       setStats(results.data)
    //     }
    //   }
    // )
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

      <table>
        <tr>
          <th>Name</th>
          <th>Number of Tables</th>
          <th>Number of Variables</th>
        </tr>
      </table>


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
