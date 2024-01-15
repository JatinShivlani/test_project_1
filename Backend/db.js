const mongoose = require('mongoose')
require('dotenv').config()

// const newSchema=mongoose.Schema({
// title:String,
// content:String
// })
// const App=mongoose.model('app',newSchema)
async function connect() {
    const url = `mongodb://127.0.0.1:27017/testProject`
    await mongoose.connect(url).then(() => {
        console.log('connected successfully')
    })
}
module.exports = connect;
