const { connection } = require('./database/connection')
require('dotenv').config()
const express = require('express')
const cors = require('cors')
console.log('Api running')
// Base data connection
connection()
//Create Server
const app = express()
const PORT = 3900
//Middleware Config
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//Load routes
const userRoutes = require('./routes/user')
const publicationRoutes = require('./routes/publication')
const followRoutes = require('./routes/follow')
//Use Routes
app.use('/api/user', userRoutes)
app.use('/api/publication', publicationRoutes)
app.use('/api/follow', followRoutes)
//Server listen
app.listen(PORT, () => console.log('Listen in Port 3900'))
