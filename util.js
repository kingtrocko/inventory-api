var sqlStmts = require('./SQLStatements');

module.exports = {

//PARAMS => id_producto, id_local
  getStock: function (params, conn, cb) {
    var producto_id = params.product_id;
    var local_id = params.local_id;

    var q = conn.query(sqlStmts.product_stock, [producto_id, local_id], function(err, rows) {
      if (err) {
        cb(err)
      }
      cb(null, rows);
    });
  },

  getUnidades: function (params, conn, stock, cb){
    var q = conn.query(sqlStmts.unidades, [params.product_id], function(err, rows) {
      if (err) {
        cb(err)
      }
      cb(null, stock, rows);
    });
  },

  getPreciosCliente: function (params, conn, stock, unidades, cb){
    var q = conn.query(sqlStmts.precios_cliente, [params.client_id], function(err, rows){
      if(err){
        cb(err)
      }
      cb(null, stock, unidades, rows);

    });
  },

  getPreciosNormal: function (conn, stock, unidades, precios_cliente, cb){
      var q = conn.query(sqlStmts.precios_normal, function(err, rows){
        if(err){
          cb(err);
        }
        var result = {
          stock: stock,
          unidades: unidades,
          precios_cliente: precios_cliente,
          precios_normal: rows
        };
        cb(null, result);
      });
  }

};
