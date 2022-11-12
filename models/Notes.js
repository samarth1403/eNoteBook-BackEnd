const mongoose = require('mongoose');
const {Schema} = mongoose;

const notesSchema = new Schema({

   //user field is added so that notes added by one user shouldn't be visible to other
   //To save a note to the defined user and useful during fetching the notes
   user : {
      type : mongoose.Schema.Types.ObjectId, //Foreign key
      ref : 'user'
   },
   title : {
    type : String,
    required : true
   },
   description : {
    type : String,
    required : true
   },
   tag : {
    type : String,
    default : 'general'
   },
   date : {
    type : Date,
    default : Date.now
   }
   
  });

  module.exports = mongoose.model('notes',notesSchema)