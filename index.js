var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var logger = require('morgan');
var parseTrigger = require('./server/parseTriggers');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/v1/triggers/:trigger', (req, res, next) => {
  parseTrigger.parseTriggerByName(req.params.trigger);
  res.sendStatus(200);
  next();
});

app.listen(port, function() {
  // eslint-disable-next-line
  console.log(`App listening on port ${port}!`);
});
