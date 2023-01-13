module.exports = function(app){

    app.post('/bets', (req, res) => {
        //TODO verify authentication, verify affordability
        // We will be coding here
    });

    app.get('/bets', (req, res) => {
        bets = db.getBets();
        res.render('pages/bets', {bets: bets});
    });

    app.get('/bets/:id', function(req, res) {
        var id = req.params.id;
        var bet //= db.getBet(id)
        res.render('pages/bet', {bet: bet});
      });

    app.get('/api/bets/:id', function(req, res) {
        var id = parseInt(req.params.id);
        var bet = app.storage.get("bets").find({"id": id}).value();
        if (!bet) {
            res.sendStatus(404);
            return;
        }
        //return bet;
        res.end(JSON.stringify(bet));
        //res.json(bet)
    });

    app.get('/api/bets', (req, res) => {
        bets = db.getBets();
        res.end(JSON.stringify(bets));
    });
    //other routes..
}