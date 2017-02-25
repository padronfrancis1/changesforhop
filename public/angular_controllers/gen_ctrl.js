// JavaScript source code
var myApp = angular.module('myApp', ['ngMaterial', 'md.data.table', 'ngMessages', 'ui.bootstrap', 'ui.bootstrap.datetimepicker']);


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


myApp.controller('MyCtrl',['$scope', '$http', '$filter',  '$interval', '$mdSidenav', '$mdMedia', '$mdDialog', function ($scope, $http ,$filter, $interval, $mdSidenav, $mdMedia, $mdDialog) {




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


		$scope.showUsersModal = function(ev)
		{

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



		// $scope.data = items;

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
			
			// console.log($scope.data.FirstName);
			// console.log($scope.data.MiddleName);
			// console.log($scope.data.LastName);
			// console.log($scope.formData.progressReport_date);

			$scope.formData.progressReport_date = $scope.converted_date;
			// $scope.formData.progressReport_date = $scope.converted_date;
			// console.log($scope.converted_date);
			

			$http.post('/employee/client/AddProgressReport', $scope.formData).success(function(data){
				
				if(data) {

					$scope.progressReport = data;
					
				} else {

					console.log("Progress Report not Added");

				}
				

			});
		}


		$scope.ShowTimeLogs = function(req, res) {


			$scope.convertedDateLog = $filter('date')($scope.dt, 'medium');
			$scope.formData.EmpInfoForDateLog = $scope.convertedDateLog;
			$scope.NullDate = false;

			if($scope.formData.EmpInfoForDateLog == null)
			{
				$scope.NullDate = true;
				// console.log("Date is null");
				
			}
			else if($scope.formData.EmpInfoForDateLog != null)
			{
				$scope.NullDate = false;
				$http.post('/employee/view/timeLogs', $scope.formData).success(function(data){

					$scope.logs = data;
					// console.log($scope.logs);
				});
			}
			else
			{

			}
		};



		$scope.SearchEmployees = function(res, req)
		{
			

			$http.post('/employee/view/empInfo', $scope.formData).success(function(data){

				// console.log(updateCleintdata);
				// $scope.formDataUpdate = updateCleintdata;
				$scope.empInformation = data;
			});
		};
		}

}]);

// function DialogController($scope, $http, $mdDialog, $filter, items) {


	
// 	$scope.data = items;

// 	$scope.hide = function() {
// 		$mdDialog.hide();
// 	};
// 	$scope.cancel = function() {
// 		$mdDialog.cancel();
// 	};
// 	$scope.answer = function() {
// 		$mdDialog.hide(answer);
// 	};


// 	$scope.ShowTimeLogs = function(req, res) {


// 		$scope.convertedDateLog = $filter('date')($scope.dt, 'medium');
// 		$scope.formData.EmpInfoForDateLog = $scope.convertedDateLog;
// 		$scope.NullDate = false;

// 		if($scope.formData.EmpInfoForDateLog == null)
// 		{
// 			$scope.NullDate = true;
// 			// console.log("Date is null");
			
// 		}
// 		else if($scope.formData.EmpInfoForDateLog != null)
// 		{
// 			$scope.NullDate = false;
// 			$http.post('/employee/view/timeLogs', $scope.formData).success(function(data){

// 				$scope.logs = data;
// 				// console.log($scope.logs);
// 			});
// 		}
// 		else
// 		{

// 		}
// 	};

	
	
// 	$scope.SearchEmployees = function(res, req)
// 	{
		

// 		$http.post('/employee/view/empInfo', $scope.formData).success(function(data){

// 			// console.log(updateCleintdata);
// 			// $scope.formDataUpdate = updateCleintdata;
// 			$scope.empInformation = data;
// 		});
// 	};


// }

// myApp.factory('navigation', ['ngMaterial', function(){

// }]);