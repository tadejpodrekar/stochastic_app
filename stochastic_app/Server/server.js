require('dotenv').config()
require('./models/user')
require('./models/test')
require('./config/database')
const fileUpload = require('express-fileupload');
const express = require('express')
const Cors = require('cors')
const app = express()

app.use(Cors())
app.use(express.json())
app.use(fileUpload())
app.use('/register', require('./routes/registration'))
app.use('/login', require('./routes/login'))
app.use(require('./routes/files'))
app.use(require('./routes/testing'))

app.listen(process.env.API_PORT,()=>{
    console.log("Server is running on port", process.env.API_PORT)
})