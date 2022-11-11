//Code used to connect with mongoDB database
const mongoose = require('mongoose')
const mongoURI = 'mongodb://localhost:27017/eNoteBook'

const connectToMongo = () =>{
    mongoose.connect(mongoURI,() =>{
        console.log("Connected to Moongose Successfully")
    })
}

module.exports = connectToMongo