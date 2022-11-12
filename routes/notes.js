const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const Router = express.Router();
const { body, validationResult } = require("express-validator");

//ROUTE 1 : Fetch All Notes of User using GET : 'api/notes/fetchallnotes
Router.get( "/fetchallnotes", fetchuser , async (req, res) => {
    try {
     
      const notes = await Notes.find({ user: req.user.id });
      res.json(notes);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// // ROUTE 2 : Add a note to User using POST : 'api/notes/addanote
Router.post("/addnote",  [
    body("title", "Enter a title").isLength({ min: 3 }),
    body("description","description must be of at least 5 characters").isLength({ min: 5 }),
  ], fetchuser, async (req, res) => {
  try {

     //If there are errors return bad request and error message
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
     
     const {title , description , tag} = req.body //Destructuring
     const note = new Notes({
        title , description , tag , user : req.user.id
     })
    // const notes = new Notes({
    //   user: req.body.user,
    //   title: req.body.title,
    //   description: req.body.description,
    //   tag: req.body.tag,
    // });
    const savedNote = await note.save();
    res.json(savedNote);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTER 3 : Updating the Existing note using PUT : '/api/notes/updatenote' Login Required
Router.put('/updatenote/:id', fetchuser ,async (req , res) =>{
    try {
        const {title , description , tag} = req.body;

        //Creating a new Note
        const newnote = {}
        if(title){newnote.title = title}
        if(description){newnote.description = description}
        if(tag){newnote.tag = tag}
        
        //Finding a note to be upadated
        let note = await Notes.findById(req.params.id) //req.params.id = ID of note which is to be updated and also written in api
        if(!note){return res.status(404).send('Not found')}

        //Checking whether user is updating his notes or not
        if(note.user.toString() !== req.user.id){
            return res.status(401).send('Not Allowed')
        }

        //Updating the note
        note = await Notes.findByIdAndUpdate(req.params.id,{$set : newnote},{new:true})
        res.json({note})
    }  catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
      }
})


//ROUTE 4 : Delete a node using DELETE : 'api/notes/deletenote' Login Required
Router.delete('/deletenote/:id', fetchuser ,async (req , res) =>{
    try {
        const {title , description , tag} = req.body;
        
        //Finding a note to be deleted
        let note = await Notes.findById(req.params.id) //req.params.id = ID of note which is to be updated and also written in api
        if(!note){return res.status(404).send('Not found')}

        //Checking whether user is deleting his notes or not
        if(note.user.toString() !== req.user.id){
            return res.status(401).send('Not Allowed')
        }

        //Deleting the note
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({"Success":"Note has been deleted",note:note})
    }  catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
      }
})

module.exports = Router