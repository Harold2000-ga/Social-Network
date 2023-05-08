const Follow =require('../models/follow')
//const User =require('../models/user')
const followServices = require('../services/followServices')

const testFollow = (req, res) => {

    res.status(200).send({
        message: 'Messages from follow.js',
    })
}

//Follow
const save = (req , res ) => {

    //Get body data 
    const params= req.body
    //Get id user 
    const identity  = req.user
    //Save object in database
    const newFollow = new Follow({
        user:identity.id,
        followed:params.followed
    })
    newFollow.save().then(item => {
        if(!item){
            return res.status(400).send({
                status:'Error',
                message:'User no saved'
            }
          
            )}
    
        res.status(200).send({
            status:'Success',
            item
        })
    }).catch(error => {
        
        console.log(error)
        return res.status(400).send({
            status:'Error',
            message:'Follow no save user no exist'
        })
    })

}

//Delete follow
const unFollow = (req, res) => {

    //Get user identity
    const userId= req.user.id
    //Id from user to unFollow
    const followedId = req.params.id

    Follow.findOneAndRemove({user:userId,followed:followedId}).exec().then(item => {
        if(!item){
            return res.status(404).send({
                status:'Error',
                message:'No found follow'
            })}

        res.status(200).send({
            status:'success',
            message:'Has been unFollowed correctly',
            follow:item
        })
    })
    
}
//List of user who one user is following
const following = (req, res ) => {
    // Get id identity
    let userId = req.user.id
    //Test url id
    if(req.params.id) userId= req.params.id
    //Test url page
    let page =1
    if(req.params.page) page= req.params.page
    const itemPerPage=4
    //Find follows
    Follow.paginate(
        {user:userId},
        { page, limit: itemPerPage, sort: '_id' ,populate:{path:'followed',select:'-role -bio -password'}})
        .then(async result => {
            if (!result) {
                return res.status(400).send({
                    status: 'Error',
                    message: 'No results',
                })
            }
            const followUserIds = await followServices.followUserIds(userId)

            return res.status(200).send({
                status: 'Success',
                message: 'List of user , I am following',
                totalUsers: result.totalDocs,
                currentPage: result.page,
                totalPages: result.totalPages,
                users: result.docs,
                users_following:followUserIds.following,
                user_followers:followUserIds.followers
            })
        })
        .catch(error => {
            console.log(error)
            return res.status(400).send({
                status: 'Error',
                message: 'Could no get users',
            })
        })
}
//List of user are follow me 
const followers = (req,res) => {
    // Get id identity
    let userId = req.user.id
    //Test url id
    if(req.params.id) userId= req.params.id
    //Test url page
    let page =1
    if(req.params.page) page= req.params.page
    const itemPerPage=4
    //Find follows
    Follow.paginate(
        {'followed':userId},
        { page, limit: itemPerPage, sort: '_id' ,populate:{path:'user',select:'-role -bio -password'}})
        .then(async result => {
            if (!result) {
                return res.status(400).send({
                    status: 'Error',
                    message: 'No results',
                })
            }
            const followUserIds = await followServices.followUserIds(userId)

            return res.status(200).send({
                status: 'Success',
                message: 'Followers list',
                totalUsers: result.totalDocs,
                currentPage: result.page,
                totalPages: result.totalPages,
                users: result.docs,
                users_following:followUserIds.following,
                user_followers:followUserIds.followers
            })
        })
        .catch(error => {
            console.log(error)
            return res.status(400).send({
                status: 'Error',
                message: 'Could no get users',
            })
        })
}




module.exports = { testFollow ,save ,unFollow ,following, followers}
