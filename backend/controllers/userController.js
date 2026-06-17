const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// create token
const createToken = (_id) => {

    return jwt.sign({ _id }, process.env.SECRET, {
        expiresIn: '3d'
    })
}

// login user
const loginUser = async (req, res) => {

    const { email, password } = req.body

    try {

        const user = await User.login(email, password)

        // create token
        const token = createToken(user._id)

        res.status(200).json({
            email,
            token
        })

    } catch(error){

        res.status(400).json({
            error: error.message
        })
    }
}


// signup user
const signupUser = async (req, res) => {

    const { email, password } = req.body

    try {

        const user = await User.signup(email, password)

        // create token
        const token = createToken(user._id)

        res.status(200).json({
            email,
            token
        })

    } catch(error){

        res.status(400).json({
            error: error.message
        })
    }
}

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password') // Exclude password safety
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Update User Profile
const updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { ...req.body },
            { new: true, runValidators: true }
        ).select('-password')
        
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    signupUser,
    loginUser,
    getUserProfile,
    updateUserProfile
}