const { connection } = require('./database/connection')
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

console.log('Api running')

// Base data connection
connection()

//Create Server
const app = express()
const PORT = process.env.PORT || 3900

//Middleware Config
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))

//Load routes
const userRoutes = require('./routes/user')
const publicationRoutes = require('./routes/publication')
const followRoutes = require('./routes/follow')

//Use Routes
app.use('/api/user', userRoutes)
app.use('/api/publication', publicationRoutes)
app.use('/api/follow', followRoutes)

// Handle all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'))
})

//Server listen
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
