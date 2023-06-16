//Imports
const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const check = require('../middleware/auth')
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2
require('dotenv').config()

//Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'blog',
  allowedFormats: ['jpg', 'png', 'jpeg'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }],
})

const uploads = multer({ storage: storage })

//Test
router.get('/test-user', check.auth, userController.testUser)
//Routes

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/profile/:id', check.auth, userController.profile)
router.get('/list/:page?', check.auth, userController.list)
router.put('/update', [check.auth, uploads.single('image')], userController.update)
router.post('/upload', [check.auth, uploads.single('file0')], userController.upload)
router.get('/avatar/:file', userController.avatar)
router.get('/counters/:id?', check.auth, userController.counters)

//Export
module.exports = router
