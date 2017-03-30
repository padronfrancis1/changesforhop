// this acts like the Web api where functions that gets the data are being mapped
var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var users = require('../controllers/users_controller.js');
var clients = require('../controllers/clients_controller.js');
var assert = require('assert');
var fs = require('fs');
var mongodb = require('mongodb');


/* employee logic layer */

var multer  = require('multer');
var uri = 'mongodb://admin:admin@ds145329.mlab.com:45329/changesforhope'
// var uri = 'mongodb://localhost:27017/changesforhope';
var assert = require('assert');
var fs = require('fs');
var mongodb = require('mongodb');

// var storage = require('multer-gridfs-storage')({
//    // url: 'mongodb://admin:admin@ds145329.mlab.com:45329/changesforhope'
//    url: 'mongodb://localhost/changesforhope'
// });






var path = require('path');

var storage = require('multer-gridfs-storage')({
  url: 'mongodb://admin:admin@ds145329.mlab.com:45329/changesforhope',
  // url: 'mongodb://localhost/changesforhope',

  // root: 'myfiles',
   filename: function(req, file, cb) {

       crypto.randomBytes(16, function (err, raw) {

           var orgnlFilename = file.originalname;
           var trimmed_orgnlFilename = orgnlFilename.slice(0, -5);
           console.log(trimmed_orgnlFilename);

           cb(err, err ? undefined : trimmed_orgnlFilename);

       });
   },
   metadata: function(req, file, cb) {
      var originalname = file.originalname;

      var trimFileType = originalname.slice(-5);
      
      cb(null, { permission: trimFileType });
   },
   root: 'storage'
});

var upload = multer({ storage: storage });
var sUpload = upload.single('file');

router.post('/multer', sUpload, function (req, res, next) { 
    res.redirect('/');
});




// router.post('/mongoUpload', function(req, res){

//   console.log(req.body.labelFile);

//   mongodb.MongoClient.connect(uri, function(error, db) {
//     assert.ifError(error);

//     var bucket = new mongodb.GridFSBucket(db, {
//       chunkSizeBytes: 1024,
//       bucketName: 'cfhfiles'
//     });

//     fs.createReadStream('C:/Users/Francis/Desktop/ChangesForHope_v2/' + req.body.labelFile, 'metadata').
//       pipe(bucket.openUploadStream(req.body.labelFile)).
//       on('error', function(error) {
//         assert.ifError(error);
//       }).
//       on('finish', function() {
//         console.log('done!');
//         //process.exit(0);
//         res.redirect('/DownloadUpload');
//       });


//   });

// });


router.post('/mongoDownload', function(res, req){



mongodb.MongoClient.connect(uri, function(error, db) {
  assert.ifError(error);

  var bucket = new mongodb.GridFSBucket(db, {
    //chunkSizeBytes: 1024,
    bucketName: 'storage'
  });

  bucket.openDownloadStreamByName('users.js').
    pipe(fs.createWriteStream('./users.js')).
    on('error', function(error) {
      assert.ifError(error);
    }).
    on('finish', function() {
      console.log('done!');
      //process.exit(0);
    });

  });


});





router.get('/', function(req, res, next) {

  if (req.session.user) {

  	res.render('index', {username: req.session.username, msg: req.session.msg});

  } else {

  	req.session.msg = 'Access denied!';

  	res.redirect('/login');

  }

});


router.get('/DownloadUpload', function(req, res, next) {

  if (req.session.user) {

    res.render('DownloadUpload');

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

router.get('/IncidentReports', function(req, res, next) {
  
  if (req.session.user) {

    res.render('incident');

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

  console.log(req.session.PermissionType);
  if (req.session.PermissionType = "Admin") {


    res.render('adminpage'); // ejs file

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');

  }


});

// router.get('/admin/view/client', function(req, res) {


//   if (req.session.username == "admin") {


//     res.render('clientsProfile'); // ejs file

//   } else {

//     req.session.msg = 'Access denied!';

//     res.redirect('/login');

//   }


// });


router.get('/addClient', function(req, res) {


  if (req.session.PermissionType = "Admin") {


    res.render('adminAddClient'); // ejs file

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');

  }


});

router.get('/clientsProfile', function(req, res, next) {

  if (req.session.PermissionType = "Admin") {


    res.render('clientsProfile'); // ejs file

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');

  }

}); //date_incident

// router.get('/download', function(req, res, next) {

// res.render('DownloadUpload');

// }); //date_incident

// router.get('/signup', function(req, res, next) {


//   res.render('signup');



// });

router.post('/signup', users.signup);
router.post('/user/update', users.updateUser);
router.post('/user/delete', users.deleteUser);
router.post('/login', users.login);
router.post('/logout', users.logoutUser);

router.get('/user/profile', users.getUserProfile); // json source

// router.post('/client/profile', clients.getClientProfile); //
router.post('/view/clientsProfile', clients.GetClientProfile); // working
router.post('/client/update', clients.UpdateClient); // working

router.get('/client/source', clients.ListAllClient); // json source select all 
router.post('/admin/add/client', clients.AddClient);

// Progress Report
//router.post('/employee/client/AddProgressReport', clients.AddProgressReport);
router.post('/AddProgressReport', clients.AddProgressReport);
router.post('/employee/client/ViewProgressReport', clients.ViewProgressReport);
router.post('/employee/client/ViewProgressReportSpecific', clients.ViewProgressReportSpecific);

//Incident Report
router.post('/AddIncidentReport', clients.AddIncidentReport);
router.post('/ViewIncidentReport', clients.ViewIncidentReport);
router.post('/ViewIncidentReportSpecific', clients.ViewIncidentReportSpecific);

router.post('/employee/view/timeLogs', users.ViewTimeLogs);
router.post('/employee/view/empInfo', users.SearchEmpInfo);
router.post('/checkUserName', users.checkUserName);

// router.post('/multer', users.UploadFiles);
router.post('/download', users.DownloadFile);
router.get('/multer', users.ListFiles);
// router.get('/SearchFiles', users.SearchFile);

module.exports = router;
