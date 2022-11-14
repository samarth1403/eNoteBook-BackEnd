const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')


connectToMongo();

const app = express();
const port = 5000;
app.use(cors()) //To avoid CORS Error means we can't call api directly from browser
                //Must be written after defining port
//Middleware used to use req.body
app.use(express.json())

//Available Routes
app.use('/api/auth' , require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))



app.get('/', (req, res) => {
  res.send('Hello Everyone!')
})


app.listen(port, () => {
  console.log(`eNoteBook app is listening on port http://localhost:${port}`)
})