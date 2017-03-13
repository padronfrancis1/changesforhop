// this acts like the common.cs where data are being pulled and pushed
var crypto = require('crypto');
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Files = mongoose.model('fs.files'),
	UserTimeLogs = mongoose.model('UserTimeLogs');



exports.DownloadFile = function(res, req) {

	console.log("API reached -- Download");
	var uri = 'mongodb://admin:admin@ds145329.mlab.com:45329/changesforhope';
	// var uri = 'mongodb://localhost/changesforhope';

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

	User.findOne({ username: req.body.username }).exec(function(err, user) {

		if(user) {

			console.log("User Name already taken");
			
			res.render('/signup');

		} else {


			
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

	var currentDate = moment(date).format('M/D/YYYY');
	var currentDateTime = moment(date).format('M/D/YYYY h:mm:ss a');
	var currentTime = moment(date).format('h:mm:ss a');

	var currentMonth = moment(date).format('M');
	var currentYear = moment(date).format('YYYY');

	var timeIn = new User(mongoose.model('User'));


	// 		console.log("You have an admin account");
	// 		console.log(user.username);
	// 		console.log(user.email);
	// 		console.log(currentDate);
	// 		console.log(currentMonth);
	// 		console.log(currentYear);
	// 		console.log(currentTime);
	console.log(currentDateTime);

	User.findOne({ username: req.body.username }).exec(function(err, user) {

		if(!user) {

			err = 'User not found.';

		} else if (user.hashed_password === hashPW(req.body.password.toString())) {

			console.log("You have an admin account");
			console.log(user.username);
			console.log(user.email);
			console.log(currentDate);
			console.log(currentMonth);
			console.log(currentYear);
			console.log(currentTime);

			timeIn.set('username', req.body.username)
			timeIn.set('email', user.email);
			timeIn.set('CurrentDate', currentDate);
			timeIn.set('Year', currentYear);
			timeIn.set('Month', currentMonth);
			timeIn.set('TimeIn', currentTime);
			timeIn.set('TimeOut', "NULL");


			timeIn.save(function(err){

				if(err) {

					console.log("error");

				} else {
					console.log("inserted");
					
				}
			});

			req.session.regenerate(function(){
				
				req.session.user = user.id;
				req.session.username = user.username;
				req.session.email = user.email;
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

	var currentDate = moment(date).format('M/D/YYYY');
	var currentDateTime = moment(date).format('M/D/YYYY h:mm:ss a');
	var currentTime = moment(date).format('h:mm:ss a');

	var currentMonth = moment(date).format('M');
	var currentYear = moment(date).format('YYYY');


	User.findOne({ username: req.body.username }).exec(function(err, user) {

		if(!user) {

			err = 'User not found.';

		} else if (user.hashed_password === hashPW(req.body.password.toString())) {

			console.log("You have an admin account");
			console.log(user.username);
			console.log(user.email);
			console.log(currentDate);
			console.log(currentMonth);
			console.log(currentYear);
			console.log(currentTime);

			timeIn.set('username', req.body.username)
			timeIn.set('email', user.email);
			timeIn.set('CurrentDate', currentDate);
			timeIn.set('Year', currentYear);
			timeIn.set('Month', currentMonth);
			timeIn.set('TimeIn', currentTime);
			timeIn.set('TimeOut', "NULL");


			timeIn.save(function(err){

				if(err) {

					console.log("error");

				} else {
					console.log("inserted");
					
				}
			});


			req.session.regenerate(function(){
				
				req.session.user = user.id;
				req.session.username = user.username;
				req.session.email = user.email;
				req.session.msg = 'Authenticated as ' + user.username;

				res.redirect('/');
				// res.redirect('/adminPage');
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
	var currentDate = moment(date).format('M/D/YYYY');
	var currentTime = moment(date).format('h:mm:ss a');

	var currentMonth = moment(date).format('M');
	var currentYear = moment(date).format('YYYY');
	var currentDay = moment(date).format('D');

	var currentHour = moment(date).format('h');
	var currentMinutes = moment(date).format('mm');
	var currentSeconds = moment(date).format('ss');


	console.log(req.session.username);
	console.log(req.session.email);
	console.log(currentDate);
	console.log(currentTime);
	console.log(currentMonth);
	console.log(currentYear);
	console.log("------------");


	User.findOne({CurrentDate : currentDate, username: req.session.username, email: req.session.email, TimeOut: "NULL" }).sort({$natural:-1}).exec(function(err, user) {

		if(user) {
			console.log("Found 1");

			// console.log("timein: " + currentYear, currentMonth, currentDay, user.TimeIn);
			// console.log("timeout: " + currentYear, currentMonth, currentDay, currentTime);
			//var totalHrs = 

			// log out time
			var newStart = new Date(currentYear, currentMonth, currentDay, currentHour, currentMinutes, currentSeconds);





			var logOutTime = user.TimeIn;
			var newlogOutTime = logOutTime.substr(0, logOutTime.length-3); //remove am/pm
			var separate = logOutTime.split(':');

			console.log(separate[0], separate[1], separate[2])
			var currentHour_out = moment(date).format('h');
			var currentMinutes = moment(date).format('mm');
			var currentSeconds = moment(date).format('ss');

			var dateOut = new Date(currentYear, currentMonth, currentDay, separate[0], separate[1], separate[2]);

			// var currentHour_timeIn = moment(dateOut).format('h');
			// var currentMinutes_timeIn = moment(dateOut).format('mm');
			// var currentSeconds_timeIn = moment(dateOut).format('ss');

			// // var newEnd =  new Date (currentYear, currentMonth, currentDay, currentHour_timeIn, currentMinutes_timeIn, currentSeconds_timeIn);

			// console.log(newStart);
			console.log(dateOut);
			

			var userInstance = new User(mongoose.model('User'));

			user.set('TimeOut', currentTime);
			//user.set('NumbHrs', numHrs);
			
			user.save(function(err){
				if(err) {
					console.log(err)
				} else {
					// console.log("updated")
					// console.log("username " + user.username);
					// console.log("user email " + user.email);
					// console.log("month " + user.Month);
					// console.log("year " + user.Year);
					
					// console.log("timeout " + user.TimeOut);
					
				}
				//res.redirect('/user');
			});


		} else {

			console.log("No User Found");
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

	var startDate = req.body.startDate;
	var endDate = req.body.endDate;

	console.log(startDate);
	console.log(endDate);

	User.find({ Month: startDate, Year: endDate }).exec(function(err, user) {

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