var express = require('express');
var url = require('url');
var request = require('request');
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var app = express();
var apiKey = 'dc6zaTOxFJmzC';

var server = new Server('localhost', 27017, {auto_reconnect: true});

var db = new Db('userdb', server);

//Authenticator
/*app.use(express.basicAuth(function (user, pass) {
    return user === 'testUser' && pass === 'testPass';
}));*/

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

db.open(function (err, db) {
    if (!err) {
        console.log("Connected to 'userdb' database");
    }else{
     console.log(JSON.stringify(err));
    }
});

app.all('*', function (req, res, next) {
    if (!req.get('Origin')) {
        return next();
    }

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,POST');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');

    if ('OPTIONS' === req.method) {
        return res.send(200);
    }

    next();
});

app.get('/search', express.basicAuth(function (user, pass, callback) {
        
    
        //console.log('Retrieving user: ' + user);
        db.collection('users', function(err, collection) {
            collection.findOne({'username':user}, function(err, item) {
                //console.log('found record: ' + JSON.stringify(item));
                
                var result = (item != null && user === item.username && pass === item.password);
                
                callback(null /* error */, result);
            });
        });
    
        
    }), function (req, res) {
	var query = url.parse(req.url, true).query; console.log('http://api.giphy.com/v1/gifs/translate?api_key=' + apiKey + '&s=' + query.q);
	//Lets try to make a HTTP GET request to giphys API website. http://api.giphy.com/v1/gifs/translate?s=blue&api_key=dc6zaTOxFJmzC
	request('http://api.giphy.com/v1/gifs/translate?api_key=' + apiKey + '&s=' + query.q, function (error, response, body) {
	    if (!error && response.statusCode === 200) {
	        res.send(body);
	    }
    });
    
});

app.get('/login', express.basicAuth(function (user, pass, callback) {
        console.log(user);
    
        //console.log('Retrieving user: ' + user);
        db.collection('users', function(err, collection) {
            collection.findOne({'username':user}, function(err, item) {
                //console.log('found record: ' + JSON.stringify(item));
                
                var result = (item != null && user === item.username && pass === item.password);
                
                callback(null /* error */, result);
            });
        });
    
        
    }), function (req, res) {
    res.send('Login Successful');
});

app.post('/signup', function (req, res) {
	var user = req.body;
    console.log('Adding user: ' + JSON.stringify(user));
	db.collection('users', function (err, collection) {
        collection.insert(user, {safe: true}, function (err, result) {
            if (err) {
                res.send({'error': 'An error has occurred', 'object': err});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
    
});

app.get('/users', function (req, res) {
	db.collection('users', function (err, collection) {
        collection.find().toArray(function (err, items) {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                res.send(items);
            }
        });
    });
    
});

app.listen(3000);

console.log('Server running at http://localhost:3000/');