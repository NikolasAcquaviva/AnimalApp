const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommunitySchema = new Schema({
    user: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    post: { type: String, required: true }
});

module.exports = mongoose.model('Community', CommunitySchema)