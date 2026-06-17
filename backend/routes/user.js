const express = require('express')
const requireAuth = require('../middleware/requireAuth')
//controller functions
const {
    loginUser,
    signupUser,
    getUserProfile,
    updateUserProfile
} = require('../controllers/userController')

const router = express.Router()

// const requireAuth = require('../middleware/requireAuth')

// //middleware for authentication
// router.use(requireAuth)
// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

router.use(requireAuth)
router.get('/profile', getUserProfile)
router.patch('/profile', updateUserProfile)

module.exports = router