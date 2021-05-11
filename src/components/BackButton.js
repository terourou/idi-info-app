import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from '@material-ui/icons'
import styled from 'styled-components'

function BackButton() {
    return (
        <Header>
            <h4><Link to="/"><ChevronLeft fontSize="small" /> Back</Link></h4>
        </Header>
    )
}

export default BackButton

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
