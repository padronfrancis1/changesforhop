// JavaScript source code
var myApp = angular.module('myApp', ['ngFileUpload', 'ngMaterial', , 'md.data.table', 'ngMessages', 'ui.bootstrap', 'ui.bootstrap.datetimepicker']);

myApp.directive('validPasswordC', function() {
  return {
    require: 'ngModel',
    scope: {

      reference: '=validPasswordC'

    },
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue, $scope) {

        var noMatch = viewValue != scope.reference
        ctrl.$setValidity('noMatch', !noMatch);
        return (noMatch)?noMatch:!noMatch;
      });

      scope.$watch("reference", function(value) {;
        ctrl.$setValidity('noMatch', value === ctrl.$viewValue);

      });
    }
  }
});

myApp.directive('fileModel', ['$parse', function ($parse) {
return {
    restrict: 'A',
    link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
            scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
            });
        });
    }
};
}]);


myApp.controller('MyCtrl',['$scope', '$http', '$filter',  '$interval', '$mdSidenav', '$mdMedia', '$mdDialog','Upload', '$timeout', function ($scope, $http ,$filter, $interval, $mdSidenav, $mdMedia, $mdDialog, Upload, $timeout) {





		$scope.uploadFile = function(){

	        var file = $scope.myFile;
	        var uploadUrl = "/multer";
	        var fd = new FormData();
	        fd.append('file', file);

	        $http.post(uploadUrl,fd, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}
	        })
	        .success(function(){
	          console.log("success!!");

	        })
	        .error(function(){
	          console.log("error!!");
	        });
	    };

	    $scope.ListFiles = function() {
	    	$http.get('/multer', function(){

	    	}).then(function(response){
	    		console.log(response.data[0].filename);
	    		$scope.files = response.data;
	    	});
	    }

	    // $scope.getFile = function() {
	    // 	$http.get('/multer', function(res, err){
	    // 		if(err) {
	    // 			console.log("err");
	    // 		} else {
	    // 			console.log("Success");
	    // 			console.log(res);
	    // 		}
	    // 	});
	    // }

		$scope.today = function() {
			$scope.dt = new Date();
		};

		$scope.today();

		$scope.clear = function() {
			$scope.dt = null;
		};

		$scope.options = {
			customClass: getDayClass,
			minDate: new Date(),
			showWeeks: true
		};

		$scope.genderState = '';
        $scope.genders = ('Male Female').split(' ').map(function (state) { return { abbrev: state }; });

        $scope.statusState = '';
        $scope.statuses = ('Approved Declined').split(' ').map(function (state) { return { abbrev: state }; });

		// Disable weekend selection
		function disabled(data) {
			var date = data.date,
		  	mode = data.mode;
			return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
		}

		$scope.toggleMin = function() {
			$scope.options.minDate = $scope.options.minDate ? null : new Date();
		};

		$scope.toggleMin();

		$scope.setDate = function(year, month, day) {
			$scope.dt = new Date(year, month, day);
		};

		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		var afterTomorrow = new Date(tomorrow);
		afterTomorrow.setDate(tomorrow.getDate() + 1);
		$scope.events = [
		{
		  date: tomorrow,
		  status: 'full'
		},
		{
		  date: afterTomorrow,
		  status: 'partially'
		}
		];

		function getDayClass(data) {
			var date = data.date,
			  mode = data.mode;
			if (mode === 'day') {
			  var dayToCheck = new Date(date).setHours(0,0,0,0);

			  for (var i = 0; i < $scope.events.length; i++) {
			    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

			    if (dayToCheck === currentDay) {
			      return $scope.events[i].status;
			    }
			  }
			}

			return '';
		}



		var tick = function() {
			$scope.clock = Date.now();
		}

		tick();

		$interval(tick, 1000);

		$http.get('/client/source').then(function(response){

			$scope.clients = response.data;
		});

		$scope.uploadPic = function(file) {
		    file.upload = Upload.upload({
		      url: '/files',
		      data: {file: file},
		    });

		    file.upload.then(function (response) {
		      $timeout(function () {
		        file.result = response.data;
		      });
		    }, function (response) {
		      if (response.status > 0)
		        $scope.errorMsg = response.status + ': ' + response.data;
		    }, function (evt) {
		      // Math.min is to fix IE which reports 200% sometimes
		      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		    });
	    }

		$scope.onFileSelect = function($files) {
		// $files: an array of files selected, each file has name, size, and type.
			for (var i = 0; i < $files.length; i++) {

			  var $file = $files[i];
			  $upload.upload({
			    url: '/files',
			    file: $file,
			    progress: function(e){}
			  }).then(function(data, status, headers, config) {
			    // file is uploaded successfully
					console.log("angular");
			    
			    console.log(data);
			  }); 
			}
		}


		$scope.UploadFiles = function(res, req) {
			console.log("Add File");
			$http.post('/files').success(function(data){

			});
			
		};

		$scope.DownloadFile = function(res, req) {
			console.log("Download File");
			$http.get('/download').success(function(data){

			});
			
		};


		// $scope.userExist = false;
		$scope.userExist = "";
		$scope.checkUserName = function(req, res) {
			$scope.userExist = "";

			console.log("Checking username"); //username

			$http.post('/checkUserName', $scope.formData).success(function(data){

				
				$scope.userExist = data;

			});
		}

		$scope.change = function() {
			
			$scope.formData.fnameu = $scope.info.FirstName;
			$scope.formData.mnameu = $scope.info.MiddleName;
			$scope.formData.lnameu = $scope.info.LastName;
			$scope.formData.ageu = $scope.info.Age;
			$scope.formData.genderu = $scope.info.Gender;
			$scope.formData.statusu = $scope.info.Status;
		}

		$scope.prefill = [{fnames: "prefill"}];
		
		$scope.goToPerson = function(fname, mname, lname) {
			$scope.formData = {}
			$scope.formData.fnames = fname;
			$scope.formData.mnames = mname;
			$scope.formData.lnames = lname;

			$http.post('/view/clientsProfile', $scope.formData).success(function(data){

				$scope.info = data;
				//console.log(data);

			});
		}


		$scope.getClientInfo = function(req, res) {

			$scope.info = null;
			$scope.formData.info = "";
			$scope.formData.msg = "";
			$scope.formData.fnameu = "";
			$scope.formData.mnameu = "";
			$scope.formData.lnameu = "";
			$scope.formData.ageu = "";
			$scope.formData.genderu = "";
			$scope.formData.statusu = "";

			$http.post('/view/clientsProfile', $scope.formData).success(function(data){

				console.log(data);
				$scope.info = data;

			});
		}

		

		$scope.UpdateClient = function(req, res) {

			$http.post('/client/update', $scope.formData).success(function(updateCleintdata){

				console.log(updateCleintdata);
				$scope.formDataUpdate = updateCleintdata;

			});
		}

		$scope.AddProgressReport = function(req, res) {


			$scope.date = new Date();
			$scope.converted_date = $filter('date')($scope.clock, 'medium'); // for conversion to string
			$scope.formData.progressReport_date = $scope.converted_date;

			$http.post('/employee/client/AddProgressReport', $scope.formData).success(function(data){

				if(data) {

					$scope.progressReport = data;
					
				} else {

					console.log("Progress Report not Added");

				}
				

			});
		}

		$scope.ViewProgressReport = function(req, res) {

			$scope.convertedMonthlyReport = $filter('date')($scope.dt, 'medium'); // for conversion to string
			$scope.formData.progressMonthlyReport = $scope.convertedMonthlyReport;

			$http.post('/employee/client/ViewProgressReport', $scope.formData).success(function(data){
					console.log(data);
					$scope.progressReport = data;
				});
			}

			$scope.ViewProgressReportSpecific = function(req, res) {

			$http.post('/employee/client/ViewProgressReportSpecific', $scope.formData).success(function(data){
				console.log(data);
				$scope.progressReportSpecific = data;
			});
		}

		$scope.toggleLeft = buildToggler('left');
		$scope.toggleRight = buildToggler('right');

		function buildToggler(componentId) {
			return function() {
				$mdSidenav(componentId).toggle();
			};
		}


		$scope.status = '  ';
		$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');


		$scope.showUsersModal = function(ev) {

			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

			$mdDialog.show({
				controller: DialogController,
				templateUrl: './progressReport.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				locals: {
					progressReportSpcfc: $scope.progressReportSpecific
				},
				clickOutsideToClose:true,
				fullscreen: useFullScreen
			})
			.then(function(answer) {
				$scope.status = 'You said the information was "' + answer + '".';
			}, function() {
				$scope.status = 'You cancelled the dialog.';
			});



			$scope.$watch(function() {
				return $mdMedia('xs') || $mdMedia('sm');
			}, function(wantsFullScreen) {
					$scope.customFullscreen = (wantsFullScreen === true);
				});
		};

		$scope.showEmployeeLogsModal = function(ev) {
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

			$mdDialog.show({
				controller: DialogController,
				templateUrl: './timeLogs.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: useFullScreen
			})
			.then(function(answer) {
				$scope.status = 'You said the information was "' + answer + '".';
			}, function() {
				$scope.status = 'You cancelled the dialog.';
			});




			$scope.$watch(function() {
				return $mdMedia('xs') || $mdMedia('sm');
				}, function(wantsFullScreen) {
					$scope.customFullscreen = (wantsFullScreen === true);
				});
		};


		function DialogController($scope, $http, $mdDialog, $filter) {


		var tick = function() {
		  $scope.clock = Date.now();
		}

		tick();

		$interval(tick, 1000);

		$scope.hide = function() {
			$mdDialog.hide();
		};
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		$scope.answer = function() {
			$mdDialog.hide(answer);
		};


		$scope.AddProgressReport = function(req, res) {


			$scope.date = new Date();
			$scope.converted_date = $filter('date')($scope.clock, 'medium'); // for conversion to string

			$scope.formData.progressReport_date = $scope.converted_date;

			$http.post('/employee/client/AddProgressReport', $scope.formData).success(function(data){
				
				if(data) {

					$scope.progressReport = data;
					
				} else {

					console.log("Progress Report not Added");

				}
				

			});
		}


		$scope.ShowTimeLogs = function(req, res) {

			$scope.logs = "";
			$scope.convertedDateLog = $filter('date')($scope.dt, 'medium');
			$scope.formData.EmpInfoForDateLog = $scope.convertedDateLog;
			$scope.NullDate = false;

			if($scope.formData.EmpInfoForDateLog == null)
			{
				$scope.NullDate = true;
				
			}
			else if($scope.formData.EmpInfoForDateLog != null)
			{
				$scope.NullDate = false;
				$http.post('/employee/view/timeLogs', $scope.formData).success(function(data){

					$scope.logs = data;
				});
			}
			else
			{

			}
		};



		$scope.SearchEmployees = function(res, req)	{
			
			$http.post('/employee/view/empInfo', $scope.formData).success(function(data){

				$scope.empInformation = data;
			});
		};

		$scope.DownloadCSV = function(res, req) {

			var dataLogs = $scope.logs;
			var csvRows = [];
			csvRows.push(dataLogs[0].CurrentDate); 
			console.log(dataLogs); 
			
			for(var i =0; i<dataLogs.length; i++) {

				// console.log(dataLogs[i].CurrentDate);
				// console.log(dataLogs[i].TimeIn);
				// console.log(dataLogs[i].TimeOut);

				csvRows.push("TimeIn	:" + dataLogs[i].TimeIn, "timeout:" + dataLogs[i].TimeOut);

			}
			
			// for(var j=1; j<10; ++j){ 
			//     A.push([j, Math.sqrt(j)]);
			// }

			// var csvRows = [];

			// for(var i=0, l=A.length; i<l; ++i){
			//     csvRows.push(A[i].join(','));
			// }

			var csvString = csvRows.join("%0A");
			var a = document.createElement('a');
			a.href = 'data:attachment/csv,' + csvString;
			a.target = '_blank';
			a.download = dataLogs[0].username + '.csv';

			document.body.appendChild(a);
			a.click();

		};



	}

}]);
