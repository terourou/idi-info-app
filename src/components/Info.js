import { ChevronLeft } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

function Info({data}) {

  const [info, setInfo] = useState({})

  let match = useRouteMatch("/:table/:variable")


  useEffect(() => {
    let table = match.params.table
    let variable = match.params.variable
    const d = data.filter(d => d.table_name === table && d.variable_name === variable)
    if (d.length) setInfo(d[0])
  }, [data, match])


  return (
    <Container>
      <Header>
        <h4><Link to="/"><ChevronLeft fontSize="small" /> Back</Link></h4>
      </Header>

      <ul>
        <li>Agency: {info?.agency}</li>
        <li>Collection: {info?.collection}</li>
        <li>Schema: {info?.schema}</li>
        <li>Table: {info?.table_name}</li>
        <li>Variable: {info?.variable_name}</li>
        <li>Vartype: {info?.variable_type}</li>
      </ul>
    </Container>
  )
}

export default Info

const Container = styled.div`
  @media(max-width: 800px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    box-shadow: 2px 2px 10px 2px rgba(0,0,0,0.2);
    z-index: 10;
    margin: 10px;
  }
`

const Header = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border-bottom: solid 1px lightgray;
  h4 > a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: black;
  }
  h4 > a:hover {
    opacity: 0.8;
  }
`
