module.exports = function(app){

    app.post('/horses', (req, res) => {
        let horse = {};
        console.log(req.body);
        horse.name = req.body.horseName;
        horse.power = req.body.horsePower;
        horse.image = req.body.horseImage;
        horse.breed = req.body.horseBreed;
        //TODO drop error if empty or faulty
        console.log("test1");
        app.storage.horses.push(horse);
        console.log("New horse added", horse);
    
        // res.send('New horse added successfully');
        res.redirect(200, '/horses');
    });
    
    app.get('/horses', (req, res) => {
        horses = app.storage.horses;
        res.render('pages/horses', {horses: horses})
    });

    app.get('/horses/:id', function(req, res) {
        var id = req.params.id;
        var horse //= db.getHorse(id)
        res.render('pages/horse', {horse: horse});
      });

}