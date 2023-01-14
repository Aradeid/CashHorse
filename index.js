const express = require('express');
const session = require('express-session');
const bcrypt = require("bcrypt")
const app = express();
const port = 3000;

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
require('./controllers/horses')(app);
require('./controllers/races')(app);
require('./controllers/bets')(app);
require('./controllers/users')(app);

db.defaults({ horses: [], users: [], bets: [], races: [], indexes: [] })
    .write()

db.getIndexFor = (name) => {
    var entry = db.get('indexes').find({"table": name}).value();
    if (!entry) {
        db.get('indexes').push({"table": name, "index": 0}).write();
        return 0;
    }
    db.get('indexes').find({"table": name}).assign({"index": entry.index+1}).value();
    return entry.index;
}

app.storage = db;

app.hasher = bcrypt;

// index page
app.get('/', function(req, res) {
    res.render('pages/index', {loggedin: req.session.loggedin});
});
  
  // about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.post('/users', (req, res) => {
    //show own bets by default and all bets with admin rights
});

app.listen(port, () => console.log(`App listening on port ${port}!`))