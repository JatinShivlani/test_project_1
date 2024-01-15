const express = require('express')
const router = express.Router();
const Notes = require('../models/Notes')
const fetchUser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// Roter : 1 ::::::::::::: Get all notes api/notes/allnotes

router.get('/allnotes', fetchUser,
    async (req, res) => {
        try {
            const userId = req.id
            await Notes.find({ user: userId }).then((value) => {
                res.json(value)
            })
        } catch (error) {
            return res.status(500).json({ Error: "Internal server error" })
        }
    })
// Roter : 2 ::::::::::::: create a new note api/notes/createnote
router.post('/createnote', fetchUser, [
    body("title", "Please enter a valid title ").isLength({ min: 3 }),
    body("description", "description :- min 5 characters required").isLength({ min: 5 })
], async (req, res) => {
    try {
        const result = validationResult(req);
        // checking if validation is false
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const userId = req.id
        const { title, description, tag } = req.body
        const note = new Notes({
            title: title,
            description: description,
            tag: tag,
            user: userId
        })
        await note.save().then((value) => {
            res.json(value)
        })
    } catch (error) {
        return res.status(500).json({ Error: "Internal server error" })
    }
})
// Roter : 3 ::::::::::::: Update api/notes/updatenote/:id
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body
        // create a new note obj for updation
        const newNote = {}
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }
        // find note and update it 
        const note = await Notes.findById(req.params.id)
        if (!note) {
            return res.status(401).json({ Error: "Not Found" })
        }
        if (note.user.toString() !== req.id) {
            return res.status(401).json({ Error: "Not Found" })
        }
        await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true }).then((value) => {
            return res.json(value)
        })
    } catch (error) {
        return res.status(500).json({ Error: "Internal server error" })
    }
})
// Roter : 4 ::::::::::::: delete a  note api/notes/deletenote/:id
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        // find note and delete it 
        const note = await Notes.findById(req.params.id)

        if (!note) {
            return res.status(401).json({ Error: "Not Found" })
        }
        if (note.user.toString() !== req.id) {
            return res.status(401).json({ Error: "Not Found" })
        }
        await Notes.findByIdAndDelete(req.params.id).then((value) => {
            return res.json({ value })
        })
    } catch (error) {
        return res.status(500).json({ Error: "Internal server error" })
    }
})
module.exports = router