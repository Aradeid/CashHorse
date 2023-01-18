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
        bets = app.storage.get("bets").find({"user": res.locals.userid, "race": parseInt(req.params.id)});
        res.end(JSON.stringify(bets));
    });

    app.post('/api/bets', (req, res) => {
        if (!res.locals.userid || req.body.betValue <= 0) {
            res.sendStatus(403);
            return;
        }
        //check balance can afford
        if (!app.storage.get('horses').find({"id": parseInt(req.body.horse)}).value()) {
            res.sendStatus(400);
            return;
        }
        race = app.storage.get('races').find({"id": parseInt(req.body.race)}).value();
        if (!race || race.status != "pending") {
            res.sendStatus(400);
            return;
        }
        horseIncluded = false;
        horseTotal = 0;
        horseIndividual = 0;
        for (let h in race.horses) {
            horse = app.storage.get('horses').find({"id": h.id}).value()
            horseTotal = parseInt(horse.power);
            if (horse.id == parseInt(req.body.horse)) {
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
        bet.race = req.body.race;
        bet.horse = req.body.horse;
        bet.value = req.body.value;
        ratio = horseTotal / horseIndividual;
        bet.win = Math.floor(bet.value * ratio);
        bet.status = "pending";
        app.storage.get('bets').push(bet).write();
        app.storage.get('users').find({"id": bet.user}).assign({"balance": res.locals.userbalance - bet.value}).value();
        res.locals.userbalance -= bet.value;
        res.send(bet);
    });
}