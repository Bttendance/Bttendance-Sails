//AngularJS

var app = angular.module('bttendance', []);

app.controller('UserController', function(){
	var user = this;
	user.full_name = data.full_name;
	user.email = data.email;
	user.courses = data.courses;
});

// var data = {
// 	full_name: 'HeeHwan Park',
// 	email: 'heehwan.park@gmail.com',
// 	courses: [{
// 		name: 'Introduction to Programming',
// 		description: 'Welcome to the Hell'
// 	},
// 	{
// 		name: 'General Biology',
// 		description: 'You cannot escape from us'
// 	}]
// };

// app.controller('UserController', ['$http', function($http){
// 	var user = this;
// 	user.courses = [];
// 	$http.get('assets/test.json').success(function(data){
// 		user.full_name = data.full_name;
// 		user.email = data.email;
// 		user.courses = data.courses;
// 	});
// }]);