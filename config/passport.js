var GoogleStrategy = require('passport-google-oauth20').Strategy;
var passport = require('passport');
require('dotenv').config();

var User = require('../app/models/user');

module.exports = function(passport) {
    
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    passport.use(new GoogleStrategy({
        clientID:     process.env.GOOG_ID,
        clientSecret: process.env.GOOG_SECRET,
        callbackURL:  process.env.GOOG_CALLBACK
    },
    function(token, tokenSecret, profile, done) {

        // make the code asynchronous
        process.nextTick(function() {

            User.findOne({ 'google.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err){
                    return done(err);
                }
                // if the user is found then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user, create them
                    var newUser                 = new User();
                    // Google stuff
                    newUser.google.id          = profile.id;
                    newUser.google.token       = token;
                    newUser.google.user    = profile.displayName;
                    
                    //initializing profile data
                    newUser.credits = 2;
                    newUser.documentsReviewed = 0;
                    
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });

        });
    }));
}