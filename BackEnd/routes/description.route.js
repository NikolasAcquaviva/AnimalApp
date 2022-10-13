const express = require('express')
const https = require('https')
const descriptionRoutes = express.Router();
const bodyParser = require('body-parser');

descriptionRoutes.use(express.json())
descriptionRoutes.use(bodyParser.urlencoded({
  extended: true
}))

descriptionRoutes.route('/catintheface').post((req,res) => {
  let response = ""
  let buffers = []
  let codes = [100,101,102,200,201,202,301,305,307,407];
  let rng = Math.floor(Math.random() * codes.length)

  https.get('https://http.cat/' + codes[rng], (hres) => {
    hres
      .on('data', (chunk) => {
        buffers.push(chunk)
      })
      .on('end', () => {
        let tmp = Buffer.concat(buffers)
        response = tmp.toString('base64')
        res.send(response)
      })
  })
})
  
descriptionRoutes.route('/catsfacts').post((req,res) => {
  let facts = []
  https.get('https://catfact.ninja/facts?max_length=120&limit=10', (hres) => {
  hres.
    on('data', (d) => {
      const json = JSON.parse(d)
      for(let i in json.data) facts.push(json.data[i].fact)
    })
    .on('end', () => {
      res.send(facts)
    })
  })
})

descriptionRoutes.route('/fishonthetable').post((req,res) => {
  let response = {}
  let array = []
  let buffers = []
  let str = ""
  https.get('https://www.fishwatch.gov/api/species', (hres) => {
    hres
    .on('data', (chunk) => {
      buffers.push(chunk)
    })
    .on('end', () => {
      let tmp = Buffer.concat(buffers)
      str = tmp.toString('ascii')
      response = JSON.parse(str)
      array = Object.values(response)
      let number = Math.floor(Math.random()*array.length)
      if(array[number]['Image Gallery'] == null
          || array[number]['Image Gallery'][0] == undefined)
        res.sendStatus(404);
      else{
        response = {
          number: number,
          image: array[number]['Image Gallery'][0].src
        }
        res.send(response)
      }
    })
  })
})

descriptionRoutes.route('/fishinfo').post((req,res) => {
  let number = req.body.num
  let response = {}
  let array = []
  let buffers = []
  let str = ""
  https.get('https://www.fishwatch.gov/api/species', (hres) => {
    hres
    .on('data', (chunk) => {
      buffers.push(chunk)
    })
    .on('end', () => {
      let tmp = Buffer.concat(buffers)
      str = tmp.toString('ascii')
      response = JSON.parse(str)
      array = Object.values(response)
      response = {
        Name: array[number]['Scientific Name'],
        Habitat: array[number]['Habitat']
      }
      res.send(response)
    })
  })
})

descriptionRoutes.route('/bearonyourtroat').post((req,res) => {
  let response = ""
  let buffers = []
  let codes = [200,300,350,400]
  let rng = Math.floor(Math.random() * codes.length);
  https.get('https://placebear.com/400/' + codes[rng], (hres) => {
    hres
      .on('data', (chunk) => {
        buffers.push(chunk)
      })
      .on('end', () => {
        let tmp = Buffer.concat(buffers)
        response = tmp.toString('base64')
        res.send(response)
      })
  })
})

descriptionRoutes.route('/bearfact').get((req,res) => {
  let buffers = []
  https.get('https://api.animality.xyz/fact/bear', (hres) => {
    hres.
    on('data', (d) => {

      buffers.push(d)
    })
    .on('end', () => {      
      let json = Buffer.concat(buffers)
      /*if(json == undefined) res.sendStatus(500);
      */
      if(json[0] == undefined || json[0] == '\<')
        res.sendStatus(500);
      else{
        json = JSON.parse(json);
        res.send(json.fact)
      }
    })
  })
})

descriptionRoutes.route('/dogwantmeal').post((req,res) => {
  let response = ""
  let buffers = []
  let codes = [100,101,102,200,201,202,301,305,307,407];
  let rng = Math.floor(Math.random() * codes.length)
  https.get('https://http.dog/' + codes[rng] + '.jpg', (hres) => {
    hres
      .on('data', (chunk) => {
        buffers.push(chunk)
      })
      .on('end', () => {
        let tmp = Buffer.concat(buffers)
        response = tmp.toString('base64')
        res.send(response)
      })
  })
})

descriptionRoutes.route('/dogsfacts').post((req,res) => {

  let facts = [] 
  let buffer = []
  https.get('https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?number=10', (hres) => {
  hres
    .on('data', (d) => {
      buffer.push(d);
    })
    .on('end', () => {
      let json = JSON.parse(Buffer.concat(buffer))
      for(let i in json) facts.push(json[i].fact)
      res.send(facts)
    })
  })
})

descriptionRoutes.route('/duckforlife').post((req,res) => {
  let response = ""
  let buffers = []
  https.get('https://random-d.uk/api/randomimg', (hres) => {
    hres
      .on('data', (chunk) => {
        buffers.push(chunk)
      })
      .on('end', () => {
        let tmp = Buffer.concat(buffers)
        response = tmp.toString('base64')
        res.send(response)
      })
  })
})

descriptionRoutes.route('/duckintelligence').post((req,res) => {
  let buffers = []
  https.get('https://api.animality.xyz/fact/duck', (hres) => {
    hres.
    on('data', (d) => {
      buffers.push(d);
    })
    .on('end', () => {
      let buffer = Buffer.concat(buffers);
      let json = JSON.parse(buffer);
      console.log(json);
      if(json.error != undefined) res.sendStatus(500);
      res.send(json.fact)
    })
  })
})

descriptionRoutes.route('/sanitary').get((req,res) => {
  let facts = []
  // VEDDRA: Veterinary Dictionary for Drug Related Affairs
  https.get('https://api.fda.gov/animalandveterinary/event.json?search=animal.species:Horse+Dog+Cat+Cattle&limit=10', (hres) => {
    hres.
      on('data', (data) => {
        facts.push(data)
      })
      .on('end', () => {
        let tmp = Buffer.concat(facts);
        let str = tmp.toString('ascii')
        let obj = JSON.parse(str);
        let response = []
        facts = obj.results;
        
        for(let i in facts){
          let problems = []
          let ingredients = []
          for(let j in facts[i].reaction){
            problems.push(facts[i].reaction[j].veddra_term_name)
          }
          for(let j in facts[i].drug){
            for(let k in facts[i].drug[j].active_ingredients){
              if(facts[i].drug[j].active_ingredients[k].name != undefined)
                ingredients.push(facts[i].drug[j].active_ingredients[k].name)
            }
          }
          let assessed = facts[i].health_assessment_prior_to_exposure.assessed_by
          let specie = facts[i].animal.species
          let gender = facts[i].animal.gender
          let reproStatus = facts[i].animal.reproductive_status
          let final = {
            problems: problems,
            ingredients: ingredients,
            assessed: assessed,
            specie: specie,
            gender: gender,
            reproStatus: reproStatus
          };
          response.push(final);
        }
        res.send(response);
      })
  })
})

module.exports = descriptionRoutes;