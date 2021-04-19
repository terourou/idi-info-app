import { Button } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

function Landing() {
  const hideDetails = (e) => {
    e.preventDefault()
    const el = document.getElementById("InstructionsContainer")
    el.classList.remove("visible")
  }

  return (
    <Container id="InstructionsContainer" className="">
      <Header>
        <h1>What's in the IDI?</h1>
      </Header>

      <Main>
        <p>Use the search box to look for variables in the IDI.</p>
        <p>Click on rows in the table to view additional information about each variable, including the schema and table names required for SQL queries.</p>

        <ButtonContainer>
          <Button variant="contained" color="primary"
            onClick={hideDetails}
          >
            Get Started
          </Button>
        </ButtonContainer>
      </Main>

      <Footer>
        <p className="citation">
          Elliott, Milne, and Li (2021).{` `}
          <em>What's in the IDI?</em>{` `}
          A web app for searching IDI variable information.{` `}
          <a href="https://terourou.org/idisearch">https://terourou.org/idisearch</a>
        </p>
        <p className="collab">
          A collaboration by <a href="https://terourou.org">Te Rourou Tātaritanga</a>, <a href="https://www.auckland.ac.nz/en/arts/our-research/research-institutes-centres-groups/compass.html">COMPASS</a>, Victoria University of Wellington, and The University of Auckland.
        </p>
      </Footer>
    </Container>
  )
}

export default Landing

const Container = styled.div`
  height: 100%;
  /* margin: 10px; */
  display: flex;
  flex-direction: column;

  &.visible {
    @media (max-width: 800px) {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: white;
      padding: 10px;
      z-index: 10;
      box-shadow: 2px 2px 5px 3px rgba(0,0,0,0.1);
    }
  }
`

const Header = styled.div`
  padding: 10px;
  margin-bottom: 1em;
`

const Main = styled.div`
  padding: 0 10px;
  flex: 1;

  p {
    margin-bottom: 1em;
  }
`

const ButtonContainer = styled.div`
  margin-top: 2em;
  @media (min-width: 801px) {
    display: none;
  }
`

const Footer = styled.div`
  border-top: solid 1px lightgray;
  padding: 1em 10px 2em 10px;
  .citation {
    padding-bottom: 5px;
  }
  emph {
    font-style: italic;
  }

  .collab {

  }
`
