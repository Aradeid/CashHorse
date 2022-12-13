module.exports = function(app){

    app.post('/races', (req, res) => {
        //TODO verify authentication
        
    });

    app.get('/races', (req, res) => {
        // races = db.getRaces()
        res.render('pages/races', {races: races})
    });

    app.get('/races/:id', function(req, res) {
        var id = req.params.id;
        var race //= db.getRace(id)
        res.render('pages/race', {race: race});
      });

}