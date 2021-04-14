import React from 'react'
import styled from 'styled-components'

function Landing() {
  return (
    <Container>
      <Header>
        {/* <h1>Search the IDI variables</h1> */}
      </Header>

      <Main>
        <p>Use the search box to the left to search for variables in the IDI.</p>
        <p>Click on rows in the table to view additional information about each variable, including the schema and table names required for SQL queries.</p>
      </Main>

      <Footer>
        <p class="citation">
          Elliott, Milne, and Li (2021).{` `}
          <emph>What's in the IDI?</emph>{` `}
          A web app for searching IDI variable information.{` `}
          <a href="https://terourou.org/idisearch">https://terourou.org/idisearch</a>
        </p>
        <p class="collab">
          A collaboration by <a href="https://terourou.org">Te Rourou Tātaritanga</a>, <a href="https://www.auckland.ac.nz/en/arts/our-research/research-institutes-centres-groups/compass.html">COMPASS</a>, Victoria University of Wellington, and The University of Auckland.
        </p>
      </Footer>
    </Container>
  )
}

export default Landing

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.div``

const Main = styled.div`
  flex: 1;

  p {
    margin-bottom: 1em;
  }
`

const Footer = styled.div`
  border-top: solid 1px lightgray;
  padding-top: 1em;
  padding-bottom: 2em;
  .citation {
    padding-bottom: 5px;
  }
  emph {
    font-style: italic;
  }

  .collab {

  }
`
