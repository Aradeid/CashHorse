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

//assigns user role if logged in
function checkLoggedIn(req, res, next) {
	res.locals.loggedin = req.session.loggedin;
	if (req.session.loggedin) {
		res.locals.username = req.session.username;
        res.locals.userid = req.session.userid;
	}
    next()//route or no params?
}

app.all('*', checkLoggedIn);//apply to all pages

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

require('./controllers/horses')(app);
require('./controllers/races')(app);
require('./controllers/bets')(app);
require('./controllers/users')(app);

app.listen(port, () => console.log(`App listening on port ${port}!`))