const { Schema, model } = require('mongoose')
const mongoosePagination = require('mongoose-paginate-v2')

const userSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
    },
    nickname: {
        type: String,
        required: true,
    },
    bio: { type: String },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'role_user',
    },
    image: {
        type: String,
        default: 'default_png',
    },
    date: {
        type: Date,
        default: Date.now,
    },
})
userSchema.plugin(mongoosePagination)
module.exports = model('User', userSchema, 'users')
