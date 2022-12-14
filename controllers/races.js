module.exports = function(app){

    app.post('/races', (req, res) => {
        //TODO verify authentication
        let race = {};
        race.time = req.body.raceTime;
        race.description = req.body.raceDescription;
        race.horses = []
        
        for (key in req.body) {
            if (key.includes("raceHorse")) {
                race.horses.push(parseInt(key.slice(9)));
            }
        }

        var len = app.storage.get('races').value().length;
        if (len == 0) {
            race.id = 0;
        } else {
            race.id = app.storage.get('races').value()[len-1].id + 1;
        }
        console.log(race);
        console.log(req.body);
        app.storage.get('races').push(race).write();
    
        console.log('New race added successfully', race);
        res.redirect(200, '/races');
    });

    app.get('/races', (req, res) => {
        var races = app.storage.get("races").value();
        var horses = app.storage.get("horses").value();
        res.render('pages/races', {races: races, horses: horses})
    });

    app.get('/races/:id', function(req, res) {
        var id = parseInt(req.params.id);
        var race = app.storage.get("races").find({"id": id}).value();
        if (!race) {
            res.sendStatus(404);
            return;
        }
        let horses = app.storage.get("horses").filter((horse) => race.horses.includes(horse.id)).value();
        res.render('pages/race', {race: race, horses: horses});
      });

}