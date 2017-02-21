// this acts like the Web api where functions that gets the data are being mapped
var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var users = require('../controllers/users_controller.js');
var clients = require('../controllers/clients_controller.js');


/* employee logic layer */

router.get('/', function(req, res, next) {

  if (req.session.user) {

  	res.render('index', {username: req.session.username, msg: req.session.msg});

  } else {

  	req.session.msg = 'Access denied!';

  	res.redirect('/login');

  }

});


router.get('/user', function(req, res, next) {
  
  if (req.session.user) { // the "user" is found on the controller

  	res.render('user', {msg: req.session.msg});

  } else {

  	req.session.msg = 'Access denied!';

  	res.redirect('/login');

  }

});


router.get('/reports', function(req, res, next) {
  
  if (req.session.user) {

    res.render('progressReport');

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');

  }

});



router.get('/signup', function(req, res, next) {


  res.render('signup');



});


router.get('/login', function(req, res, next) {
  
  if (req.session.user) {

  	res.redirect('/');

  }

  res.render('login', {msg: req.session.msg});

});


router.get('/logout', users.logoutUser, function(req, res, next) {
  
  console.log("out");
  // router.post('/logout', users.logoutUser);
  req.session.destroy(function(){
  		res.redirect('/login');
  });
  
});




// admin logic layer

router.get('/adminPage', function(req, res) {


  if (req.session.username == "admin") {


    res.render('adminpage'); // ejs file

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');

  }


});

router.get('/admin/view/client', function(req, res) {


  if (req.session.username == "admin") {


    res.render('clientsProfile'); // ejs file

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');

  }


});


router.get('/admin/add/client', function(req, res) {


  if (req.session.username == "admin") {


    res.render('adminAddClient'); // ejs file

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');

  }


});

router.get('/view/clientsProfile', function(req, res, next) {

  if (req.session.username == "admin") {


    res.render('clientsProfile'); // ejs file
    console.log("I got the request");

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');

  }

});


router.post('/signup', users.signup);
router.post('/user/update', users.updateUser);
router.post('/user/delete', users.deleteUser);
router.post('/login', users.login);
// router.post('/logout', users.logoutUser);

router.get('/user/profile', users.getUserProfile); // json source

// router.post('/client/profile', clients.getClientProfile); //
router.post('/view/clientsProfile', clients.GetClientProfile); // working
router.post('/client/update', clients.UpdateClient); // working

router.get('/client/source', clients.ListAllClient); // json source select all 
router.post('/admin/add/client', clients.AddClient);

router.post('/employee/client/AddProgressReport', clients.AddProgressReport);
router.post('/employee/client/ViewProgressReport', clients.ViewProgressReport);
router.post('/employee/client/ViewProgressReportSpecific', clients.ViewProgressReportSpecific);

router.post('/employee/view/timeLogs', users.ViewTimeLogs);
router.post('/employee/view/empInfo', users.SearchEmpInfo);
router.post('/checkUserName', users.checkUserName);

module.exports = router;