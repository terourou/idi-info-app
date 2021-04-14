import { ChevronLeft } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import firebase from "firebase"

import db from "../firebase"
import Details from './Details'
import Note from './Note'

function Info({data}) {

  const [notes, setNotes] = useState([])
  const [info, setInfo] = useState({})
  const [newnote, setNewNote] = useState("")

  let url_params = useParams()

  useEffect(() => {
    if (data.length === 0) return

    const d = data
      .filter(
        d => d.table_name === url_params.table &&
        d.variable_name === url_params.variable
      )

    setInfo({})
    setNotes([])

    let key = url_params.table + "_" + url_params.variable
    const unsubscribe = db.collection('details')
      .doc(key)
      .collection('notes')
      .orderBy("timestamp", "desc")
      .onSnapshot(
        snapshot => {
          setInfo({
            ...d[0],
            key: key
          })
          setNotes(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        }
      )

    return () => {
      unsubscribe()
    }
  }, [url_params, data])

  const addNewNote = (e) => {
    e.preventDefault()
    if (newnote === "") return

    let key = url_params.table + "_" + url_params.variable
    db.collection('details')
      .doc(key)
      .collection('notes')
      .add({
        value: newnote,
        author: "Anonymous",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })

    setNewNote("")
  }

  return (
    <Container>
      <Header>
        <h4><Link to="/"><ChevronLeft fontSize="small" /> Back</Link></h4>
      </Header>

      <Main>
        { info.key && <Details key={info.key} info={info} /> }
      </Main>

      <NotesContainer>
        {notes.map(note => (
          <Note key={note.id}
            text={note.data.value}
            timestamp={note.data.timestamp}
            author={note.data.author}
            />
        ))}

        { info.key &&
          <NewNote>
            <InputContainer>
              <textarea type="text" placeholder="Add note (Markdown formatting supported) ..." value={newnote}
                onChange={e => setNewNote(e.target.value)} />
              <button type="submit" onClick={addNewNote}>Add note</button>
            </InputContainer>
          </NewNote>
        }
      </NotesContainer>


    </Container>
  )
}

export default Info

const Container = styled.div`
  overflow-y: scroll;
  height: 100%;
  @media(max-width: 800px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    /* box-shadow: 2px 2px 10px 2px rgba(0,0,0,0.2); */
    z-index: 10;
    /* margin: 10px; */
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

const Main = styled.div``

const NotesContainer = styled.div`
  /* border-top: solid 1px lightgray; */
  /* width: 100%; */
  padding: 1em;
`

const NewNote = styled.div`
  border-top: solid 1px lightgray;
  padding: 0.5em;
`

const InputContainer = styled.div`
  display: flex;
  /* align-items: center; */
  border: solid 1px lightgray;
  border-radius: 10px;
  padding: 1em;

  textarea {
    flex: 1;
    border: none;
    resize: none;
    height: 5em;
    outline: none;
  }

  button {
    background: none;
    border: solid 1px lightgray;
    outline: none;
    cursor: pointer;
    border-radius: 8px;
    background: #f3f3f3;
    padding: 1em;
  }
  button:hover {
    background: #e9e9e9;
  }
`
