const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const db = require('../models/db');

router.get('/', (req, res) => {
    res.render('register');
});

router.post('/', (req, res) => {
    const { username, password } = req.body;
  
  
    db.get('SELECT * FROM users WHERE username = ?', [username], function(err, user) {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
  
      if (user) {
        console.log('Username already exists');
        return res.status(400).send('Username already exists');
      }
  
      // If username does not exist, hash the password and create the user
      bcrypt.hash(password, saltRounds, function(err, hash) {
        console.log('Hashed password:', hash);
        if (err) {
          console.log(err);
          return res.status(500).send();
        }
  
        db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hash], function(err) {
          if (err) {
            return console.log(err.message);
          }
          console.log(`A row has been inserted with rowid ${this.lastID}`);
          res.redirect('/login');
        });
      });
    });
  });


module.exports = router;