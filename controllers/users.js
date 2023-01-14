module.exports = function(app){
    app.post('/api/users/login', function(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        if (username && password) {
            var user = app.storage.get("users").find({"username": username}).value();
            if (!user) {
                res.send('Incorrect Username and/or Password!');
                res.end();
                return;
            }
            app.hasher.compare(password, user.password).then(out => {
                if (out) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.redirect('/horses');
                    return;
                }
                res.send('Incorrect Username and/or Password!');
                res.end();
            }).catch(err => console.error(err.message));
        } else {
            res.send('Please enter Username and Password!');
            res.end();
        }
    });

    app.post('/api/users/register', function(req, res) {
        let user = {};
        let username = req.body.username;
        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;
        if (password != confirmPassword) {
            res.send("Password and Confirm password don't match"); //make it client side
            return;
        }
        app.hasher.hash(password, 10).then(hash => {
            var checkUser = app.storage.get("users").find({"username": username}).value();
            if (checkUser) {
                res.send('Username taken!');
                return
            }
            console.log(password);
            console.log(hash);
            user.username = username;
            user.password = hash;
            user.role = "user";
            user.balance = 1000;
            user.index = app.storage.getIndexFor("users");
            app.storage.get('users').push(user).write();
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/');
            return;
        }).catch(err => console.error(err.message));
    });

    //recommended to be delete, but i had issues with frontend
    app.get('/api/users/logout', (req, res) => {
        if (req.session) {
            req.session.destroy(err => {
                if (err) {
                    res.status(400).send('Unable to log out');
                } else {
                    // res.send('Logout successful');
                    res.redirect('/');
                }
            });
        } else {
            res.end();
        }
    });
}