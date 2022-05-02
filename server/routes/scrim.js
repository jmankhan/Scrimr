var model = require('../models/Scrim');

var express = require('express');
var router = express.Router();

var records = [];

router.get('/:id', function(req, res, next) {
  const record = records.filter(record => record.id === req.params.id);
  if(!record) {
    res.statusCode(404)
  }

  res.json(record);
});

router.post('/', function(req, res, next) {
  const record = new model();
  record.id = Math.round(Math.random() * 1000000);
  record.name = req.body.name;
  record.createdDate = DateTime.now();

  records.push(push);
  res.json({ id: record.id });
})

module.exports = router;
