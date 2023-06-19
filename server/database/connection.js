const mongoose = require('mongoose')
require('dotenv').config()

//const urlLocal = 'mongodb://127.0.0.1:27017/Red_Social'
// eslint-disable-next-line no-undef
const urlCloud = process.env.MONGODB_URI

const connection = async () => {
  try {
    await mongoose.connect(urlCloud)
    console.log('Connected to database')
  } catch (error) {
    console.log(error)
    throw new Error('No connection to database')
  }
}

module.exports = { connection }
