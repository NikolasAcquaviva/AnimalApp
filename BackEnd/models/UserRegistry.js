const mongoose = require('mongoose'),
    Schema = mongoose.Schema
   
//boolean sex: false = male, true = female
    
const UserSchema = new Schema({
    name: {type: String, required: true},
    surname: { type: String, required: true},
    preferences: { type: [String], required: true },
    owningPet: { animal: String, name: String, sex: Boolean, age: Number, description: String },
    favouritePets: { type: [String], required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true }
});
     

module.exports = mongoose.model('User', UserSchema);