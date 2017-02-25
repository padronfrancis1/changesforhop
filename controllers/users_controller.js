// this acts like the common.cs where data are being pulled and pushed
var crypto = require('crypto');
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	UserTimeLogs = mongoose.model('UserTimeLogs');

var moment = require('moment');


function hashPW(pwd) {
	return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}

exports.checkUserName = function(req, res)
{
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

			// req.session.msg = "test";
			console.log("User Name already taken");
			
			res.render('/signup');

		} else {

			// console.log("USER Now saving");
			// console.log(req.body.username)
			// console.log(hashPW(req.body.password));
			// console.log(req.body.firstname);
			// console.log(req.body.middlename);
			// console.log(req.body.lastname);
			// console.log(req.body.phonenumber);
			// console.log(req.body.address);
			// console.log(req.body.permission);
			// console.log(req.body.email);

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
		// console.log("Trying toi access admin account");
	} else {
		user(req, res);
	}
};

function admin(req, res) {
	User.findOne({ username: "admin" }).exec(function(err, user) {

		if(!user) {

			err = 'User not found.';

		} else if (user.hashed_password === hashPW(req.body.password.toString())) {

			console.log("You have an admin account");

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

	// var currentDate = moment(date).format('MMMM Do YYYY, h:mm:ss a');
	var currentDate = moment(date).format('MMMM Do YYYY');
	var currentTime = moment(date).format('h:mm:ss a');
	console.log(currentDate);
	console.log(currentTime);
	// console.log(currentdate);

	User.findOne({ username: req.body.username }).exec(function(err, user) {

		if(!user) {

			err = 'User not found.';

		} else if (user.hashed_password === hashPW(req.body.password.toString())) {

			// save log here
			// var date = new Date();
			// var current_hour = date.getHours;
			// moment().format();
			//var _UserTimeLog = mongoose.model('UserTimeLog');
			//var _UserTimeLogs = new UserTimeLogs(mongoose.model('UserTimeLogs'));

			// mongodb://localhost/changesforhope

			mongoose.Promise = global.Promise;
			var db = mongoose.createConnection('mongodb://admin:admin@ds145329.mlab.com:45329/changesforhope');

			db.collection('users').insert({
			// db.collection('users').insert({username : req.session.email,

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

			// _UserTimeLogs.set('username', req.session.username);
			// _UserTimeLogs.set('TimeIn', currentdate); //Date Time Now and Time


			// _UserTimeLogs.save(function(err){
			// 	if(err) {
			// 		req.session.msg = err;
			// 		console.log(err);
			// 	} else {
			// 		console.log(currentdate);
			// 		console.log("Inserted log in time");
			// 		console.log(req.body.username);
			// 	}
			// });

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
	//progressReports.find({ FirstName: req.body.fnames, MiddleName: req.body.mnames, LastName: req.body.lnames, Date: new RegExp(response, 'i') }).exec(function(err, progressReport) {
	User.find({username: "user", email: "user", CurrentDate: currentDate }).exec(function(err, user) {

		if(err) {
			console.log(err);
		} else {
			res.json(user);
			console.log(user);
		}

	});

};

exports.SearchEmpInfo = function(req, res)
{
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