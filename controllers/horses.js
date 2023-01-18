module.exports = function(app){

    app.post('/api/horses', (req, res) => {
        var user = app.storage.get("users").find({"id": res.locals.userid}).value();
        if (user.role != "admin") {
            res.sendStatus(403);
            return;
        }
        let horse = {};
        horse.name = req.body.horseName;
        horse.power = req.body.horsePower;
        horse.image = req.body.horseImage;
        horse.breed = req.body.horseBreed;

        if (!horse.name || !horse.power || !horse.breed) {
            res.sendStatus(403);
            return;
        }
        horse.id = app.storage.getIndexFor("horses");
        app.storage.get('horses').push(horse).write();
    
        console.log('New horse added successfully', horse);
        res.redirect('/horses');
    });
    
    app.get('/horses', (req, res) => {
        var allowAddingHorses = false;
        if (req.session.loggedin) {
            allowAddingHorses = true;
        }
        horses = app.storage.get("horses").value();
        var user = app.storage.get("users").find({"id": res.locals.userid}).value();
        isAdmin = user && user.role == "admin";
        res.render('pages/horses', {isAdmin: isAdmin})
    });

    app.get('/horses/:id', function(req, res) {
        var id = parseInt(req.params.id);
        var user = app.storage.get("users").find({"id": res.locals.userid}).value();
        isAdmin = user && user.role == "admin";
        res.render('pages/horse', {isAdmin: isAdmin, id: id});
      });
    
    app.get('/api/horses', (req, res) => {
        horses = app.storage.get("horses").value();
        res.end(JSON.stringify(horses));
    });

    app.get('/api/horses/:id', function(req, res) {
        var id = parseInt(req.params.id);
        var horse = app.storage.get("horses").find({"id": id}).value();
        if (!horse) {
            res.sendStatus(404);
            return;
        }
        res.send(horse);
      });

    app.delete('/api/horses/:id', function(req, res){
        var user = app.storage.get("users").find({"id": res.locals.userid}).value();
        if (user.role != "admin") {
            res.sendStatus(403);
            return;
        }
        var id = req.params.id;
        app.storage.get('horses').remove((h) => h.id == id).write();
        res.redirect('/horses');
    });
}