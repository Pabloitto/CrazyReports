(function(){

	 var LoginController = function ($scope, $location) {

         $scope.doSingup = function(){
             $location.url("/home");
         };

    };

    $.App.CrazyReports.controller('LoginController', ['$scope','$location', LoginController]);

}());