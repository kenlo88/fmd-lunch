var connection = require('./connection');
var requireNew = require('require-new');
var sqlarray = require('./fmdsql.json') ;

//var tyear = new Date().getFullYear();

function fmdata() {
    this.get = function(req, res) {
        //connection.acquire(function(err, con) {
            //if (err) throw err; 
            //var sql = "select * from cbs where project='"+req.query.project+"'";
            //console.log(req.params.source);
            //var sql = sqlarray.param[req.params.source];
            //con.query(sql, function(err1, result, fields) {
                //if (err1) res.send(err1);
                //else {
                //res.send(result);
                //res.csv(result,true);
                //}
                //con.release();
            //});
            var dsrc = require('../js/'+req.params.source);
            dsrc.sdata(res,req.query);
        //});
    };

    this.update = function(req, res) {
            var dsrc = require('../js/'+req.params.source);
            dsrc.sdata(res,req.body);
    };

    this.gettmpl = function(req, res) {
        var bigsql = '';
        sqlarray.param[req.params.source].forEach(function(entry) {
            var sql = sqlarray.param[entry];
            for (var item in req.query) {
                sql = sql.replace(new RegExp('\\$'+item, 'g'),req.query[item]);
            }
            bigsql = bigsql + sql + '; ';
        });
        if (bigsql) {
            connection.acquire(function(err, con) {
                if (err) throw err; 
                con.query(bigsql, function(err1, result, fields) {
                    con.release();
                    if (err1) throw(err1);
                    else {
                        if (sqlarray.param[req.params.source].indexOf('csv') > -1) {
                            var tmplout = JSON.stringify(result.concat(req.query));
                            res.send(tmplout.replace(/"Variable_name":/g,'').replace(/"Value":/g,'').replace(/","/g,'":"'));
                        }
                        else {
                            tmplout = result.concat(req.query);
                            res.send(tmplout);
                        }
                    }
                });
            });
        }
        else {
            res.send(req.query);
        }
    };

    this.reloadjson = function(req, res) {
        sqlarray = requireNew('./fmdsql.json');
        res.send('data reloaded');
    };

    this.reloadjs = function(req, res) {
        var reload = require('require-reload')(require);
        try {
            var rsrc = reload('../js/'+req.params.source);
            rsrc.sdata(res,req.query);
        } catch (e) {
            res.send("Failed to reload js! Error: ", e);
        }
    };
    
    this.blog = function(req, res) {
        var sqlite3 = require('sqlite3');
        var pebble = new sqlite3.Database('localdata/pebble.db');
        var html = '';
        pebble.all("SELECT * FROM blogs", function(err, rows) {
            if (err){
                console.log(err);
                res.status(500);
            } else {
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    html += row.title;
                }
                res.send(html);
            }
        });
        pebble.close();
    };
    
    this.bloggerWhat = function(req, res) {
        //Note: /blogger:what with /blogger/hello?id=1&world=2
        //      would return req.params.what = hello
        //                   req.query.id = 1

        var sqlite3 = require('sqlite3');
        var pebble = new sqlite3.Database('localdata/pebble.db');
        pebble.all("SELECT title as pebbleTitle, body as pebbleBody FROM blogs where id = " + req.query.id, function(err, rows) {
            if (err){
                console.log(err);
                res.status(500);
            } else {
                if (rows.length > 1) { console.log('dbious: blogger id duplicated'); }
                //var blogout = '[['+rows[0].pebbleTitle+'],['+rows[0].pebbleBody+']]';
                var showdown  = require('showdown');
                var converter = new showdown.Converter();
                rows[0]['pebbleHtml'] = converter.makeHtml('#'+rows[0].pebbleTitle+'\n'+rows[0].pebbleBody);
                res.send(rows[0]);
            }
        });
        pebble.close();
    };

    this.v2 = function(req, res) {
      res.render(req.params.source, { title: 'Hey Hey Hey!', message: 'Yo Yo'});
    };
    
}

module.exports = new fmdata();