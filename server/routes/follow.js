//Imports
const express = require('express')
const router = express.Router()
const followController = require('../controllers/follow')
const check = require('../middleware/auth')

//Test
router.get('/test-follow', followController.testFollow)

//Routes
router.post('/save', check.auth, followController.save)
router.delete('/unfollow/:id', check.auth, followController.unFollow)
router.get('/following/:id?/:page?', check.auth, followController.following)
router.get('/followers/:id?/:page?', check.auth, followController.followers)

module.exports = router
