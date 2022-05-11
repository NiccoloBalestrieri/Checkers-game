const express = require("express");
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const { restart } = require("nodemon");
const mysqlConnection = require("../utils/database");
const Router = express.Router();

var bodyParser = require('body-parser');

Router.use( bodyParser.json() ); 
Router.use(bodyParser.urlencoded({
  extended: true
}));

Router.use(express.static(__dirname + '/logIn'));

Router.get("/", (req, res) => {
  res.sendFile(__dirname + '/logIn/loginForm.html');
});

Router.post('/auth', function(request,response){
	var username = request.body.username;
	var password = request.body.password;

	if (request.body.username && request.body.password) {
		mysqlConnection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
		if (error) throw error;
		
		if (results.length > 0) {
			response.sendFile(__dirname + '/startGame/start.html');
		}
		});
	}
});

Router.use(express.static((__dirname + '/startGame')));

Router.post('/start', function(request,response) {
	response.sendFile(__dirname + '/startGame/start.html');
});

Router.post('/register', function(request, response) {
  var username = request.body.usernameRegistration;
  var password = request.body.passwordRegistration;
  var email = request.body.emailRegistration;

  mysqlConnection.query("INSERT INTO user (username, password, email) VALUES ('" + username + "','" + password + "','" + email +"')", function(error, results, fields){
	  if (error) {
		let alert = require('alert'); 
		alert("Incorrect credentials!!");
	  }
	  else
		response.redirect('/'); 
  });
});

Router.use(express.static(__dirname + '/CheckersProject'));

Router.post('/home', function(request, response) {
  response.sendFile(__dirname + '/CheckersProject/index.html');
});

module.exports = Router;