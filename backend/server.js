const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const notesFile = path.join(__dirname, "notes.json");

// Get all notes
app.get("/notes", (req, res) => {
    fs.readFile(notesFile, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                error: "Unable to read notes"
            });
        }

        const notes = JSON.parse(data || "[]");
        res.json(notes);
    });
});

// Create a new note
app.post("/notes", (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            error: "Title and content are required"
        });
    }

    fs.readFile(notesFile, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                error: "Unable to read notes"
            });
        }

        const notes = JSON.parse(data || "[]");

        const newNote = {
            id: Date.now(),
            title,
            content
        };

        notes.push(newNote);

        fs.writeFile(
            notesFile,
            JSON.stringify(notes, null, 2),
            (err) => {
                if (err) {
                    return res.status(500).json({
                        error: "Unable to save note"
                    });
                }

                res.status(201).json(newNote);
            }
        );
    });
});

// Delete a note
app.delete("/notes/:id", (req, res) => {
    const id = Number(req.params.id);

    fs.readFile(notesFile, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                error: "Unable to read notes"
            });
        }

        let notes = JSON.parse(data || "[]");

        const noteExists = notes.some(note => note.id === id);

        if (!noteExists) {
            return res.status(404).json({
                error: "Note not found"
            });
        }

        notes = notes.filter(note => note.id !== id);

        fs.writeFile(
            notesFile,
            JSON.stringify(notes, null, 2),
            (err) => {
                if (err) {
                    return res.status(500).json({
                        error: "Unable to delete note"
                    });
                }

                res.json({
                    message: "Note deleted successfully"
                });
            }
        );
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});