const mongoose = require('mongoose')

const connection = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Red_Social')
        console.log('Connected to database')
    } catch (error) {
        console.log(error)
        throw new Error('No connection to database')
    }
}

module.exports = { connection }
