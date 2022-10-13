const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InvoiceSchema = new Schema({
    username: { type: String, required: true, unique: true },
    invoiceProductList: [{
        productName: String, image: String, price: Number, quantity: Number,
    }],
    totalProductPrice: {type: Number, required: true},
    invoiceServicesList: [{
            office: {
                city: String,
                address: String
            }, 
            service: String, price: Number }],
    totalServicesPrice: { type: Number, required: true },
    soFarTotal: { type: Number, required: true, min: 0.0 }
})

module.exports = mongoose.model('Invoice', InvoiceSchema)