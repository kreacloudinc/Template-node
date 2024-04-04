const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const db = require('../models/db');

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login' }));


module.exports = router;