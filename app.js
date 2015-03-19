var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	socket = require('socket.io')(http),
	util = require('util'),
	exec = require('child_process').exec,
	serialport = require('serialport');

var SerialPort = serialport.SerialPort;

var portName = '/dev/cu.usbmodemfd121';

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

var myPort = new SerialPort(portName, {
	baudrate: 9600,
	parser: serialport.parsers.readline('\r\n')
});

myPort.on('data', function(data){
	var url = '"http://translate.google.com/translate_tts?tl=en&q=Hello%20World"';

	console.log(data);

	if (data<5){
		wget(url);
	}
});

socket.on('connection', function(socket){
	console.log('a user connected');
});

app.use("/", express.static(__dirname + "/public"));

app.get('/test', function(request, response){


	response.send('ok!');
});

http.listen(8080, function(){
  	console.log('Listening on port %d', http.address().port);
});