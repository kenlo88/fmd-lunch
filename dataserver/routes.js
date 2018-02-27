var fmdata = require('./fmdata');
var path = require('path');
var forever = require('forever');

module.exports = {
  configure: function(app) {
    app.get('/fmdata/:source/', function(req, res) {
      fmdata.get(req, res);
    });
    app.put('/fmdata/:source/', function(req, res) {
      fmdata.update(req, res);
    });
    app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname + '/../index.html'));
    });
    app.get('/template/:source/', function(req, res) {
      fmdata.gettmpl(req, res);
    });
    app.get('/reloadjson/', function(req, res) {
      fmdata.reloadjson(req, res);
    });
    app.get('/reloadjs/:source/', function(req, res) {
      fmdata.reloadjs(req, res);
    });
    app.get('/blog/', function(req, res) {
      fmdata.blog(req, res);
    });
    app.get('/blogger/:what', function(req, res) {
      fmdata.bloggerWhat(req, res);
    });
    app.get('/forever/list', function (req, res) {
      forever.list(true, function (err, processes) {
        if (err) {res.send(err)}
        if (processes) {
          var fout = `<html>
                      <head>
                        <script type="text/javascript" src="/jquery/jquery.min.js"></script>
                        <link rel="stylesheet" href="/jquery/fancybox/source/jquery.fancybox.css?v=2.1.5" type="text/css" media="screen" />
                        <script type="text/javascript" src="/jquery/fancybox/source/jquery.fancybox.pack.js?v=2.1.5"></script>
                        <script type="text/javascript">
                          $(".text").fancybox();
                        </script>
                      </head>
                      <h3>Forever processes running</h3>
                      <table><tr><th>uid</th><th>scipt</th><th>uptime</th></tr>\n`;
          processes.split('\n').forEach(function (line, index) {
            //fout = '<p>' + fout + line.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '') + '</p>';
            //line.split(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/).forEach(function (item) {
            //  fout = '<p>' + fout + item + '</p>';
            //})
            if (index > 0) {
              var itemarray = line.split(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/);
              fout = fout + '<tr><td>' + itemarray[0] + '</td><td><a class="text fancybox.iframe" href=/fmdata/data802?src=' + itemarray[5] + '>' + itemarray[3] + '</td><td>' + itemarray[7]+ '</td></tr>\n';
            }
          });
          res.send(fout);
        }
        else {
          res.send('No forever processes running');
        }
      });
    });  
    app.get('/v2/:source', function(req, res) {
      fmdata.v2(req, res);
    });
  }
};