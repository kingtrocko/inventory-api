var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var sqlStmts = require('./SQLStatements');
var async = require('async');

//PARAMS => local_id
router.get('/products', function(req, res) {
  req.getConnection(function(err, conn) {
    if (err) return next("Cannot Connect");

    var query = conn.query(sqlStmts.products, [1], function(err, rows) {
      if (err) {
        console.log(err);
        return next("Mysql error, check your query");
      }
      res.json({
        products: rows
      });
    });
  });
});

//PARAMS => producto_id, cliente_id, local_id
router.get('/product-stock', function(req, res) {
  req.getConnection(function(err, conn) {
    if (err) return next('Cannot connect');

    async.waterfall([
      function(callback) {
        getStock(conn, callback);
      },
      function(stock, callback){
        getUnidades(conn, stock, callback);
      },
      function(stock, unidades, callback){
        getPreciosCliente(conn, stock, unidades, callback);
      },
      function(stock, unidades, precios_cliente, callback){
        getPreciosNormal(conn, stock, unidades, precios_cliente, callback);
      }
    ], function (err, result) {
      if(err){
        res.json({error: true, error_description: "internal error while executing the sql query."});
      }
      res.json(result);
    });
  });
});

function getStock(conn, cb) {
  var q = conn.query(sqlStmts.product_stock, [1, 1], function(err, rows) {
    if (err) {
      cb(err)
    }
    cb(null, rows);
  });
}

function getUnidades(conn, stock, cb){
  var q = conn.query(sqlStmts.unidades, [1], function(err, rows) {
    if (err) {
      cb(err)
    }
    cb(null, stock, rows);
  });
}

function getPreciosCliente(conn, stock, unidades, cb){
  var q = conn.query(sqlStmts.precios_cliente, [1], function(err, rows){
    if(err){
      cb(err)
    }
    cb(null, stock, unidades, rows);

  });
}

function getPreciosNormal(conn, stock, unidades, precios_cliente, cb){
    var q = conn.query(sqlStmts.precios_normal, function(err, rows){
      if(err){
        cb(err);
      }
      var result = {
        stock: stock
        unidades: unidades
        precios_cliente: precios_cliente,
        precios_normal: rows
      };
      cb(null, result);
    });
}

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
