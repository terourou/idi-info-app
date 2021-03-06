import React from 'react'
import styled from 'styled-components'

import ReactMarkdown from 'react-markdown'
import { CheckOutlined, ClearOutlined } from '@material-ui/icons';
import { Link } from 'react-router-dom';

function Details({ info, refreshes, matches }) {
  console.log(matches)
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
      { matches.tables.length > 0 &&
        <p class="poss-matches"><em>Possibly in other tables in other refreshes: </em>
        { matches.tables.map(
          v => (
            <Link to={"/" + v + "/" + info.variable_name}>{v}</Link>
          ))
        }
        </p>
      }
      <p><strong>Variable name:</strong> {info.variable_name}</p>
      { matches.variables.length > 0 &&
        <p class="poss-matches"><em>Possibly matching variables in other refreshes: </em>
        { matches.variables.map(
          v => (
            <Link to={"/" + info.table_name + "/" + v}>{v}</Link>
          ))
        }
        </p>
      }
      {info.variable_type && <p><strong>Variable type:</strong> {info.variable_type}</p>}

      <h4>Availability in IDI refreshes</h4>
      <RefreshInfo>
        {refreshes.map(
          r => (
            <Refresh key={r.key} available={info["IDI"+r.key] === "1"} >
              { info["IDI"+r.key] === "1" ? <CheckOutlined /> : <ClearOutlined /> }
              <span>{r.val}</span>
            </Refresh>
        ))}
      </RefreshInfo>

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

  .poss-matches {
    display: inline-block;
    border-left: solid 4px #ffbcbc;
    margin-left: 2px;
    padding: 5px 20px 5px 10px;
    background: #ffbcbc30;
  }
`

const Description = styled.div`
  p {
    font-size: 0.9em;
  }
`

const RefreshInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: 1.2em;
  font-size: 0.8em;
`

const Refresh = styled.div`
  height: 100%;
  border: solid 1px black;
  font-size: 1em;
  line-height: 1.5em;
  font-weight: bold;
  padding: 0.3em 0.5em;
  text-align: center;

  display: flex;
  align-items: center;

  background-color: ${props => props.available ? "#cafbca" : "#ffbcbc" };

  .MuiSvgIcon-root {
    height: 100%;
    color: white;
    margin-right: 0.1em;
    fill: ${props => props.available ? "green" : "darkred" };;
  }
`
