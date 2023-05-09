//Imports
const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const check = require('../middleware/auth')
const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'./uploads/avatars/')
    },
    filename: (req,file,cb) => {
        cb(null,'avatar'+Date.now()+'-'+file.originalname)

    }
})
const uploads = multer({storage})

//Test
router.get('/test-user', check.auth, userController.testUser)
//Routes

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/profile/:id', check.auth, userController.profile)
router.get('/list/:page?', check.auth, userController.list)
router.put('/update', check.auth, userController.update)
router.post('/upload', [check.auth,uploads.single('file0')], userController.upload)
router.get('/avatar/:file',userController.avatar)
router.get('/counters/:id?', check.auth,userController.counters)



//Export
module.exports = router
