const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const database = require('./database')
const bodyParser = require("body-parser")
const descriptionRoutes = require('./routes/description.route')
const gameRoutes = require('./routes/game.route')
const frontRoutes = require('./routes/frontoffice.route')
const backRoutes = require('./routes/backoffice.route')
const history = require('connect-history-api-fallback')
const app = express()
const port = 8000
app.use(history({
	htmlAcceptHeaders: ['text/html'],
	rewrites: [
		{
			from: /\/FrontOffice/, to: '/FrontOffice/'
		},
		{
			from: /\/BackOffice/, to: '/BackOffice/'
		}
	]
}));

app.use(bodyParser.json({
  extended: true,
  limit: '50mb'
}))
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb',
  parameterLimit: 50000
}));
app.use(bodyParser.text({limit: '200mb'}));
app.use(cors());
app.use('/description', descriptionRoutes);
app.use('/game', gameRoutes);
app.use('/frontoffice', frontRoutes);
app.use('/backend', backRoutes);
app.use(express.static('/webapp/Game/dist'));
app.use(express.static('/webapp/FrontOffice/dist'));
app.use(express.static('/webapp/BackEnd'));
mongoose.Promise = global.Promise
mongoose.connect(database.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("database connected")
},
error => {
  console.log("Db couldn't connect because of: " + error)
});

app.get('/', (req, res) => {
  res.sendFile('/webapp/Game/dist/index.html');
});

app.get('/FrontOffice/', (req,res) => {
	res.sendFile('/webapp/FrontOffice/dist/index.html');
});

app.get(/\/FrontOffice\/scripts|views\/.*\.[html|js]/, (req,res) => {
	let filePath = req.url.replace('/FrontOffice','/webapp/FrontOffice/app');
	if(filePath.charAt(filePath.length-1) === '/') filePath = filePath.slice(0,-1);
	res.sendFile(filePath);
});

app.get('/BackOffice', (req,res) => {
	res.sendFile('/webapp/BackEnd/index.html');
});

app.get(/\/BackOffice\/.*\.[html|js|css|map]/, (req,res) => {
	let filePath =  req.url.replace('/BackOffice', '/webapp/BackEnd');
	res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});

