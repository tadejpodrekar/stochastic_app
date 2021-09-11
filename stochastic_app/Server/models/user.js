const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    contacts:[{
        type: mongoose.ObjectId,
        ref: 'Contact'
    }]
})

userSchema.plugin(uniqueValidator, { message: 'Error, expected username to be unique.' })
mongoose.model("User",userSchema)