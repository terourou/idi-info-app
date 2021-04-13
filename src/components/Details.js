import React from 'react'
import styled from 'styled-components'

function Details({info}) {
  // console.log(info)
  return (
    <Container>
      <h1>{info.variable_name}</h1>

      <p><strong>Agency:</strong> {info.agency}</p>
      <p><strong>Collection:</strong> {info.collection}</p>

      <p>{info?.description}</p>

      <h3>SQL Info</h3>

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
  h3 {
    margin-top: 2em;
    margin-bottom: 0.6em;
  }
  p {
    margin-bottom: 0.5em;
  }
`
