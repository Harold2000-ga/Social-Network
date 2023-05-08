const {Schema ,model} = require('mongoose')
const mongoosePagination = require('mongoose-paginate-v2')


const followSchema =Schema ({

    user:{
        type:Schema.ObjectId,
        ref:'User'
    },
    followed:{
        type:Schema.ObjectId,
        ref:'User'},

    created_at:{
        type:Date,
        default:Date.now
    }
})

followSchema.plugin(mongoosePagination)
module.exports = model('Follow',followSchema,'follows')