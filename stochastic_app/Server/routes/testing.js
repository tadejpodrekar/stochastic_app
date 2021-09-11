const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const Test = mongoose.model("Test")
const authUser = require('../middleware/authUser')

router.use(authUser)

router.post('/postTest', async (req, res) => {
    try {
        const test = await Test.create(req.body)
        console.log(req.body)
        res.status(201).json({ message: 'Test created!' })
    } catch (e) {
        res.status(400).json({ message: err.message })
    }
})

router.get('/tests', async (req, res) => {
    try {
        const allTests = await Test.find();
        res.status(200).json({message:"returning all tests", tests:allTests})
    } catch(e) {
        res.status(400).json({ message: err.message })
    }
})

router.post('/testResult', async (req, res) => {
    try {
        const test = await Test.findOneAndUpdate({_id: req.body.id}, {
            $push: {results: req.body.res}, 
            $inc: {doneRuns: 1}
        } )
        res.status(201).json({ message: 'Test result saved!' })
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
})

module.exports = router