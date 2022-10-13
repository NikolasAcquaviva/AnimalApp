const express = require('express')
const frontRoutes = express.Router();
const Community = require('../models/Community');
const Service = require('../models/ServicesOffice');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');
const User = require('../models/UserRegistry')

frontRoutes.route('/preferences').get((req,res) => {
    User.findOne({username: req.query.user}, function(err,doc){
        if(doc == null) res.sendStatus(404);
        else res.send(doc.preferences);
    })
})

frontRoutes.route('/posts').get((req,res) => {
    let posts = [];
    Community.find((err,docs) => {
        for(let i in docs){
            let obj = {
                user: docs[i].user,
                date: docs[i].date,
                post: docs[i].post,
                category: docs[i].category
            };
            posts.push(obj);
        }
        res.send(posts);
    });
});

frontRoutes.route('/writepost').post((req,res) => {
    let obj = req.body.obj;
    let post = new Community(obj);
    post.save()
    .then(() => {
        res.sendStatus(200);
    })
    .catch((err) => {
        console.log(err)
        res.sendStatus(500);
    });
});

frontRoutes.route('/headquarters').get((req,res) => {
    let service = req.query.service;
    let addresses = []
    Service.find({ 'weeklySchedule.name': service }, function(err,docs){
        for(let i in docs){
            addresses.push(docs[i].office);
        }
        res.send({
            headquarters: addresses
        });
    });
});

frontRoutes.route('/buyproduct').post((req,res) => {
    console.log(req.body)
    Product.findOne({name: req.body.name, category: req.body.category}, function(err,doc){
        doc.availability -= req.body.quantity;
        let product = doc;
        doc.save()
        .then(() =>{
            Invoice.findOne({username: req.body.user}, function(err,doc){
                console.log(doc)
                if(doc == null){
                    let invoice = {
                        username: req.body.user,
                        invoiceProductList: [{
                            productName: product.name,
                            image: product.image,
                            price: product.price,
                            quantity: req.body.quantity
                        }],
                        invoiceServicesList: [],
                        totalProductPrice: product.price,
                        totalServicesPrice: 0,
                        soFarTotal: product.price
                    };
                    let d = new Invoice(invoice);
                    d.save()
                    .then(() => res.sendStatus(200))
                    .catch((err) => console.log(err));
                }
                else{
                    doc.invoiceProductList.push({
                        productName: product.name,
                        image: product.image,
                        price: product.price,
                        quantity: req.body.quantity
                    });
                    doc.totalProductPrice += product.price;
                    doc.soFarTotal += product.price;
                    doc.save()
                    .then(() => res.sendStatus(200))
                    .catch((err) => console.log(err));
                }
            })
        })
    })
});

frontRoutes.route('/invoice').get((req,res) => {
    Invoice.findOne({username: req.query.user}, function(err,doc){        
        if(doc == null) res.sendStatus(404);
        else{
            console.log(doc)
            res.send({
                products: doc.invoiceProductList,
                totalProducts: doc.totalProductPrice,
                soFarTotal: doc.soFarTotal,
                services: doc.invoiceServicesList,
                totalServices: doc.totalServicesPrice
            });
        }
    })
})
module.exports = frontRoutes
