const API_URL = "http://localhost:5000/notes";

// Load notes when page opens
document.addEventListener("DOMContentLoaded", loadNotes);


// GET — Fetch all notes
async function loadNotes() {
    try {
        const response = await fetch(API_URL);
        const notes = await response.json();

        displayNotes(notes);
    } catch (error) {
        console.error("Error loading notes:", error);
    }
}


// Display notes on frontend
function displayNotes(notes) {
    const container = document.getElementById("notesContainer");

    container.innerHTML = "";

    if (notes.length === 0) {
        container.innerHTML = "<p>No notes available. Add your first note!</p>";
        return;
    }

    notes.forEach(note => {
        const noteCard = document.createElement("div");

        noteCard.className = "note-card";

        noteCard.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>

            <button
                class="delete-btn"
                onclick="deleteNote(${note.id})">
                Delete
            </button>
        `;

        container.appendChild(noteCard);
    });
}


// POST — Add a new note
async function addNote() {

    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title || !content) {
        alert("Please enter both title and content.");
        return;
    }

    try {

        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: title,
                content: content
            })
        });

        if (!response.ok) {
            throw new Error("Failed to create note");
        }

        // Clear input fields
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";

        // Reload notes
        loadNotes();

    } catch (error) {
        console.error("Error adding note:", error);
    }
}


// DELETE — Delete a note
async function deleteNote(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete note");
        }

        // Reload notes
        loadNotes();

    } catch (error) {
        console.error("Error deleting note:", error);
    }
}
