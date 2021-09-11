const mongoose = require('mongoose')

class Connection {
    constructor() {
        const url = process.env.MONGODB_URI
        mongoose.Promise = global.Promise
        mongoose.set("useNewUrlParser", true)
        mongoose.set("useFindAndModify", false)
        mongoose.set("useCreateIndex", true)
        mongoose.set("useUnifiedTopology", true)
        mongoose.connect(url)
        const db = mongoose.connection
        db.once('open', ()=>{
            console.log("Connected to database")
        })
        db.on('error', (err)=>{
            console.log("Error connecting to database.", err)
        })
    }
}

module.exports = new Connection()