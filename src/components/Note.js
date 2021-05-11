// import PersonOutlineIcon from '@material-ui/icons/PersonOutline'
import React from 'react'
import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'
import { Avatar } from '@material-ui/core'
import { DeleteOutlined } from '@material-ui/icons'

// import db, { auth, google_provider } from "../firebase"


function Note({text, timestamp, author, image, canDelete, deleteNote, noteId}) {

  const deleteThisNote = (e) => {
    e.preventDefault()
    deleteNote(noteId)
  }

  return (
    <Container>
      <Meta>
        <Author>
          <Avatar variant="square" src={ image } />
          { author }
        </Author>
        <Timestamp>{new Date(timestamp?.toDate()).toDateString()}</Timestamp>
        { canDelete && <a href="." onClick={deleteThisNote}><DeleteOutlined /></a> }
      </Meta>

      <Content><ReactMarkdown>{text}</ReactMarkdown></Content>
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
  align-items: flex-start;

  .MuiAvatar-root {
    margin-right: 5px;
    height: 1.5em;
    width: 1.5em;
  }
`

const Timestamp = styled.div``

const Content = styled.div``
