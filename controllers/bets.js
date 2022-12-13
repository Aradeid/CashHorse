module.exports = function(app){

    app.post('/bets', (req, res) => {
        //TODO verify authentication
        // We will be coding here
    });

    app.get('/bets', (req, res) => {
        // horses = db.getBets()
        res.render('pages/bets', {bets: bets})
    });

    app.get('/bets/:id', function(req, res) {
        var id = req.params.id;
        var bet //= db.getBet(id)
        res.render('pages/bet', {bet: bet});
      });

    //other routes..
}