const express = require('express')
const gameRoutes = express.Router();
const https = require('https')
const bodyParser = require('body-parser');
const Ranking = require('../models/Ranking')
gameRoutes.use(express.json())
gameRoutes.use(bodyParser.urlencoded({
  extended: true
}))

gameRoutes.route('/video_ids').get((req,res) => {
  let buffers = []
  let ids = []
  let query = req.query.word == 'funny' ? 'funny pets' : 'informative pets'
  https.get('https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=' + query + '&videoEmbeddable=true&key=AIzaSyDeYQITwkpGsVSmLsxO70LkK7vN_v-pX4I',{
    Accept: 'application/json'
  }, (hres) => {
    hres
      .on('data', (data) => {
        buffers.push(data);
      })
      .on('end', () => {
        let buffer = Buffer.concat(buffers);
        let obj = JSON.parse(buffer);
        for(let i in obj.items){
          ids.push(obj.items[i].id.videoId)
        }
        res.send(ids);
      });
  });
});

gameRoutes.route('/videos').get((req,res) => {
  let buffers = []
  https.get('https://www.googleapis.com/youtube/v3/videos?part=player&id=' + req.query.id + '&key=AIzaSyDeYQITwkpGsVSmLsxO70LkK7vN_v-pX4I', (hres) => {
    hres.on('data', (data) => {
      buffers.push(data);
    })
    .on('end', () => {
      let buffer = Buffer.concat(buffers)
      let obj = JSON.parse(buffer);
      let response = obj.items[0].player.embedHtml
      response = response.replace("width=\"480\" height=\"270\"","class=\"video\"");
      response = response.replace("width=\"480\" height=\"360\"","class=\"video\"");
      res.send(response)
    });
  })
});

gameRoutes.route('/addranking').post((req,res) => {
  Ranking.findOne({user: req.body.username}, function(err,doc){
    if(doc == null){
      let newRanking = new Ranking({
        user: req.body.username,
        totalPts: req.body.score,
        playedMatches: 1,
        avgPtsPerQuiz: req.body.score/5
      });
      newRanking.save()
        .then(() => {
          res.sendStatus(200);
        })
        .catch(() => {
          res.sendStatus(500);
        })
    }
    else{
      doc.totalPts += req.body.score;
      doc.playedMatches++;
      doc.avgPtsPerQuiz += req.body.score/5;
      doc.save()
        .then(() => {
          res.sendStatus(200);
        })
        .catch(() => {
          res.sendStatus(500);
        })
    }
  })
});

gameRoutes.route('/rankings').get((req,res) => {
  Ranking.find(function(err,docs){
    res.send(docs)
  });
});

module.exports = gameRoutes
