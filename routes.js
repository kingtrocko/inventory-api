var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var sqlStmts = require('./SQLStatements');
var async = require('async');
var util = require('./util.js');
var url = require('url');

//PARAMS => local_id
router.get('/products', function(req, res) {
  req.getConnection(function(err, conn) {
    if (err) return next("Cannot Connect");

    var url_parts = url.parse(req.url, true);
    var qs = url_parts.query;

    if(qs.local_id){
      var query = conn.query(sqlStmts.products, [req.params.local_id], function(err, rows) {
        if (err) {
          console.log(err);
          return next("Mysql error, check your query");
        }
        res.json({
          products: rows
        });
      });
    }else{
      res.json({error_description: "missing local_id parameter"})
    }
  });
});

//PARAMS => producto_id
//QueryString => client_id, local_id
router.get('/productstock/:pid', function(req, res) {
  req.getConnection(function(err, conn) {
    if (err) return next('Cannot connect');

    var url_parts = url.parse(req.url, true);
    var qs = url_parts.query;

    if(req.params.pid && qs.client_id && qs.local_id){
      var params = {
        product_id: req.params.pid,
        client_id: qs.client_id,
        local_id: qs.local_id
      };

      async.waterfall([
        function(callback) {
          util.getStock(params, conn, callback);
        },
        function(stock, callback){
          util.getUnidades(params, conn, stock, callback);
        },
        function(stock, unidades, callback){
          util.getPreciosCliente(params, conn, stock, unidades, callback);
        },
        function(stock, unidades, precios_cliente, callback){
          util.getPreciosNormal(conn, stock, unidades, precios_cliente, callback);
        }
      ], function (err, result) {
        if(err){
          res.json({ error_description: "internal error while executing the sql query."});
        }
        res.json(result);
      });
    }else{
      res.json({error_description: "Make sure you provided all the following parameters: pid, client_id, local_id"});
    }
  });
});

router.get('/products/:pid/prices/:typeid', function(req, res){
  req.getConnection(function(err, conn){
    if (err) return next("Cannot Connect");

    var product_id = req.params.pid;
    var price_id = req.params.typeid;

    var query = conn.query(sqlStmts.precios_por_producto, [product_id, price_id], function(err, rows){
      if (err) {
        console.log(err);
        return next("Mysql error, check your query");
      }
      res.json({
        prices: rows
      });
    });
  });
});

router.get('/products/most_sold', function(req, res) {

});

router.get('/clients', function(req, res) {
  req.getConnection(function(err, conn) {
    if (err) return next("Cannot Connect");

    var query = conn.query('SELECT * FROM cliente', function(err, rows) {
      if (err) {
        console.log(err);
        return next("Mysql error, check your query");
      }
      res.json({
        clients: rows
      });
    });
  });
});

router.get('/clients/:name', function(req, res) {
  //TODO
});

router.post('/invoice/new', function(req, res) {
  //TODO
});

router.post('/authenticate', function(req, res) {
  //TODO
});

router.get('/logout', function(req, res) {
  //TODO
});

module.exports = router;
