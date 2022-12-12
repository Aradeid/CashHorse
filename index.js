const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

//TODO get data from DB
let horses = []
let bets = []

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});
  
  // about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.post('/bets', (req, res) => {
    //show own bets by default and all bets with admin rights
});

app.post('/horses', (req, res) => {
    //TODO verify authentication
    // We will be coding here
});

app.listen(port, () => console.log(`App listening on port ${port}!`))