const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RankingSchema = new Schema({
    user: { type: String, required: true },
    totalPts: { type: Number, required: true },
    playedMatches: { type: Number, required: true },
    avgPtsPerQuiz: { type: Number, required: true}
});

module.exports = mongoose.model('Ranking', RankingSchema)