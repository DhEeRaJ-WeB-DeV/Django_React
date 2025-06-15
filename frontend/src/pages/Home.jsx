import { useState, useEffect } from "react";
import api from "../api"; // Importing the pre-configured Axios instance
import Note from "../components/Note"; // A component to render individual notes
import "../styles/Home.css"; // Importing styles for the Home component

function Home() {
    // State to store the list of notes fetched from the API
    const [notes, setNotes] = useState([]);

    // State to store the content of the new note being created
    const [content, setContent] = useState("");

    // State to store the title of the new note being created
    const [title, setTitle] = useState("");

    // useEffect runs when the component mounts
    // It fetches the existing notes from the API when the page loads
    useEffect(() => {
        getNotes();
    }, []);

    // Function to fetch all notes from the API
    const getNotes = () => {
        api
            .get("/api/notes/") // GET request to fetch all notes
            .then((res) => res.data) // Extract data from the response
            .then((data) => {
                setNotes(data); // Update the state with the fetched notes
                console.log(data); // Log the data for debugging
            })
            .catch((err) => alert(err)); // Handle errors
    };

    // Function to delete a note
    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`) // DELETE request to remove a specific note
            .then((res) => {
                // Check if the request was successful
                if (res.status === 204) alert("Note deleted!"); // 204 means no content, delete successful
                else alert("Failed to delete note.");
                getNotes(); // Refresh the list of notes after deletion
            })
            .catch((error) => alert(error)); // Handle errors
    };

    // Function to create a new note
    const createNote = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        api
            .post("/api/notes/", { content, title }) // POST request with the note data
            .then((res) => {
                // Check if the request was successful
                if (res.status === 201) alert("Note created!"); // 201 means resource created
                else alert("Failed to make note.");
                getNotes(); // Refresh the list of notes after creation
            })
            .catch((err) => alert(err)); // Handle errors
    };

    // The JSX returned by this component
    return (
        <div>
            {/* Section to display existing notes */}
            <div>
                <h2>Notes</h2>
                {/* Loop through the notes array and render each note using the Note component */}
                {notes.map((note) => (
                    <Note note={note} onDelete={deleteNote} key={note.id} />
                    /*React will assign key values like 0, 1, 2 (array indices). 
                      If the array changes (e.g., [2, 3, 4]), React might incorrectly match the old 1 to the new 2 because the indices have shifted. 
                      This can cause visual glitches.*/
                ))}
            </div>

            {/* Section to create a new note */}
            <h2>Create a Note</h2>
            <form onSubmit={createNote}>
                {/* Input for the note title */}
                <label htmlFor="title">Title:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)} // Update the title state
                    value={title} // Bind the input to the title state
                />
                {/* Input for the note content */}
                <label htmlFor="content">Content:</label>
                <br />
                <textarea
                    id="content"
                    name="content"
                    required
                    value={content} // Bind the textarea to the content state
                    onChange={(e) => setContent(e.target.value)} // Update the content state
                ></textarea>
                <br />
                {/* Submit button */}
                <input type="submit" value="Submit"></input>
            </form>
        </div>
    );
}

export default Home;
