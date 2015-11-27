var express = require('express');
var router = express.Router();
var mysql = require('mysql');

router.get('/products', function(req, res) {
  req.getConnection(function(err, conn) {
    if (err) return next("Cannot Connect");

    var query = conn.query('SELECT * FROM producto', function(err, rows) {
      if (err) {
        console.log(err);
        return next("Mysql error, check your query");
      }
      res.json({ products: rows, products_count: rows.length });
    });
  });
});

router.get('/products/most_sold', function(req, res) {

});

router.get('/clients/', function(req, res) {
  req.getConnection(function(err, conn) {
    if (err) return next("Cannot Connect");

    var query = conn.query('SELECT * FROM cliente', function(err, rows) {
      if (err) {
        console.log(err);
        return next("Mysql error, check your query");
      }
      res.json({ clients: rows, clients_count: rows.length });
    });
  });
});

router.get('/clients/:name', function(req, res) {
  
});

router.post('/invoice/new', function(req, res) {

});

router.post('/authenticate', function(req, res) {

});

router.get('/logout', function(req, res) {

});

module.exports = router;
