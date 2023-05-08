const express = require('express')
const router = express.Router()
const publicationController = require('../controllers/publication')
const check = require('../middleware/auth')

//Routes

//Test

router.get('/test-publication', publicationController.testPublication)
router.get('/details/:id',check.auth,publicationController.details)
router.post('/save',check.auth,publicationController.save)
router.delete('/delete/:id',check.auth,publicationController.remove)
router.get('/user/:id/:page?',check.auth,publicationController.user)

module.exports = router
