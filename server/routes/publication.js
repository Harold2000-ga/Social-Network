/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const publicationController = require('../controllers/publication')
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
  folder: 'Publications',
  allowedFormats: ['jpg', 'png', 'jpeg'],
  transformation: [{ width: 500, height: 300, crop: 'fill' }],
  quality: 'auto',
})

const uploads = multer({ storage: storage })

//Test
router.get('/test-publication', publicationController.testPublication)

//Routes
router.get('/details/:id', check.auth, publicationController.details)
router.post('/save', [check.auth, uploads.single('image')], publicationController.save)
router.delete('/delete/:id', check.auth, publicationController.remove)
router.get('/user/:id/:page?', check.auth, publicationController.user)
router.post('/upload/:id', [check.auth, uploads.single('file0')], publicationController.upload)
router.get('/media/:file', publicationController.media)
router.get('/feed/:page?', check.auth, publicationController.feed)

module.exports = router
