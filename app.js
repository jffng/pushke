var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	socket = require('socket.io')(http),
	util = require('util'),
	exec = require('child_process').exec,
	serialport = require('serialport'),
	holy = require('holy');

var SerialPort = serialport.SerialPort;

var portName = '/dev/cu.usbmodemfa131';

function wget(ttsUrl){
	exec('wget -q -U Chrome -O public/tts.wav ' + ttsUrl,
		function (error, stdout, stderr) {
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (error !== null) {
				console.log('exec error: ' + error);
			}else{
				socket.emit('god');
			}
	});
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var myPort = new SerialPort(portName, {
	baudrate: 9600,
	parser: serialport.parsers.readline('\r\n')
});


var addingTzedekah = false;
var last_range_reading = 0;

myPort.on('data', function(data){
	var index = getRandomInt(0, holy.statements.length - 1);
	var statement =  encodeURIComponent(holy.statements[index]);
	console.log(statement);
	var url = '\"http://translate.google.com/translate_tts?tl=en&q='+statement+'\"'
	// console.log(url);
	setTimeout(function(){ wget(url); }, 3000);	
});

socket.on('connection', function(socket){
	console.log('a user connected');
});


app.use("/", express.static(__dirname + "/public"));

app.get('/test', function(request, response){
	var index = getRandomInt(0, holy.statements.length - 1);
	var statement =  encodeURIComponent(holy.statements[index]);
	console.log(statement);
	var url = '\"http://translate.google.com/translate_tts?tl=en&q='+statement+'\"'
	console.log(url);

	setTimeout(function(){ wget(url); }, 3000);

	response.send('ok!');
});

http.listen(8080, function(){
  	console.log('Listening on port %d', http.address().port);
});