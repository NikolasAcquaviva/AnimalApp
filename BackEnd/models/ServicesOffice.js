const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ServicesSchema = new Schema({
    office: {city: String, address: String},
    weeklySchedule: [{name: String, price: Number, numWorkers: Number, day: [Number]}],
})

module.exports = mongoose.model('Services', ServicesSchema)