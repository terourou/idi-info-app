import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import BackButton from './BackButton'
import { Button } from "@material-ui/core"


import db, { auth, google_provider } from "../firebase"
import Note from './Note'

import { actionTypes } from '../reducer'
import { useStateValue } from '../StateProvider'


function Admin() {

    const [reload, setReload] = useState(0)
    const [notes, setNotes] = useState([])
    const [{ user }, dispatch] = useStateValue()

    useEffect(() => {
        setReload(r => r + 1)
    }, [])

    useEffect(() => {
        if (user === null || !user.isAdmin) return
        if (reload === 0) return

        setNotes([]);
        db.collection('details')
            .get()
            .then(snapshot => {
                snapshot.docs.map(
                    doc => {
                        return db.collection('details')
                            .doc(doc.id)
                            .collection('notes')
                            .get()
                            .then(d => {
                                setNotes(n => [
                                    ...n,
                                    ...d.docs.map(
                                        note => ({
                                            id: note.id,
                                            key: doc.id,
                                            data: note.data(),
                                        })
                                    )
                                ])
                            })
                    }
                )
            })
    }, [reload, user])

    useEffect(() => {
        console.log(notes)
    }, [notes])

    const deleteNote = (key, noteId) => {
        console.log(key)
        console.log(noteId)
        db.collection('details')
            .doc(key)
            .collection('notes')
            .doc(noteId)
            .delete()
            .then(() => {

            }).catch((error) => {
                console.log("Could not delete.")
            })
        setReload(r => r + 1)
    }

    const signInGoogle = () => {
        auth.signInWithPopup(google_provider)
            .then(result => {
                // find out if user is admin
                db.collection("users")
                .doc(result.user.uid)
                .get()
                .then((doc) => {
                    const admin = doc.exists ? doc.data().admin : false;
                    dispatch({
                        type: actionTypes.SET_USER,
                        user: {
                            ...result.user,
                            isAdmin: admin,
                            }
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
            })
        .catch(error => alert(error.message))
    }

    return (
        <Container>
            <BackButton />
            
            <Main>
                <h1>Admin Page</h1>
                
                { user === null || !user.isAdmin ? (
                    <>
                        <p>Access denied</p>
                        { !user  && (
                            <SignIn>
                                <Button type="submit" onClick={signInGoogle} size="small">
                                    Sign In with Google
                                </Button>
                            </SignIn>
                        )}
                    </>
                ) : (
                    <>
                        <p>Below are all notes in reverse order ...</p>
                        <Notes>
                        {notes.sort((a, b) => a.data.timestamp < b.data.timestamp).map(note => (
                            <Note key={note.id}
                                text={note.data.value}
                                timestamp={note.data.timestamp}
                                author={note.data.author + (user && note.data.userId === user.uid ? ' (you)' : '') }
                                image={note.data.photo}
                                canDelete={user ? user.isAdmin : false}
                                deleteNote={deleteNote}
                                noteId={note.id}
                                ckey={note.key}
                                />
                        ))}
                        </Notes>
                    </>
                ) }
            </Main>
        </Container>
    )
}

export default Admin

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

const Main = styled.div`
    padding: 1em;
`

const Notes = styled.div`
    margin-top: 2em;
`


const SignIn = styled.div`
  margin-top: 1em;
  padding: 1em;
  display: flex;
  align-items: center;

  button {
    /* margin-top: 50px; */
    text-transform: inherit !important;
    background-color: #4285F4 !important;
    color: white;
    margin-left: 10px;
    padding-left: 10px;
    padding-right: 10px;
  }
`
