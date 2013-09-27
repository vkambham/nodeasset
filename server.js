var express= require('express'),
    path = require('path'),
    http = require('http');
var asset = require('./routes/assets');


var app= express();

app.configure(function(){
   app.set('port',process.env.PORT || 3000);
   app.use(express.logger('dev'));
   app.use(express.bodyParser());
   app.use(express.static(path.join(__dirname,'public')));
});

app.get('/assets',asset.findAll );

app.get('/location/assets/:loc', asset.findByLocation);

app.get('/assets/:id', asset.findById);


app.post('/assets', asset.addAsset);

app.put('/assets/:id',asset.updateAsset);

app.delete('/assets/:id',asset.deleteAsset);

app.listen(3000);
console.log('Listening on port 3000');
