var express = require('express');
var app = express();

var morgan = require('morgan');
var bodyParser = require('body-parser');

var nunjucks = require('nunjucks');

var path = require('path');
module.exports = app;

app.set('view engine', 'html');
app.engine('html', nunjucks.render);
var env = nunjucks.configure('views', { noCache: true });
require('./filters')(env);

var AutoEscapeExtension = require("nunjucks-autoescape")(nunjucks);
env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/wiki', require('./routes/wiki'));
app.use('/users', require('./routes/users'));

app.get('/mark-and-omri-test-something-out', function (req, res, next) {
  throw new Error('This just always fails for some reason');
});

app.get('/', function (req, res) {
   res.render('index');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.message);
});
