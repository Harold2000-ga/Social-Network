//Import models
const Publication = require('../models/publication')

//Import dev
const fs = require('fs')
const path = require('path')

//Import service
const followServices = require('../services/followServices')

//Test
const testPublication = (req, res) => {
  res.status(200).send({
    message: 'Messages from publication.js',
  })
}
//Save
const save = (req, res) => {
  // Get data from body
  const params = req.body
  if (!params.text) {
    return res.status(400).send({
      status: 'Error',
      message: 'No data sent',
    })
  }
  let newPublication = new Publication({
    user: req.user.id,
    text: params.text,
  })
  newPublication
    .save()
    .then(item => {
      if (!item) {
        return res.status(400).send({
          status: 'Error',
          message: 'Data not saved',
        })
      }

      return res.status(200).send({
        status: 'Success',
        message: 'Publication saved',
        publication: newPublication,
      })
    })
    .catch(error => {
      console.log(error)
      return res.status(500).send({
        status: 'Error',
        message: 'Error in save to database',
      })
    })
}
//Get
const details = (req, res) => {
  //Get id of publication
  const id = req.params.id
  //Find
  Publication.findById(id)
    .then(item => {
      if (!item) {
        return res.status(404).send({
          status: 'Error',
          message: 'Publication not found',
        })
      }
      return res.status(200).send({
        status: 'Success',
        Publication: item,
      })
    })
    .catch(error => {
      console.log(error)
      return res.status(404).send({
        status: 'Error',
        message: 'Publication not found',
      })
    })
}
//Delete
const remove = (req, res) => {
  //Get id publication
  const id = req.params.id
  //Find and delete
  Publication.find({ user: req.user.id, _id: id })
    .then(item => {
      if (!item) {
        return res.status(404).send({
          status: 'Error',
          message: 'Publication no exist',
        })
      }
      return res.status(200).send({
        status: 'Success',
        message: 'Publication has been deleted',
        Publication: item,
      })
    })
    .catch(error => {
      console.log(error)
      return res.status(404).send({
        status: 'Error',
        message: 'Publication not found',
      })
    })
}
//list of one user
const user = (req, res) => {
  //Get id
  const userId = req.params.id
  //Control page
  let page = 1
  if (req.params.page) page = req.params.page
  const itemPerPage = 5
  //Find , paginate and populate
  Publication.paginate(
    { user: userId },
    {
      page,
      limit: itemPerPage,
      sort: '-create_at',
      populate: { path: 'user', select: '-bio -password -__v -email' },
    }
  )
    .then(item => {
      if (!item) {
        return res.status(404).send({
          status: 'Error',
          message: 'No publication to show',
        })
      }
      return res.status(200).send({
        status: 'Success',
        totalPublications: item.totalDocs,
        currentPage: item.page,
        totalPages: item.totalPages,
        Publications: item.docs,
      })
    })
    .catch(error => {
      console.log(error)
      return res.status(404).send({
        status: 'Error',
        message: 'Publication not found',
      })
    })
}
//Upload file
const upload = (req, res) => {
  //Get image
  let image = req.file.originalname
  //Get publication id
  const publicationId = req.params.id
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
  Publication.findOneAndUpdate(
    { user: req.user.id, _id: publicationId },
    { file: req.file.filename },
    { new: true }
  )
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
//Return multimedia
const media = (req, res) => {
  //Get url params
  const file = req.params.file
  //Path real of the image
  const filePath = './uploads/publication/' + file
  //Test if path exist
  fs.stat(filePath, (error, exist) => {
    if (!exist) {
      return res.status(400).send({
        status: 'error',
        message: 'No exist the file',
      })
    }

    res.sendFile(path.resolve(filePath))
  })
}
//List of
const feed = async (req, res) => {
  //Get page actual
  let page = 1
  if (req.params.page) page = req.params.page
  const itemPerPage = 5

  //Get array of ids what I follow like user login
  try {
    const myFollows = (await followServices.followUserIds(req.user.id))
      .following
    //Find publication ,populate and paginate
    Publication.paginate(
      { user: myFollows },
      {
        page,
        limit: itemPerPage,
        sort: '-create_at',
        populate: { path: 'user', select: '-__v -password -bio -role -email' },
      }
    )
      .then(item => {
        if (!item) {
          res.status(404).send({
            status: 'Error',
            message: 'No exist publications of some follower',
          })
        }
        res.status(200).send({
          status: 'Success',
          message: 'List of publications',
          totalPublications: item.totalDocs,
          currentPage: item.page,
          totalPages: item.totalPages,
          Publications: item.docs,
        })
      })
      .catch(error => {
        console.log(error)
        res.status(404).send({
          status: 'Error',
          message: 'The publication can not be founded',
        })
      })
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'The feed publication has not been listed',
    })
  }
}

module.exports = {
  testPublication,
  save,
  details,
  remove,
  user,
  upload,
  media,
  feed,
}
