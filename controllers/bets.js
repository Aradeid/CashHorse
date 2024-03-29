module.exports = function(app){

    app.get('/bets', (req, res) => {
        bets = app.storage.get("bets").value();
        res.render('pages/bets', {bets: bets});
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
        if (!res.locals.userid) {
            res.sendStatus(403);
            return;
        }
        bets = app.storage.get("bets").find({"user": res.locals.userid});
        console.log(bets);
        res.end(JSON.stringify(bets));
    });

    app.get('/api/bets/forRace/:id', (req, res) => {
        if (!res.locals.userid) {
            res.sendStatus(403);
            return;
        }
        bet = app.storage.get("bets").find({"user": res.locals.userid, "race": parseInt(req.params.id)}).value();
        if (!bet) {
            bet = {};
        }
        res.end(JSON.stringify(bet));
    });

    app.post('/api/bets', (req, res) => {
        if (!res.locals.userid || req.body.betValue <= 0) {
            res.sendStatus(403);
            return;
        }
        //check balance can afford
        if (!app.storage.get('horses').find({"id": parseInt(req.body.horseId)}).value()) {
            res.sendStatus(400);
            return;
        }
        race = app.storage.get('races').find({"id": parseInt(req.body.raceId)}).value();
        if (!race || race.status != "pending") {
            res.sendStatus(400);
            return;
        }
        oldBet = app.storage.get('bets').find({"user": res.locals.userid, "race": parseInt(req.body.raceId)}).value();
        if (oldBet) {
            res.sendStatus(400);
            return;
        }
        horseIncluded = false;
        horseTotal = 0;
        horseIndividual = 0;
        for (let h of race.horses) {
            horse = app.storage.get('horses').find({"id": h}).value()
            horseTotal += parseInt(horse.power);
            if (horse.id == parseInt(req.body.horseId)) {
                horseIncluded = true;
                horseIndividual = horse.power;
            }
        }
        if (!horseIncluded) {//the given horse isn't in the race
            res.sendStatus(400);
            return;
        }
        
        bet = {};
        bet.user = res.locals.userid;
        bet.race = parseInt(req.body.raceId);
        bet.horse = parseInt(req.body.horseId);
        bet.value = parseInt(req.body.betValue);
        ratio = horseTotal / horseIndividual;
        bet.win = Math.floor(bet.value * ratio);
        bet.status = "pending";
        app.storage.get('bets').push(bet).write();
        app.storage.get('users').find({"id": res.locals.userid}).assign({"balance": res.locals.userbalance - bet.value}).write();
        req.session.userbalance = res.locals.userbalance - bet.value;
        req.sess
        // res.send(bet);
        res.redirect('/races/'+req.body.raceId);
    });
}