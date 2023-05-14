//Import dev
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
//Import services
const { createToken } = require('../services/jwt')
const followServices = require('../services/followServices')
//Import models
const User = require('../models/user')
const Follow = require('../models/follow')
const Publication = require('../models/publication')
//Test
const testUser = (req, res) => {
  let user = req.user
  res.status(200).send({
    message: 'Messages from user.js',
    user,
  })
}
//Register users
const register = (req, res) => {
  //Get data
  let params = req.body

  //Validate
  if (!params.name || !params.nickname || !params.password || !params.email) {
    return res.status(400).json({
      status: 'Error',
      message: 'Not enough data',
    })
  }
  //Double user
  User.find({
    $or: [{ email: params.email.toLowerCase() }, { nickname: params.nickname.toLowerCase() }],
  })
    .exec()
    .then(async user => {
      if (user && user.length >= 1) {
        return res.status(200).send({
          status: 'Success',
          message: 'User already exist',
        })
      }
      //Password
      let password = await bcrypt.hash(params.password, 10)
      params.password = password
      //Create object
      let user_save = new User(params)
      //Save in database
      user_save
        .save()
        .then(user => {
          return res.status(200).send({
            status: 'Success',
            message: 'User register',
            user,
          })
        })
        .catch(error => {
          return res.status(500).send({
            status: 'Error',
            message: 'Error in save to database',
            error,
          })
        })
      //Response
    })
    .catch(error => {
      return res.status(400).send({
        status: 'Error',
        message: 'Error in find',
        error,
      })
    })

  //
}
//Login
const login = (req, res) => {
  //Get Params
  const params = req.body
  if (!params.password || !params.email) {
    return res.status(400).send({
      status: 'Error',
      message: 'No enough data',
    })
  }
  //Search in database
  User.findOne({ email: params.email })
    .then(user => {
      if (!user) {
        return res.status(400).send({
          status: 'Error',
          message: 'The user no exist',
        })
      }
      //Verify credential
      let password = bcrypt.compareSync(params.password, user.password)
      if (!password) {
        return res.status(400).send({
          status: 'Error',
          message: 'Wrong password',
        })
      }
      //Return token

      let token = createToken(user)
      //Return user data
      return res.status(200).send({
        status: 'Success',
        message: 'test',
        user: { id: user._id, name: user.name, email: user.email },
        token,
      })
    })
    .catch(error => {
      return res.status(400).send({
        status: 'Error',
        message: 'Error in find',
        error,
      })
    })
}
//Profile
const profile = (req, res) => {
  let id = req.params.id

  User.findById(id)
    .select({ password: false, role: false })
    .exec()
    .then(async user => {
      if (!user) {
        return res.status(400).send({
          status: 'Error',
          message: 'User no exist',
        })
      }
      let followThisUser = await followServices.followThisUser(req.user.id, id)
      return res.status(200).send({
        status: 'Success',
        user,
        followThisUser,
      })
    })
    .catch(error => {
      console.log(error)
      return res.status(400).send({
        status: 'Error',
        message: 'Error in find',
      })
    })
}
//List pagination
const list = (req, res) => {
  //Get page
  let page = 1
  req.params.page && (page = parseInt(req.params.page))
  const itemPerPage = 5
  //Paginate
  User.paginate({}, { page, limit: itemPerPage, select: '-password -email -__v ', sort: '_id' })
    .then(async result => {
      if (!result) {
        return res.status(400).send({
          status: 'Error',
          message: 'No results',
        })
      }
      const followUserIds = await followServices.followUserIds(req.user.id)

      return res.status(200).send({
        status: 'Success',
        message: 'User list',
        totalUsers: result.totalDocs,
        currentPage: result.page,
        totalPages: result.totalPages,
        users: result.docs,
        users_following: followUserIds.following,
        user_followers: followUserIds.followers,
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
//Update user
const update = (req, res) => {
  //Get User params and update
  const userInit = req.user
  const userToUpdate = req.body
  //Delete fields
  delete userInit.exp
  delete userInit.iat
  delete userInit.role
  //Test if exist
  User.find({
    $or: [
      { email: userToUpdate.email.toLowerCase() },
      { nickname: userToUpdate.nickname.toLowerCase() },
    ],
  })
    .then(async users => {
      if (!users) {
        return res.status(500).send({
          status: 'Error',
          message: 'Not Found',
        })
      }
      //Password
      if (userToUpdate.password) {
        let password = await bcrypt.hash(userToUpdate.password, 10)
        userToUpdate.password = password
      } else {
        delete userToUpdate.password
      }
      //Check if exist user updates
      let isSet = false
      users.forEach(user => {
        if (user && user.id != userInit.id) {
          isSet = true
        }
      })
      if (isSet) {
        res.status(400).send({
          status: 'Success',
          message: 'The user already exist',
        })
      }
      User.findByIdAndUpdate(userInit.id, userToUpdate, { new: true })
        .then(userUpdated => {
          if (!userUpdated) {
            return res.status(500).send({
              status: 'Error',
              message: 'Error in update',
            })
          }
          return res.status(200).send({
            status: 'Success',
            message: 'User updated',
            user: userUpdated,
          })
        })
        .catch(error => {
          console.log(error)
          return res.status(500).send({
            status: 'Error',
            message: 'Error in findByIdAndUpdate',
          })
        })
    })
    .catch(error => {
      console.log(error)
      return res.status(500).send({
        status: 'Error',
        message: 'Error in find',
      })
    })
}
//Upload file
const upload = (req, res) => {
  //Get image
  let image = req.file.originalname
  //Verify extension
  let splitImage = image.split('.')

  if (
    splitImage[1] !== 'jpeg' &&
    splitImage[1] !== 'jpg' &&
    splitImage[1] !== 'svg' &&
    splitImage[1] !== 'png'
  ) {
    console.log(splitImage[1])
    const filePath = req.file.path
    fs.unlinkSync(filePath)
    return res.status(500).send({
      status: 'Error',
      message: 'Invalid extension ',
    })
  }
  User.findOneAndUpdate({ _id: req.user.id }, { image: req.file.filename }, { new: true })
    .then(Updated => {
      if (!Updated) {
        return res.status(500).send({
          status: 'Error',
          message: 'Invalid',
        })
      }
      return res.status(200).send({
        status: 'Success',
        user: Updated,
        file: req.file,
      })
    })
    .catch(error => {
      console.log(error)
      return res.status(400).send({
        status: 'Error',
        message: 'Error in upload',
      })
    })
}
//Avatar
const avatar = (req, res) => {
  //Get url params
  const file = req.params.file
  //Path real of the image
  const filePath = './uploads/avatars/' + file
  //Test if path exist
  fs.stat(filePath, (error, exist) => {
    if (error || !exist) {
      return res.status(400).send({
        status: 'error',
        message: 'No exist the image',
      })
    }
    res.sendFile(path.resolve(filePath))
  })
}
//Counter
const counters = async (req, res) => {
  //Get identity
  let userId = req.user.id
  //Test if url params
  if (req.params.id) userId = req.params.id

  try {
    const following = await Follow.count({ user: userId })

    const followed = await Follow.count({ followed: userId })

    const publications = await Publication.count({ user: userId })

    return res.status(200).send({
      userId,
      following: following,
      followed: followed,
      publications: publications,
    })
  } catch (error) {
    return res.status(500).send({
      status: 'error',
      message: 'Counters error',
      error,
    })
  }
}

module.exports = {
  testUser,
  register,
  login,
  profile,
  list,
  update,
  upload,
  avatar,
  counters,
}
