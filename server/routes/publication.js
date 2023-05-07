const express = require('express')
const router = express.Router()
const publicationController = require('../controllers/publication')

//Routes

//Test

router.get('/test-publication', publicationController.testPublication)

module.exports = router
