module.exports = function(app){
    app.post('/authenticate', function(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        if (username && password) {
            var hash = app.hasher.hash(password, 4).then(hash => {
                // console.log('Hash ', hash);
                return hash;
            }).catch(err => console.error(err.message));
            var user = app.storage.get("users").find({"username": username, "password": hash}).value();
            if (user) {
                req.session.loggedin = true;
				req.session.username = username;
                res.redirect('/horses');
			} else {
				res.send('Incorrect Username and/or Password!');
			}
        } else {
            res.send('Please enter Username and Password!');
            res.end();
        }
    });

    app.post('/register', function(req, res) {
        let user = [];
        let username = req.body.username;
        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;
        if (password != confirmPassword) {
            res.send("Password and Confirm password don't match"); //make it client side
            return;
        }
        var hash = app.hasher.hash(password, 4).then(hash => {
            // console.log('Hash ', hash);
            return hash;
        }).catch(err => console.error(err.message));
        
        var checkUser = app.storage.get("users").find({"username": username}).value();
        if (checkUser) {
            res.send('Username taken!');
            return
        }

        user.username = username;
        user.password = hash;
        user.role = "user";
        user.balance = 1000;
        user.index = app.storage.getIndexFor("users");
        app.storage.get('users').push(user).write();
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/');
    });
}

function validateUser(hasher, hash) {
    hasher
      .compare(password, hash)
      .then(res => {
        console.log(res)
      })
      .catch(err => console.error(err.message))        
}