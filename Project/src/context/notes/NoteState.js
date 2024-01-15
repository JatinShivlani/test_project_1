import { useState } from "react";
import NotesContext from "./NoteContext";
const NoteState = (props) => {
  const host = "http://localhost:5000";
  const [state, setState] = useState([]);
  // get all notes
  const getNotes = async () => {
    await fetch(`${host}/api/notes/allnotes`, {
      method: "GET",
      headers: {
        "auth-token":localStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((response) => setState(response))
      .catch((err) => console.error(err));
  };
  // Add note
  const addNotes = async (title, description, tag) => {
    const data = {
      title: title,
      description: description,
      tag: tag,
    };
    await fetch(`${host}/api/notes/createnote`, {
      method: "POST",
      headers: {
        "auth-token":localStorage.getItem('token'),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        getNotes();
      })
      .catch((err) => console.error(err));
  };
  // Edit note
const editNotes=async (id,title,description,tag)=>{
  const data = {
    title: title,
    description: description,
    tag: tag,
  };
  await fetch(`${host}/api/notes/updatenote/${id}`, {
    method: "PUT",
    headers: {
      "auth-token":localStorage.getItem('token'),
      "Content-Type": "application/json",
    },
    body:JSON.stringify(data)
  })
    .then(() => {
      getNotes();
    })
    .catch((err) => console.error(err));
}
  // Delete note

  const deleteNotes = async (id) => {
    // eslint-disable-next-line
    await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "auth-token":localStorage.getItem('token'),
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        getNotes();
      })
      .catch((err) => console.error(err));
  };
  return (
    <NotesContext.Provider value={{ state, addNotes, deleteNotes, getNotes,editNotes }}>
      {props.children}
    </NotesContext.Provider>
  );
};
export default NoteState;
