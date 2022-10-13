const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OfficeSchema = new Schema({
    _id: { city: String, address: String },
    services: [String]
})

module.exports = mongoose.model('Office', OfficeSchema)