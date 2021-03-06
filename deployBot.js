var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var os = require('os');
var path = require('path');
var events = require('events');

var proxy = new events.EventEmitter();
var ready = true;

var exec = require('child_process').exec;

//var postToSlack = require(path.resolve(__dirname, './postToSlackIncoming.js'));

var deployBot = express();

deployBot.use(helmet());

deployBot.use(bodyParser.urlencoded({
	extended: false
}));


deployBot.post('/deploy/:app/:branch', function(req, res) {
	if (!ready) {
		console.log('deployBot not ready.');
		res.status(400).json({msg: 'deploy bot not ready.'});
		return;
	}

	const script = path.resolve('./deploy.js');
	const appName = req.params.app;
	const appBranch = req.params.branch;

	ready = false;
	exec(`node deploy.js ${appName} ${appBranch}`, function(err, stdout, stderr) {
		ready = true;
		
		if (err) {
			console.log(err);
			return;
		}

		console.log(stdout);
		res.status(200).send('success');
	});

});

deployBot.listen(3000);
console.log('deploy bot listen on posr 3000');



