var fs = require("fs"),
	path = require("path"),
	readline = require("readline"),
	Twitter = require("ntwitter"),
  crypto = require("crypto"),
  oauth = require("oauth");

function Tremor() {
	var consumer = JSON.parse(fs.readFileSync(__dirname + "/../consumer.json").toString()),
		configPath = process.env["HOME"] + "/.tremor/config",
    request_token_url = "https://api.twitter.com/oauth/request_token",
    access_token = {},
		config;

  var rl = readline.createInterface(process.stdin, process.stdout, null);
  rl.setPrompt("> ", 2);

	function authorize() {
    var o = new oauth.OAuth(
      "https://api.twitter.com/oauth/request_token",
      "https://api.twitter.com/oauth/access_token",
      consumer.token, consumer.secret, "1.0A", "oob", "HMAC-SHA1"
    );

    o.getOAuthRequestToken(function(error, req_token, req_token_secret, results) {
      var auth_url = "http://api.twitter.com/oauth/authorize?oauth_token=" + req_token;
      rl.question("Please visit " + auth_url + " to authorize tremor.js\nEnter Pin: ", function(input) {
        o.getAuthAccessToken(req_token, req_token_secret, input, function(error, acc_token, acc_token_secret, results) {
          if (!error) {
            access.token = acc_token;
            access.secret = acc_token_secret;
            start();
          } else {
            end();
          }
        });
      });
    });

    end();
	}


	function verify(token, secret) {

	}

	function start() {
    rl.prompt();
	}

  function end() {
    rl.close();
    process.stdin.destroy();
  }

  rl.on("line", function(input) {
    if (input === "exit") {
      console.log("Bye!");
      end();
      return;
    }
    console.log("you said " + input);
    rl.prompt();
  });

  process.on("SIGINT", end);
  process.on("exit", end);
  process.on("uncaughtException", function(err) {
    process.stderr.write(err + "\n");
    end();
  });
 
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

exports.Tremor = Tremor;
