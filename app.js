var app = require('express')();
var Busboy = require('busboy');
var fs = require('fs');

app.get("/", function(req, res){
  res.sendfile(__dirname + '/views/index.html');
});

app.post("/", function(req, res){
  var busboy = new Busboy({ headers: req.headers });
  var saveTo;

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    saveTo = __dirname + '/upload/' + filename;
    file.pipe(fs.createWriteStream(saveTo));
  });

  var fields = {};
  busboy.on('field', function(name, val) {
    fields[name] = val;
  });

  busboy.on('finish', function() {
    console.log("Send " + saveTo +" to " + fields.email);
    console.log(fields);
    res.writeHead(303, { Connection: 'close', Location: '/' });
    res.end();
  });
  req.pipe(busboy);
})

app.listen(3000);
