const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    name: { type: String, required: true},
    availability: { type: Number, required: true, min: 0},
    category: { type: String, required: true},
    price: {type: Number, required: true, min: 0.0},
    image: {type: String, required: true},
})


module.exports = mongoose.model('Product', ProductSchema)
