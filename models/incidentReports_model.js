var mongoose = require('mongoose');
	

var incidentReports = new mongoose.Schema({

	FirstName: {type: String},
	MiddleName: String,
	LastName: String,
	Month: String,
	Day: String,
	Year: String,
	Time: String,
	Incidet: String,
	CreatedBy: String


});

mongoose.model('incidentReports', incidentReports);