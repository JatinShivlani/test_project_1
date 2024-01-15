const express = require('express')
const connect = require('./db')
const app = express();
var cors = require('cors')
require('dotenv').config()
const username=process.env.USERNAME_MONGO
const password=process.env.PASSWORD_MONGO
app.use(cors())
const bodyParser = require('body-parser')
connect(username,password);

// parse application/json
app.use(bodyParser.json())


app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (req, res) => {
    res.send('Hey everyone!')
})
app.listen(5000, () => {
    console.log('Listening on port 5000')
})