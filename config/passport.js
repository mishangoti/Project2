const LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');


module.exports = function(passport){
    passport.use(
        new LocalStrategy({email: 'email'}, (email, password, done) => {
            // match user
            
        })
    );
}
