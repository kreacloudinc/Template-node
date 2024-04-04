require('dotenv').config({ path: '../.env' });
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const app = express();
const bcrypt = require('bcrypt');


const db = require('./models/db');



db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT
)`, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Users table created.');
});




app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
  }));


app.use(passport.initialize());
app.use(passport.session());




passport.use(new LocalStrategy(
  function(username, password, done) {

    db.get('SELECT * FROM users WHERE username = ?', [username], function(err, user) {
      if (err) {
        console.log('Error');
        return done(err);

      }

      if (!user) {
        console.log('User not found');
        return done(null, false, { message: 'Incorrect username.' });
      }
 
      bcrypt.compare(password, user.password, function(err, res) {
        console.log('Password comparison result:', res); 
        console.log(password, user.password);
        if (res !== true) {
          console.log('Incorrect password');
          return done(null, false, { message: 'Incorrect password.' });
        }
      
        console.log('User found and password correct');
        return done(null, user);
      });
    });
  }
));


  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    db.get('SELECT * FROM users WHERE id = ?', [id], function(err, user) {
      if (err) {
        return done(err);
      }
      done(null, user);
    });
  });

  

app.set('view engine', 'ejs');

app.get('/', ensureAuthenticated, (req, res) => {
  res.render('index');
});
const registerRoutes = require('./routes/register');
app.use('/register', registerRoutes);

const loginRoutes = require('./routes/login');
app.use('/login', loginRoutes);


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}




const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));


