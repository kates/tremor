var fs = require("fs"),
	path = require("path"),
	readline = require("readline"),
	Twitter = require("ntwitter");

function Tremor() {
	var consumer = JSON.parse(fs.readFileSync("./consumer.json").toString()),
		configPath = process.env["HOME"] + "/.tremor/config",
		config;

	function authorize() {
		console.log("please authorize");
	}

	function verify(token, secret) {

	}

	function start() {
		console.log("yehey");
	}

	if (path.existsSync(configPath)) {
		config = JSON.parse(fs.readFileSync(configPath));
		if (!config.token || !config.secret) {
			authorize();
			return;
		}

		if (!verify(config.token, config.secret)) {
			authorize();
			return;
		}

		var twitter = new Twitter({
			consumer_key: consumer.key,
			consumer_secret: consumer.secret
		});

		start();
	} else {
		authorize();
	}
}

Tremor.start = function() {
	return new this;
}

Tremor.start();
