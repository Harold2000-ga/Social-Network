const express = require('express')
const router = express.Router()
const publicationController = require('../controllers/publication')
const check = require('../middleware/auth')
const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'./uploads/publication/')
    },
    filename: (req,file,cb) => {
        cb(null,'pub'+Date.now()+'-'+file.originalname)
    
    }
})
const uploads = multer({storage})

//Test
router.get('/test-publication', publicationController.testPublication)

//Routes
router.get('/details/:id',check.auth,publicationController.details)
router.post('/save',check.auth,publicationController.save)
router.delete('/delete/:id',check.auth,publicationController.remove)
router.get('/user/:id/:page?',check.auth,publicationController.user)
router.post('/upload/:id',[check.auth,uploads.single('file0')],publicationController.upload)
router.get('/media/:file',publicationController.media)
router.get('/feed/:page?',check.auth,publicationController.feed)

module.exports = router
