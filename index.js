const express = require('express');
const app = express();
const port = 3000;

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))

app.set('view engine', 'ejs');
require('./controllers/horses')(app);
require('./controllers/races')(app);

db.defaults({ horses: [], users: [], bets: [], races: [] })
  .write()

app.storage = db;

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});
  
  // about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.post('/users', (req, res) => {
    //show own bets by default and all bets with admin rights
});

app.listen(port, () => console.log(`App listening on port ${port}!`))