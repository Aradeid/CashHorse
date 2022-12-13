const express = require('express');
const app = express();
const port = 3000;

//TODO get data from DB
let horses = []
let bets = []


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
require('./controllers/horses')(app);

app.storage = [];
app.storage.horses = [];

// index page
app.get('/', function(req, res) {
    console.log(app);
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