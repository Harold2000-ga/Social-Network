const {Schema,model} = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const publicationSchema = Schema({
    user:{
        type:Schema.ObjectId,
        ref:'User'
    },
    text:{
        type:String,
        required:true
    },
    file:{
        type:String,
    },
    create_at:{
        type:Date,
        default:Date.now
    }
})

publicationSchema.plugin(mongoosePaginate)
module.exports = model('Publication',publicationSchema,'publications')


