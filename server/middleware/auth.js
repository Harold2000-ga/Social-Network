//Imports
const jwt = require('jwt-simple')
const moment = require('moment')
const myJwt = require('../services/jwt')

const secret = myJwt.secret

exports.auth = (req, res, next) => {
    //Verify header
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: 'Error',
            message: 'Header authorization is needed',
        })
    }
    let token = req.headers.authorization.replace(/['"+]/g, '')
    try {
        //Decode token
        let payload = jwt.decode(token, secret)
        //Check expiration token
        if (payload.exp <= moment().unix()) {
            return res.status(402).send({
                status: 'Error',
                message: 'Token expired',
            })
        }
        //return user data
        req.user = payload
    } catch (error) {
        return res.status(402).send({
            status: 'Error',
            message: 'Invalid token',
        })
    }

    next()
}
