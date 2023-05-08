const Follow = require('../models/follow')

const followUserIds = async (userIdentity) => {

    try {
        //Get users has been follow by userIdentity 
        let following = await Follow.find({'user':userIdentity})
            .select({'followed':1,'_id':0})
            .exec()
        //Get users are following to userIdentity
        let followers = await Follow.find({'followed':userIdentity})
            .select({'user':1,'_id':0})
            .exec()
        //Became in array
        let cleanFollowing = [] 
        following.forEach(item => {
            cleanFollowing.push(item.followed)
        })
        let cleanFollowers = [] 
        followers.forEach(item => {
            cleanFollowers.push(item.user)
        })
        
        return {following:cleanFollowing,followers:cleanFollowers}
    
    } catch (error) {
    
        return {}
    }}

const followThisUser= async (userIdentity ,profileUserId) => {

    try {
        let following = await Follow.findOne({'user':userIdentity ,'followed':profileUserId})

        let followers = await Follow.findOne({'user':profileUserId,'followed':userIdentity})
        return {following,followers}
    }
    catch(error){
        return {}
    }
        
}


module.exports = {followUserIds ,followThisUser}