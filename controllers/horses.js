module.exports = function(app){

    app.post('/horses', (req, res) => {
        let horse = {};
        horse.name = req.body.horseName;
        horse.power = req.body.horsePower;
        horse.image = req.body.horseImage;
        horse.breed = req.body.horseBreed;

        if (!horse.name || !horse.power || !horse.breed) {
            //TODO throw error
        }
        console.log(app.storage.get('horses').value()[-1]);
        var len = app.storage.get('horses').value().length;
        if (len == 0) {
            horse.id = 0;
        } else {
            horse.id = app.storage.get('horses').value()[len-1].id + 1;
        }
        app.storage.get('horses').push(horse).write();
    
        console.log('New horse added successfully', horse);
        res.redirect(200, '/horses');
    });
    
    app.get('/horses', (req, res) => {
        horses = app.storage.get("horses").value();
        res.render('pages/horses', {horses: horses})
    });

    app.get('/horses/:id', function(req, res) {
        var id = req.params.id;
        var horse;
        app.storage.get('horses').value().forEach(h => {
            if (h.id == id) {
                horse = h;
                return;
            }
        });
        if (horse == undefined) {
            res.sendStatus(404);
            return;
        }
        res.render('pages/horse', {horse: horse});
      });
    app.delete('/horses/:id', function(req, res){
        var id = req.params.id;
        app.storage.get('horses').remove((h) => h.id == id).write();
        res.redirect(200, '/horses');
    })
}