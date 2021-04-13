import PersonOutlineIcon from '@material-ui/icons/PersonOutline'
import React from 'react'
import styled from 'styled-components'

function Note({text, timestamp, author}) {
  return (
    <Container>
      <Meta>
        <Author>
          <PersonOutlineIcon />
          {author ? author : "Anonymous"}
        </Author>
        <Timestamp>{new Date(timestamp?.toDate()).toDateString()}</Timestamp>
      </Meta>

      <Content>{text}</Content>
    </Container>
  )
}

export default Note

const Container = styled.div`
  border-top: solid 1px lightgray;
  padding: 0.5em;

`

const Meta = styled.div`
  display: flex;
  font-size: 0.8em;
  margin-bottom: 0.5em;
`

const Author = styled.div`
  flex: 1;
  font-weight: bold;
  display: flex;
  align-items: center;

  .MuiSvgIcon-root {
    margin-right: 5px;
  }
`

const Timestamp = styled.div``

const Content = styled.div``
