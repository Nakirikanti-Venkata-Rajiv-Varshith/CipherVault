import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import AiTile from "./AiTile";

function App() {

  const [notes, setNotes] = useState([]);

  // Load notes from database 
  useEffect(() => {
    fetch("/api/notes", {
      credentials: "include"  
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load notes");
        return res.json();
      })
      .then(data => setNotes(data))
      .catch(err => console.error(err));
  }, []);

  // Add note save to database
  function addNote(newNote) {

    fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",  
      body: JSON.stringify(newNote)
    })
      .then(res => {
        if (!res.ok) throw new Error("Create failed"); 
        return res.json();
      })
      .then(savedNote => {
        // append returned DB notes
        setNotes(prevNotes => [...prevNotes, savedNote]);
      })
      .catch(err => console.error(err));
  }



  // Delete note remove from database
  function deleteNote(id) {

    fetch(`/api/notes/${id}`, {
      method: "DELETE",
      credentials: "include"   
    })
    .then(res => {
      if (!res.ok) throw new Error("Delete failed");

      // update UI after server confirms delete
      setNotes(prevNotes => {
        return prevNotes.filter(noteItem => noteItem.id !== id);
      });
    })
    .catch(()=> alert("Delete failed"));
  }



  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />

      {notes.map((noteItem) => {
        return (
          <Note
            key={noteItem.id}
            id={noteItem.id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <AiTile />

      <Footer />
    </div>
  );
}

export default App;
