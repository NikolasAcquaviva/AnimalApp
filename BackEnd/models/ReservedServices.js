const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReservedSchema = new Schema({
    user: { type: String, required: true },
    services: [{
        office: { city: String, address: String },
        name: String,
        day: Number,
        price: Number
    }]
});

module.exports = mongoose.model('Reserved', ReservedSchema)