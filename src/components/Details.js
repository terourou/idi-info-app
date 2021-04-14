import React from 'react'
import styled from 'styled-components'

import ReactMarkdown from 'react-markdown'

function Details({info}) {
  return (
    <Container>
      <h1>{info.variable_name}</h1>

      <p><strong>Agency:</strong> {info.agency}</p>
      <p><strong>Collection:</strong> {info.collection}</p>

      { info.description !== "NA" &&
        <Description>
          <h4>Description:</h4>
          <ReactMarkdown>{info.description}</ReactMarkdown>
        </Description>
      }

      <h4>SQL Info</h4>

      <p><strong>Schema:</strong> {info.schema}</p>
      <p><strong>Table:</strong> {info.table_name}</p>
      <p><strong>Variable name:</strong> {info.variable_name}</p>
      <p><strong>Variable type:</strong> {info.variable_type}</p>

    </Container>
  )
}

export default Details

const Container = styled.div`
  padding: 1em;
  h1 {
    margin-bottom: 1em;
  }
  h4 {
    margin-top: 2em;
    margin-bottom: 0.6em;
  }
  p {
    margin-bottom: 0.5em;
  }
`

const Description = styled.div`
  p {
    font-size: 0.9em;
  }
`