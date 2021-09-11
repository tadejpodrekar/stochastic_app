const mongoose = require('mongoose')
const User = mongoose.model("User")
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const router = express.Router()

router.post('/', async (req, res) => {
    const { username, password } = req.body
    try
    {
        var user = await User.findOne({username:username})
        if(user && user!=[])
        {
            const match = await bcrypt.compare(password, user.password)
            if(match)
            {
                const token = jwt.sign({ user }, process.env.JWT_SECRET)
                res.status(200).json({
                    username: user.username,
                    accessToken: token,
                    message: 'Successfully logged in'
                })
            }
            else
            {
                console.log('passwords do not match')
                res.status(400).send('Username or password incorrect')
            }
        }
        else
        {
            console.log('user not found')
            res.status(400).send('Username or password incorrect')
        }
    }
    catch(err)
    {
        console.log(err.message)
        res.status(400).send(err.message)
    }
})

module.exports = router