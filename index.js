const connectToMongo = require('./db')
const express = require('express')

connectToMongo();

const app = express()
const port = 3000

//Middleware used to use req.body
app.use(express.json())

//Available Routes
app.use('/api/auth' , require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))



app.get('/', (req, res) => {
  res.send('Hello Everyone!')
})


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})