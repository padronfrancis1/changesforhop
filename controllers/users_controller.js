// this acts like the common.cs where data are being pulled and pushed
var crypto = require('crypto');
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Files = mongoose.model('fs.files'),
	UserTimeLogs = mongoose.model('UserTimeLogs');



exports.DownloadFile = function(res, req) {

	console.log("API reached -- Download");
	var uri = 'mongodb://admin:admin@ds145329.mlab.com:45329/changesforhope';

	mongodb.MongoClient.connect(uri, function(error, db){
		assert.ifError(error);
		if(error) {
			console.log(error);
		} else {
			console.log(db);
			var bucket = new mongodb.GridFSBucket(db,{ bucketname: 'changesforhopefiles'});

			bucket.openDownloadStreamByName('sourcefile.pdf').
			  pipe(fs.createWriteStream('./out.pdf')).
			  on('error', function(error) {
			    assert.ifError(error);
			  }).
			  on('finish', function() {
			    console.log('downloaded!');
			    // process.exit(0);
			  });

			}
		});

};



var moment = require('moment');

function hashPW(pwd) {
	return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}

exports.checkUserName = function(req, res) {
	console.log(req.body.username)
	User.findOne({ username: req.body.username }).exec(function(err, user)
	{
		if(user)
		{
			res.json(user);
		} else
		{
			console.log("User does not exist");
		}
	});
};

exports.signup = function(req, res) {


	User.findOne({ username: req.body.username }).exec(function(err, user) {

		if(user) {

			console.log("User Name already taken");
			
			res.render('/signup');

		} else {


			var user = new User(mongoose.model('User'));

			user.set('username', req.body.username)
			user.set('hashed_password', hashPW(req.body.password));
			user.set('FirstName', req.body.firstname);
			user.set('MiddleName', req.body.middlename);
			user.set('LastName', req.body.lastname);
			user.set('PhoneNumber', req.body.phonenumber);
			user.set('Address', req.body.address);
			user.set('PermissionType', req.body.permission);
			user.set('email', req.body.email);

			user.save(function(err){

				if(err) {

					res.session.error = err;
					res.redirect('/signup');

				} else {

					req.session.user = user.id;
					req.session.username = user.username;
					req.session.msg = 'Authenticated as ' + user.username;

					req.session.destroy(function(){
				  		res.redirect('/login');
				  	});
				}
			});
		}

	});

};


exports.login = function(req, res) {

	if( req.body.username == "admin") {
		admin(req, res);
	} else {
		user(req, res);
	}
};

function admin(req, res) {

	var date = new Date();

	var currentDate = moment(date).format('MMMM Do YYYY');
	var currentTime = moment(date).format('h:mm:ss a');

	User.findOne({ username: req.body.username }).exec(function(err, user) {

		if(!user) {

			err = 'User not found.';

		} else if (user.hashed_password === hashPW(req.body.password.toString())) {

			console.log("You have an admin account");

			mongoose.Promise = global.Promise;
			var db = mongoose.createConnection('mongodb://admin:admin@ds145329.mlab.com:45329/changesforhope');

			db.collection('users').insert({

				username : req.body.username,
				email: user.email,
				CurrentDate : currentDate,
				TimeIn : currentTime,
				TimeOut : "NULL",


			}, function(err, success){
				if(err)
				{
					console.log(err);
				} else {
					console.log(success);
				}
			});


			req.session.regenerate(function(){
				
				req.session.user = user.id;

				req.session.username = user.username;

				req.session.msg = 'Authenticated as ' + user.username;

				// res.redirect('/');
				res.redirect('/adminPage');
			});


		} else {

			err = 'Authentication failed.';

		}
		if(err) {

			req.session.regenerate(function(){
				req.session.msg = err;
				res.redirect('/login');
			});

		}
	});
}

// login
var user = function(req, res) {

	var date = new Date();

	var currentDate = moment(date).format('MMMM Do YYYY');
	var currentTime = moment(date).format('h:mm:ss a');
	console.log(currentDate);
	console.log(currentTime);

	User.findOne({ username: req.body.username }).exec(function(err, user) {

		if(!user) {

			err = 'User not found.';

		} else if (user.hashed_password === hashPW(req.body.password.toString())) {


			mongoose.Promise = global.Promise;
			var db = mongoose.createConnection('mongodb://admin:admin@ds145329.mlab.com:45329/changesforhope');

			db.collection('users').insert({

				username : req.body.username,
				email: user.email,
				CurrentDate : currentDate,
				TimeIn : currentTime,
				TimeOut : "NULL",


			}, function(err, success){
				if(err)
				{
					console.log(err);
				} else {
					console.log(success);
				}
			});


			req.session.regenerate(function(){
				req.session.user = user.id;
				req.session.username = user.username;
				req.session.msg = 'Authenticated as ' + user.username;
				res.redirect('/');
			});


		} else {

			err = 'Authentication failed.';

		}
		if(err) {

			req.session.regenerate(function(){
				req.session.msg = err;
				res.redirect('/login');
			});

		}
	});
}


exports.getUserProfile = function(req, res){


	User.findOne({username: req.session.username}).exec(function(err, user) {

		if(!user){

			res.json(404, {err: 'User not found'});

		} else {

			res.json(user);

		}
	});
};


exports.logoutUser = function(req, res) {

	console.log("logout Button reached");
	var date = new Date();

	// var currentDate = moment(date).format('MMMM Do YYYY, h:mm:ss a');
	var currentDate = moment(date).format('MMMM Do YYYY');
	var currentTime = moment(date).format('h:mm:ss a');
	console.log(currentDate);
	console.log(currentTime);

	User.findOne({username: req.session.username, CurrentDate: currentDate, TimeOut: "NULL" }).exec(function(err, user) {

		if(user) {

			
			
			mongoose.Promise = global.Promise;
			var db = mongoose.createConnection('mongodb://admin:admin@ds145329.mlab.com:45329/changesforhope');
			db.collection('users').update(
			{

				username : user.username,
				email : user.email,
				CurrentDate : currentDate,
				TimeOut: "NULL"
			},
			{
				$set: { TimeOut: currentTime}

			}, function(err, success){
				if(err)
				{
					console.log(err);
					console.log("I have NOT updated the data");
				} else {
					console.log(success);
					console.log("Ive updated the data");
				}
			});

		} else {
			console.log(err);
		}

		

	});

	req.session.destroy(function(){
  		res.redirect('/login');
  	});

};


exports.updateUser = function(req, res) {

	console.log("Update User Process");

	User.findOne({username: req.session.username}).exec(function(err, user) {

		user.set('email', req.body.email);
		user.set('color', req.body.color);
		user.save(function(err){
			if(err) {
				req.sessor.msg = err;
			} else {
				req.session.msg =  'User Updated';
			}
			res.redirect('/user');
		});

	});
};

exports.deleteUser = function(req, res) {

	User.findOneOne({_id: req.session.user}, function(err, user){

		if(user) {

			user.remove(function(err){

				if(err) {

					req.session.msg = err;	
				}

				req.session.destroy(function(){

					res.redirect('/login');

				});
			});

		} else {

			req.session.msg = "User not found!";

			req.session.destroy(function(){
			  	res.redirect('/login');
			});
		}
	});
};

exports.ViewTimeLogs = function(req, res) {

	var str = req.body.EmpInfoForDateLog;
	var response = str.substring(0,12);
	console.log(response);

	var currentDate = moment(response).format('MMMM Do YYYY');
	
	// User.find({username: "user", email: "user", CurrentDate: currentDate }).exec(function(err, user) {
	// User.find({username: req.body.empUserNameTimeLog , CurrentDate: currentDate }).exec(function(err, user) {
	User.find({ $or: [{ username: req.body.empUserNameTimeLog }, { email: req.body.empEmailTimeLog }] , CurrentDate: currentDate }).exec(function(err, user) {

		if(err) {
			console.log(err);
		} else {
			res.json(user);
			console.log(user);
		}

	});

};

exports.SearchEmpInfo = function(req, res) {
	console.log("I got the search emp info request");
	console.log(req.body.empEmailSearch);

	User.findOne({email: req.body.empEmailSearch }).exec(function(err, user) {

		if(err) {
			console.log(err);
		} else {
			res.json(user);
			console.log(user);
		}

	});
};

exports.ListFiles = function(req, res) {
	Files.find({}).exec(function(err, files){
		if(err) {
			console.log(err);
		} else {
			res.json(files);
			console.log(files);
		}
	});

}