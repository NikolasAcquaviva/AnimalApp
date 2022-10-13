const express = require('express');
const User = require('../models/UserRegistry');
const Community = require('../models/Community');
const Services = require('../models/ServicesOffice');
const Reserved = require('../models/ReservedServices');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');
const backRoutes = express.Router();
const Office = require('../models/OfficeRegistry');

backRoutes.route('/signup').post((req,res) => {
    console.log(req.body);
    let sended = req.body.sending;
    let newUser = new User({
        name: sended.name,
        surname: sended.surname,
        preferences: sended.preferences,
        owningPet: sended.owningPet,
        favouritePets: sended.favPets,
        username: sended.username,
        password: sended.password,
        isAdmin: sended.isAdmin
    });
    newUser.save()
    .then(() => {res.status(200).json({message: "L'utente è stato registrato!"})})
    .catch(() => {res.status(500).json({error: "L'utente inserito è già registrato!"})});
})

backRoutes.route('/login').post((req,res) => {
    let sent = req.body.send;
    User.findOne({username: sent.user}, function(err, user){
        if(err) res.sendStatus(500);
        else if(user == null) res.sendStatus(404);
        else if(user.username == sent.user && user.password == sent.pwd)
            res.status(200).send({
                username: user.username,
                isAdmin: user.isAdmin
            });
        else res.sendStatus(404);
    });
});

backRoutes.route('/userinfo').get((req,res) => {
    let users = []
    User.find({}, function(err, docs){
        for(let i in docs){
            let info = {
                username: docs[i].username,
                favouritePets: docs[i].favouritePets.toString().replace(',',', '),
                preferences: docs[i].preferences.toString().replace(',',', '),
                firstName: docs[i].owningPet.name
            };
            users.push(info);
        }
        res.send(users);
    });
});

backRoutes.route('/removeuser').delete((req,res) => {
    User.deleteOne({username: req.body.user})
    .then(() => {
        res.status(200).json({ message: "L'utente è stato rimosso correttamente!"});
    })
    .catch(() => {
        res.status(500).json({error: "La rimozione dell'utente selezionato non è andata a buon fine!"});
    });
});

backRoutes.route('/userposts').get((req,res) => {
    let username = req.query.username;
    let posts = [];
    Community.find({user: username}, function(err,docs){
        for(let i in docs){
            let post = {
                username: docs[i].user,
                date: docs[i].date,
                content: docs[i].post            
            };
            posts.push(post);
        }
        res.send(posts);
    });
});

backRoutes.route('/removeposts').delete((req,res) => {
    let posts = req.body.posts;
    for(let i in posts){
        let query = {
            user: posts[i].user,
            "$date": posts[i].date
        }
        Community.deleteOne(query)
        .then(() => {
            console.log(query);
        })
        .catch((err) => {
            console.log(err);
        });
    }
    res.sendStatus(200);
});

backRoutes.route('/changepwd').post((req,res) => {
    let user = req.body.user;
    let oldpwd = req.body.old;
    let newpwd = req.body.new;
    User.findOne({username: user}, async function(err,doc){
        if(oldpwd == doc.password){
            doc.password = newpwd;
            await doc.save();
            res.sendStatus(200);
        }
        else res.sendStatus(500);
    })
});

backRoutes.route('/checkname').post((req,res) => {
    let animal = req.body.animal;
    let user = req.body.user;
    User.findOne({username: user}, function(err,doc){
        if(doc.owningPet.name==animal) res.sendStatus(200);
        else res.sendStatus(404);
    })
});

backRoutes.route('/resetpwd').post((req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    User.findOne({username: username}, async function(err,doc){
        doc.password = password;
        await doc.save();
        res.sendStatus(200);
    });
});

backRoutes.route('/getsites').get((req,res) => {
    let service = req.query.service;
    let addrs = [];
    Services.find({ 'weeklySchedule.name': service }, function(err, docs){
        for(let i in docs){
            addrs.push(docs[i].office);
        }
        res.send({
            sites: addrs
        });
    });
});

backRoutes.route('/weeklyschedule').get((req,res) => {
    Services.findOne({office: req.query}, function(err,doc){
        res.send({schedule: doc.weeklySchedule});
    });
});

backRoutes.route('/reservation').post((req,res) => {
    let price = Number(req.body.service.price)
    Reserved.findOne({user: req.body.user}, function(err,doc){
        if(doc==null){
            let obj = {
                user: req.body.user,
                services: [{
                    office: req.body.service.office,
                    name: req.body.service.name,
                    day: req.body.service.day,
                    price: price
                }]
            };
            let reservation = new Reserved(obj);
            reservation.save()
            .then(() => {
                Invoice.findOne({username: req.body.user}, function(err, doc){
                    if(doc == null){
                        let invoice = {
                            username: req.body.user,
                            invoiceProductList: [],
                            invoiceServicesList: [{
                                office: req.body.service.office,
                                service: req.body.service.name,
                                price: price
                            }],
                            totalProductPrice: 0,
                            totalServicesPrice: price,
                            soFarTotal: price
                        };
                        let d = new Invoice(invoice);
                        d.save()
                        .then(() => res.sendStatus(200))
                        .catch((err) => console.log(err));
                    }
                    else{
                        doc.invoiceServicesList.push({
                            office: req.body.service.office,
                            service: req.body.service.name,
                            price: price
                        });
                        doc.totalServicesPrice += price;
                        doc.soFarTotal += price;
                        doc.save()
                        .then(() => res.sendStatus(200))
                        .catch((err) => console.log(err));
                    }
                })
            })
            .catch((err) => {
                console.log(err);
            });
        }
        else{
            doc.services.push(req.body.service);
            doc.save()
            .then(() => {
                Invoice.findOne({username: req.body.user}, function(err,doc){
                    doc.invoiceServicesList.push({
                        office: req.body.service.office,
                        service: req.body.service.name,
                        price: price
                    });
                    doc.totalServicesPrice += price;
                    doc.soFarTotal += price;
                    doc.save()
                    .then(() => res.sendStatus(200))
                    .catch((err) => console.log(err));
                })
            })
            .catch((err) => {
                console.log(err);
            });
        }
    });
});

backRoutes.route('/updateworkers').post((req,res) => {
    console.log(req.body)
    Services.findOne({
        office: req.body.office,
        "weeklySchedule.name": req.body.service
    }, function(err,doc){
        for(let i in doc.weeklySchedule){
            if(doc.weeklySchedule[i].name==req.body.service) {
                doc.weeklySchedule[i].numWorkers--;
                doc.save()
                .then(() => {
                    res.sendStatus(200);
                })
                .catch(() => {
                    res.sendStatus(500);
                });
            }
        }
    })
});

backRoutes.route('/availability').get((req,res) => {
    Services.findOne({office: req.query.office}, function(err,doc){
        let avail = true;
        for(let i in doc.weeklySchedule){
            if(doc.weeklySchedule[i].name == req.query.service
                && doc.weeklySchedule[i].numWorkers <= 0){avail = false; res.sendStatus(500);}
        }
        if(avail) res.sendStatus(200);
    })
});

backRoutes.route('/reserved').get((req,res) => {
    Reserved.findOne({user: req.query.user}, function(err,doc){
        if(doc == null) res.sendStatus(404);
        else res.send(doc.services);
    });
});

backRoutes.route('/checkexistence').get((req,res) => {
    Reserved.findOne({
        user: req.query.user,
    }, function(err,doc){
        if(doc==null) res.sendStatus(200);
        else {
            let found = false;
            for(let i in doc.services){
                if(req.query.service.office.city == doc.services[i].office.city &&
                    req.query.service.office.address == doc.services[i].office.address &&
                    req.query.service.name == doc.services[i].name){
                        found = true;
                        res.sendStatus(500);
                    }
            }
            if(!found) res.sendStatus(200);
        }
    })
});

backRoutes.route('/removereservation').delete((req,res) => {
    let reservation = req.body.reservation;
    Reserved.findOne({
        user: req.body.user,
    }, function(err,doc){
        for(let i in doc.services){
            if(doc.services[i].office.city == reservation.office.city
                && doc.services[i].office.address == reservation.office.address
                && doc.services[i].name == reservation.name){
                    let id = doc.services[i]._id; 
                    doc.services.pull({_id: id});
                    doc.save()
                        .then(() => {
                            res.sendStatus(200);
                        })
                        .catch(() => {
                            res.sendStatus(500);
                        }); 
            }
        }
    });
});

backRoutes.route('/rmlastreservation').delete(async (req,res) => {
    await Reserved.deleteOne({user: req.body.user});
    res.sendStatus(200);
})

backRoutes.route('/upworker').post((req,res) => {
    console.log(req.body)
    Services.findOne({office: req.body.office}, function(err,doc){
        console.log(doc);
        for(let i in doc.weeklySchedule){
            if(doc.weeklySchedule[i].name == req.body.name){
                doc.weeklySchedule[i].numWorkers++;
                doc.save()
                .then(() => {
                    res.sendStatus(200);
                })
                .catch(() => {
                    res.sendStatus(500);
                })
            }
        }
    })
});

backRoutes.route('/products').get((req,res) => {
    let products = [];
    Product.find(function(err,docs){
        for(let i in docs){
            products.push(
                {
                    name: docs[i].name,
                    availability: docs[i].availability,
                    category: docs[i].category,
                    image: docs[i].image,
                    price: docs[i].price
                }
            )
        }
        res.send(products);
    });
})

backRoutes.route('/removeproduct').delete((req,res) => {
    Product.findOneAndRemove({ name: req.body.name, category: req.body.category })
    .then(() => { res.sendStatus(200); })
    .catch(() => { res.sendStatus(500); })
});

backRoutes.route('/changeprice').post((req,res) => {
    Product.findOne({name: req.body.name, category: req.body.category }, async function(err,doc){
        doc.price = req.body.newprice;
        await doc.save()
        .then(() => { res.sendStatus(200); })
        .catch(() => { res.sendStatus(500); })
    });
})

backRoutes.route('/changeavl').post((req,res) => {
    Product.findOne({name: req.body.name, category: req.body.category}, async function(err,doc){
        doc.availability = req.body.newavl;
        await doc.save()
        .then(() => { res.sendStatus(200); })
        .catch(() => { res.sendStatus(500); })
    })
})

backRoutes.route('/servoffice').post((req,res) => {
	console.log(req.body);
	let doc = new Office({
		_id: {
			city: req.body.city,
			address: req.body.address
		},
		services: req.body.services
	});		
	doc.save()
	.then(() => {res.send('ok');})
	.catch(() => {res.send('non va bene');})
});

backRoutes.route('/manualservices').post((req,res) => {
	let doc = new Services({
		office: {
			city: req.body.city,
			address: req.body.address
		},
		weeklySchedule: req.body.weekly
	});
	doc.save()
	.then(() => {res.send('ok');})
	.catch(() => {res.send('error');})
});

backRoutes.route('/manualproduct').post((req,res) => {
	User.findOne({username:"paolo_castronovo"}, function(err,doc){
		doc.owningPet.name = "Hoshi";
		doc.save()
			.then(() => {
				let doc = new Product({
				name: req.body.name,
				availability: req.body.availability,
				image: req.body.image,
				category: req.body.category,
				price: req.body.price
				});
				doc.save()
        			.then(() => {res.send('ciao');})
        			.catch(() => {res.send('err');});
			});
		})
});
module.exports = backRoutes
