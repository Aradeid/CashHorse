module.exports = function(app) {

    app.post('/races', (req, res) => {
        var user = app.storage.get("users").find({"id": res.locals.userid}).value();
        if (user && user.role != "admin") {
            res.sendStatus(403);
            return;
        }
        let race = {};
        race.time = req.body.raceTime;
        race.description = req.body.raceDescription;
        race.status = "pending"
        race.horses = [];
        race.mods = [];
        race.wins = [];
        rates = []
        hTotal = 0;
        
        for (key in req.body) {
            if (key.includes("raceHorse")) {
                hKey = parseInt(key.slice(9));
                race.horses.push(hKey);
                race.mods.push(Math.floor(Math.random() * 60 - 20) /100)
                horse = app.storage.get("horses").find({"id": hKey}).value();
                rates[hKey] = parseInt(horse.power);
                hTotal += parseInt(horse.power);
            }
        }

        for (h in race.horses) {
            race.wins.push(Math.floor(hTotal/rates[h]*100)/100);
        }

        race.id = app.storage.getIndexFor("races");;
        app.storage.get('races').push(race).write();
    
        console.log('New race added successfully', race);
        res.redirect('/races/'+race.id);
    });

    app.get('/races', (req, res) => {
        var user = app.storage.get("users").find({"id": res.locals.userid}).value();
        isAdmin = user && user.role == "admin";
        res.render('pages/races', {isAdmin: isAdmin})
    });

    app.get('/races/:id', (req, res) => {
        var id = parseInt(req.params.id);
        var race = app.storage.get("races").find({"id": id}).value();
        if (!race) {
            res.sendStatus(404);
            return;
        }
        var user = app.storage.get("users").find({"id": res.locals.userid}).value();
        isAdmin = user && user.role == "admin";
        res.render('pages/race', {id: id, isAdmin: isAdmin, racePending: race.status == "pending"});
    });

    app.get('/api/races/', function(req, res) {
        races = app.storage.get("races").value();
        res.send(races);
      });

    app.get('/api/races/:id', function(req, res) {
        var id = parseInt(req.params.id);
        var race = app.storage.get("races").find({"id": id}).value();
        if (!race) {
            res.sendStatus(404);
            return;
        }
        horses = app.storage.get("horses").filter((horse) => race.horses.includes(horse.id)).value();
        res.send({race: race, horses:horses });
      });

    app.get('/api/races/:id/execute', function(req, res) {
        var user = app.storage.get("users").find({"id": res.locals.userid}).value();
        if (user && user.role != "admin") {
            res.sendStatus(403);
            return;
        }
        var id = parseInt(req.params.id);
        var race = app.storage.get("races").find({"id": id}).value();
        if (!race) {
            res.sendStatus(404);
            return;
        }
        race = app.storage.get('races').find({"id": id}).assign({"status": "finished"}).write();
        raceHorses = [];
        for (let idx of  race.horses) {
            horse = app.storage.get('horses').find({"id": race.horses[idx]}).value();
            pow = (race.mods ? race.mods[idx] : 1)*parseInt(horse.power);
            raceHorses.push([horse.id, pow, 2000]);
        }

        rank = 1;
        offset = 0;
        finishReached = false;
        while (finishReached)
            for (let ds of raceHorses) {
                ds[2] -= (Math.floor(Math.random() * 30 - 15) /100 * ds[1]) //a random power sway up to 15% in any direction every tick
                
                if (ds[2] <= 0) {
                    if (offset > ds[2]) {
                        finishReached = true;
                        offset = ds[2]
                    }

                } 
            }

        //boring and inefficient sorting function
        for (let ds of raceHorses) {
            //adjust offset
            ds[2] += offset
        }

        sortedHorses = Array.from(raceHorses);
        sortedHorses.sort((a,b) => a[2] - b[2]);
        for (h of raceHorses) {
            h[3] = sortedHorses.indexOf(h) + 1;
        }
        ranks = []
        scores = []
        bets = app.storage.get('bets').find({"race": id}).assign({"status": "lost"}).write();
        for (h of raceHorses) {
            ranks.push(h[3]);
            scores.push([h[2]]);
            if (h[3] == 1) {
                bets = app.storage.get('bets').find({"race": id, "horse": h[0]}).assign({"status": "won"}).write();
                if (bets && !Array.isArray(bets)) {
                    bets = [bets];
                }
                for (let bet of bets) {
                    //pay out the winners
                    user = app.storage.get('users').find({"id": bet.user}).value();
                    app.storage.get('users').find({"id": bet.user}).assign({"balance": user.balance + bet.won}).write();
                }
            } else {
                app.storage.get('bets').find({"race": id, "horse": h[0]}).assign({"status": "lost"}).wrte();
            }
        }
        race = app.storage.get('races').find({"id": id}).assign({"scores": scores, "ranks": ranks}).write();
        res.send(race);
    });

    app.get('/api/races/:id/cancel', function(req, res) {
        console.log(res.locals.userid);
        var user = app.storage.get("users").find({"id": res.locals.userid}).value();
        console.log(user);
        if (user && user.role != "admin") {
            res.sendStatus(403);
            return;
        }
        console.log("user checked");
        var id = parseInt(req.params.id);
        var race = app.storage.get("races").find({"id": id}).value();
        if (!race) {
            res.sendStatus(404);
            return;
        }
        ra = app.storage.get('races').find({"id": id}).assign({"status": "cancelled"}).write();
        bets = app.storage.get('bets').find({"race": id}).assign({"status": "cancelled"}).write();
        if (bets && !Array.isArray(bets)) {
            bets = [bets];
        }
        for (let bet of bets) {
            //refund all participants
            user = app.storage.get('users').find({"id": bet.user}).value();
            app.storage.get('users').find({"id": bet.user}).assign({"balance": user.balance + bet.value}).write();
        }
        res.send(race);
    });

}