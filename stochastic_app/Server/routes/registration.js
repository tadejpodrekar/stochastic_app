const mongoose = require('mongoose')
const User = mongoose.model("User")
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const router = express.Router()

router.post('/', async (req, res) => {
    try
    {
        console.log(req.body)
        const { username, password } = req.body

        const hashedPass = await bcrypt.hash(password, 12)
        const newUser = await User.create({ username, password:hashedPass })
        console.log(newUser);
        const token = jwt.sign({ user:newUser }, process.env.JWT_SECRET)

        res.status(201).json({
            username: newUser.username,
            accessToken: token,
            message: 'Successfully registered user'
        })
    }
    catch(err)
    {
        console.log(err.message);
        res.status(400).json({ message:err.message })
    }
})

module.exports = router