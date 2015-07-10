(function(){

	 var LoginController = function ($scope, GAuth, $state) {

         $scope.doSingup = function() {
             GAuth.login().then(function(){
                 $state.go('webapp.home'); // action after the user have validated that
                 // your application can access their Google account.
             }, function() {
                 console.log('login fail');
             });
         };
    }

    $.App.CrazyReports.controller('LoginController', ['$scope', 'GAuth', '$state', LoginController]);

}());