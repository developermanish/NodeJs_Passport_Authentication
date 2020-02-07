const express = require('express');
const router =express.Router();
const bcrypt =require('bcryptjs');
const passport = require('passport');

//User model
const User = require('../models/User');

//Login Page
router.get('/login', (req,res)=>{
    res.render("login");
});

//Register Page
router.get('/register', (req,res)=>{
    res.render("register");
});

//Register Handle
router.post('/register',(req,res)=>{
    console.log(req.body);
    const {name, email, password, password2} = req.body;
    let errors =[];

    //Check required fields
    if(!name || !email || !password || !password2)
    {
        errors.push({msg:'Please fill in all fields'});
    }
    //check password match
    if(password!==password2)
    {
        errors.push({msg: 'Password do not match'});
    }
    //check password length

    if(password.length < 6)
    {
        errors.push({msg: 'Password should be at least 6 characters'});
    }
    if(errors.length > 0)
    {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
        
        User.findOne({email:email})
        .then(user=>{
            if(user)
            {
                console.log('I am at user already exist');
                //user exists
                errors.push({msg: "Email is already registered"});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            else{
                //Add the user
                
                const newUser = new User({
                    name,
                    email,
                    password
                });
                
                //Hash Password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err ;

                    // set passwrod to hash 
                    newUser.password=hash;
                    //save user

                    newUser.save()
                    .then(user=> {
                        req.flash('success_msg', 'You are now registered and can log in');
                        res.redirect('/users/login');
                    })
                    .catch(err=>console.log(err));
                }))
                newUser.save();
            }
        });

    }

})

//Login Handle
router.post('/login', (req,res,next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

//Logout Handle
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
})

module.exports = router;