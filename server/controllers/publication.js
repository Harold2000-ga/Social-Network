//Import models
const Publication = require('../models/publication')


//Test
const testPublication = (req, res) => {
    res.status(200).send({
        message: 'Messages from publication.js',
    })
}
//Save
const save = (req,res) => {
    // Get data from body
    const params = req.body
    if(!params.text){
        return res.status(400).send({
            status:'Error',
            message:'No data sent'
        })
    }
    let newPublication = new Publication({
        user:req.user.id,
        text:params.text
    })
    newPublication.save().then(item => {
        if(!item){
            return res.status(400).send({
                status:'Error',
                message:'Data not saved'
            })

        }
        
        return res.status(200).send({
            status:'Success',
            message:'Publication saved',
            publication:newPublication
        })
    }).catch(error => {
        console.log(error)
        return res.status(500).send({
            status:'Error',
            message:'Error in save to database'
        })
    })


}
//Get 
const details = (req,res ) => {
    //Get id of publication
    const id = req.params.id
    //Find
    Publication.findById(id).then(item => {
        if(!item){
            return res.status(404).send({
                status:'Error',
                message:'Publication not found'
            })
        }
        return res.status(200).send({
            status:'Success',
            Publication:item
        })
    }).catch(error => {
        console.log(error)
        return res.status(404).send({
            status:'Error',
            message:'Publication not found'
        })
        
    })


}
//Delete 
const remove= (req,res) => {
    //Get id publication 
    const id = req.params.id
    //Find and delete
    Publication.find({'user':req.user.id,'_id':id}).then(item => {
        if(!item){
            return res.status(404).send({
                status:'Error',
                message:'Publication no exist'
            })
        }
        return res.status(200).send({
            status:'Success',
            message:'Publication has been deleted',
            Publication:item
        })
    }).catch(error => {
        console.log(error)
        return res.status(404).send({
            status:'Error',
            message:'Publication not found'
        })
        
    })
}
//list of one user
const user =(req, res ) => {
    //Get id 
    const userId = req.params.id
    //Control page
    let page=1
    if (req.params.page) page=req.params.page
    const itemPerPage=5
    //Find , paginate and populate
    Publication.paginate(
        {'user':userId},
        {page,limit:itemPerPage,sort:'-create_at',populate:{path:'user', select:'-bio -password -__v'}})
        .then(item => {
            if(!item){
                return res.status(404).send({
                    status:'Error',
                    message:'No publication to show'
                })
            }
            return res.status(200).send({
                status:'Success',
                totalPublications: item.totalDocs,
                currentPage: item.page,
                totalPages: item.totalPages,
                Publications: item.docs,
            })
        }).catch(error => {
            console.log(error)
            return res.status(404).send({
                status:'Error',
                message:'Publication not found'
            })
        
        })
}

//List


//Upload file

//Return file






module.exports = { testPublication,save,details,remove,user }
