import React from "react";
import "../styles/Note.css"; // Importing CSS for styling the Note component

// Note component that represents an individual note
// Takes `note` (data for the note) and `onDelete` (function to delete the note) as props
function Note({ note, onDelete }) {
    // Formatting the date from the note's `created_at` field
    // `toLocaleDateString` converts it to a human-readable date string
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");

    return (
        <div className="note-container"> {/* Wrapper for the note */}
            {/* Display the note's title */}
            <p className="note-title">{note.title}</p>
            
            {/* Display the note's content */}
            <p className="note-content">{note.content}</p>
            
            {/* Display the formatted date when the note was created */}
            <p className="note-date">{formattedDate}</p>
            
            {/* Delete button to remove the note */}
            {/* When clicked, calls the `onDelete` function with the note's ID */}
            <button className="delete-button" onClick={() => onDelete(note.id)}>
                Delete
            </button>
        </div>
    );
}

export default Note; // Exporting the Note component for use in other parts of the app
