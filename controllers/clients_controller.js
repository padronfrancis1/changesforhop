var mongoose = require('mongoose'),
		Clients = mongoose.model('clients')
		progressReports = mongoose.model('progressReports')
		

exports.AddClient = function(req, res) 
{

	console.log("I got the request");

	Clients.findOne({ Firstname: req.body.fname, LastName: req.body.lname }).exec(function(err, client){
		
		if(client) {
			//req.session.msg = "Clients Firt name and Last name already exist, Please double check";
			console.log("Client already exists");
			//res.redirect('/admin/addclients');
		} else {
			console.log("You can add user");

			var client = new Clients(mongoose.model('clients'));

			
			client.set('FirstName', req.body.fname);
			client.set('LastName', req.body.lname);
			client.set('MiddleName', req.body.mname);
			client.set('Age', req.body.age);
			client.set('Gender', req.body.gender);
			client.set('Status', req.body.status);

			console.log(req.body.status);

			client.save(function(err){

				if(err) {

					// res.session.error = err;
					console.log(err);
					res.redirect('/adminAddClient');

				} else {
					console.log("Successful Client Add");
					res.redirect('/adminPage');

				}
			});


		}
	});


};

exports.ListAllClient = function(req, res) 
{

	if(req.session.user) {

		Clients.find({}).exec(function(err, clients){

			if(!clients){

				res.json(404, {err: 'User not found'});

			} else {

				res.json(clients);

			}

		});

	} else {

		res.redirect('/');
	}
	

};

// This will be the source
// create another function that updates the info and another page to put the info before updateing



exports.GetClientProfile = function(req, res) 
{


	Clients.findOne({ FirstName: req.body.fnames, LastName: req.body.lnames, MiddleName: req.body.mnames }).exec(function(err, client) {

		if(!client){
			
			res.json(404, {err: 'User not found'});

		} else {
			
			res.json(client);

			console.log(client);
			
		}


	});

};

exports.UpdateClient = function(req, res) 
{

	console.log("Update Client Process");

	// console.log(req.body.info.Age);


	Clients.findOne({ FirstName: req.body.fnames, MiddleName: req.body.mnames, LastName: req.body.lnames }).exec(function(err, client) {

		if(client)
		{
			console.log("Found ONe");
		}else{
			console.log("X");
		}

		client.set('FirstName', req.body.fnameu);

		client.set('MiddleName', req.body.mnameu);

		client.set('LastName', req.body.lnameu);

		client.set('Age', req.body.ageu);

		client.set('Gender', req.body.genderu);

		client.set('Status', req.body.statusu);


		client.save(function(err){
			if(err) {
				req.sessor.msg = err;
			} else {
				req.session.msg =  'User Updated';
			}
			res.redirect('/admin/view/client');
		});

	});
};

exports.AddProgressReport = function(req, res) 
{
	

	Clients.findOne({ FirstName: req.body.fnames, MiddleName: req.body.mnames, LastName: req.body.lnames }).exec(function(err, client) {

		if(client)
		{

			var progressReport = new progressReports(mongoose.model('progressReports'));

			
			
			progressReport.set('FirstName', req.body.fnames);
			progressReport.set('LastName', req.body.lnames);
			progressReport.set('MiddleName', req.body.mnames);
			progressReport.set('Date', req.body.progressReport_date);
			progressReport.set('Time', req.body.progressReport_time);
			progressReport.set('Hygiene', req.body.progressReport_hygiene);
			progressReport.set('HealthMedication', req.body.progressReport_healthmed);
			progressReport.set('Nutrition', req.body.progressReport_nutrition);
			progressReport.set('Appointments', req.body.progressReport_appoitnments);
			progressReport.set('SchoolHomework', req.body.progressReport_schoolhw);
			progressReport.set('AWOLContact', req.body.progressReport_rel);
			progressReport.set('ProgressGoals', req.body.progressReport_contact);
			progressReport.set('CreatedBy', req.session.username);


			progressReport.save(function(err, success){

				if(err) {

					console.log("not inserted");


				} else {
					console.log("Successful Progress Report Add");
					console.log(success);

				}
			});

		}else{
			console.log("Not inserted");
		}

	});
}

exports.ViewProgressReport = function(req, res) 
{
	
	console.log("I got the Progress Report Request View");
	// progressReports.find({ FirstName: req.body.fnames, MiddleName: req.body.mnames, LastName: req.body.lnames }).exec(function(err, progressReport) {
		// progressReports.find({ FirstName: req.body.fnames, MiddleName: req.body.mnames, LastName: req.body.lnames, Date: new RegExp('Feb', 'i') }).exec(function(err, progressReport) {
		console.log(req.body.progressMonthlyReport);
		console.log(req.body.fnames);

		var str = req.body.progressMonthlyReport;
		var response = str.substring(0,12);
		console.log(response);

		progressReports.find({ FirstName: req.body.fnames, MiddleName: req.body.mnames, LastName: req.body.lnames, Date: new RegExp(response, 'i') }).exec(function(err, progressReport) {

		if(progressReport)
		{

			console.log(progressReport);
			res.json(progressReport);

		}else {
			console.log("No Records Found");
		}

	});
}

exports.ViewProgressReportSpecific = function(req, res) 
{
	
	console.log("I got the Specific Progress Report Request View");
	progressReports.find({ FirstName: req.body.fnames, MiddleName: req.body.mnames, LastName: req.body.lnames, Date: req.body.progressReport_SpecificDate }).exec(function(err, ProgressReportSpecific) {

		if(ProgressReportSpecific)
		{

			console.log(ProgressReportSpecific);
			res.json(ProgressReportSpecific);

		}else{
			console.log("Progress Report Not Found");
		}

	});
}

