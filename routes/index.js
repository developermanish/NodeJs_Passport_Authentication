const express = require('express');
const router =express.Router();
const { ensureAuthenticated } = require('../config/auth');


router.get('/', (req,res)=>{
    res.render("welcome");//In renders "" we write the name of the file which we have to render at the route "/" or any other route
});
//Dashboard
router.get('/dashboard', ensureAuthenticated, (req,res)=>{
    res.render("dashboard",{
        name: req.user.name
    });//In renders "" we write the name of the file which we have to render at the route "/" or any other route
});

module.exports=router;
