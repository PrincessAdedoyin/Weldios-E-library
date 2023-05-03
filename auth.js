const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./models/user');

// Render register page
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle register form submission
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        });
        await user.save();
        req.session.userId = user._id;
        res.redirect('/book');
    } catch (err) {
        console.log(err);
        res.redirect('/auth/register');
    }
});

// Render login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login form submission
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.userId = user._id;
            res.redirect('/book');
        } else {
            res.redirect('/auth/login');
        }
    } catch (err) {
        console.log(err);
        res.redirect('/auth/login');
    }
});

// Handle logout
router.get('/logout');
