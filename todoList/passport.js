const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/user')

module.exports = function(passport){
    passport.use(new LocalStrategy((username, password, done) => {
        //Match username
        let query = {username:username}
        User.findOne(query, (err, user) => {
            if(err) throw err;
            if(!user){
                console.log('No user with that username')
            }
            bcrypt.compare(password, user.password, (err, isMatch) =>{
                if(err) throw err;
                if(isMatch){
                    return done(null, user)
                }else{
                    return done(null, false)
                }
            })
            //console.log(user.password)
        })
    }));

    passport.serializeUser((user,done) => {
        done(null, user.id)
    });

    passport.deserializeUser((id,done) => {
        User.findById(id, (err, user) => {
            done(err,user)
        })
    })
}