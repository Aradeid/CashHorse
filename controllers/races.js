module.exports = function(app) {

    app.post('/races', (req, res) => {
        if (!res.locals.userid) {
            res.sendStatus(403);
            return;
        }
        var user = app.storage.get("users").find({"id": res.locals.userid}).value();
        if (user.role != "admin") {
            res.sendStatus(403);
            return;
        }
        let race = {};
        race.time = req.body.raceTime;
        race.description = req.body.raceDescription;
        race.status = "pending"
        race.horses = [];
        race.mods = [];
        
        for (key in req.body) {
            if (key.includes("raceHorse")) {
                race.horses.push(parseInt(key.slice(9)));
                race.mods.push(Math.floor(Math.random() * 60 - 20) /100)
            }
        }

        race.id = app.storage.getIndexFor("races");;
        app.storage.get('races').push(race).write();
    
        console.log('New race added successfully', race);
        res.redirect('/races');
    });

    app.get('/races', (req, res) => {
        var user = app.storage.get("users").find({"id": res.locals.userid}).value();
        isAdmin = user && user.role == "admin";
        res.render('pages/races', {isAdmin: isAdmin})
    });

    app.get('/api/races/:id', function(req, res) {
        var id = parseInt(req.params.id);
        var race = app.storage.get("races").find({"id": id}).value();
        if (!race) {
            res.sendStatus(404);
            return;
        }
        race.horses = app.storage.get("horses").filter((horse) => race.horses.includes(horse.id)).value();
        res.send(race);
      });

}