const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const bcrypt = require('bcryptjs')

//Check database connection
mongoose.connect('mongodb://localhost/todolist');

let db = mongoose.connection;

db.once('open', () => console.log('Connected to mongodb'));
db.on('error', (err) => console.log(err))

//Init express
const app = express()

//Load models
const Todo = require('./models/todo');
const User = require('./models/user');
//Load template engine
app.set('view engine', 'pug');  

//load public folder
app.use(express.static(path.join(__dirname,'public')));

//Body parser middleware
app.use(express.urlencoded({ extended: false }));

//Method Override middleware
app.use(methodOverride('_method'))

//Session middleware
app.use(session({
	secret: '$8E8T7AInE59FoJ5D$OG$@Amjt3odll',
	resave: false,
	saveUninitialized: false
}))

//Passport config
require('./passport')(passport)
//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Home route
app.get('/', checkAuthenticated, (req,res) => {
    Todo.find({}, (err, todos) => {
        if(err){
            console.log(err);
        }else{
            res.render('index', {
                todos:todos
            });
        }
    });
});
/*
app.get('/todo/:_id', (req,res) => {
    Todo.findById()
})*/

app.post('/add', checkAuthenticated, (req,res) => {
    let newTodo = new Todo();
    newTodo.title = req.body.title;
    //let time = new Date()
    newTodo.time = req.body.time
    newTodo.done = 'Not done';

    newTodo.save((err) => {
        if(err){
            console.log(err)
        }else{
            res.redirect('/')
        }
    })
})

//Remove taks
app.post('/todo/:id', checkAuthenticated, (req,res) => {

    let query = {_id:req.params.id}

    Todo.findByIdAndDelete(req.params.id, (err, todo) => {
        if(err){
            console.log(err);
        }
        res.redirect('/')
    })
});

app.get('/register', (req,res) => {
    res.render('register')
})

app.post('/register', (req,res) => {
    let newUser = new User();
    newUser.fname = req.body.fname;
    newUser.email = req.body.email;
    newUser.username = req.body.username;
    newUser.password = req.body.password

    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(newUser.password, salt, (err,hash) => {
            if(err){
                console.log(err)
            }
            newUser.password = hash
            newUser.save(err => {
                if(err){
                    console.log(err)
                }else{
                    res.redirect('/login')
                }
            });
        })
    })
});

app.get('/login', (req,res) => {
    res.render('login');
});

app.post('/login',(req,res,next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,next);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        next()
    }else{
        res.redirect('/login')
    }
}

//Start server
app.listen(3000)