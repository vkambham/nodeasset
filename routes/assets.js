var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017,{auto_reconnect: true});
db = new Db('assetdb',server);

db.open(function(err,db) {
   if(!err) {
       console.log("Connected to 'assetdb' database");
       db.collection('assets',{strict:true},function(err, collection) {
          if(err) {
             console.log("The assets collection doesn't exist. Creating one now.");
             populateDB();
          }
       });
   }
});

exports.addAsset = function(req, res) {
   var asset = req.body;
   console.log('Adding asset: '+JSON.stringify(asset));

   db.collection('assets', function(err, collection) {

      collection.insert(asset, {safe:true}, function(err, result) {
          if (err) {
             res.send({'error': 'An error has occured'});
          }else {
             console.log('Success: '+ JSON.stringify(result[0]));
             res.send(result[0]);
	  }
      });
     
   });

}

exports.updateAsset = function(req, res){
    var id = req.params.id;
    var asset = req.body;

    console.log('Updating asset: '+ id);
    console.log(JSON.stringify(asset));
    db.collection('assets', function(err, collection) {
      collection.update({'_id':new BSON.ObjectID(id)},asset,{safe:true}, function(err,result) {
        if (err){
           console.log('Error updating asset: '+err);
           res.send({'error':'An error has occured'});
        }else{
           console.log(''+result+' document(s) updated');
           res.send(asset);
        }
      });
    });
}

exports.deleteAsset = function(req,res) {
    var id = req.params.id;
    console.log('Deleting asset: '+id);
    db.collection('assets', function(err,collection) {
        collection.remove({'_id':new BSON.ObjectID(id)},{safe:true}, function(err,result){
            if (err){
                res.send({'error':'An error has occurred - '+err});
            }else{
                console.log(''+result+' document(s) deleted');
                res.send(req.body);
            }
      });
    });

}

exports.findAll = function(req,res) {
      db.collection('assets', function(err, collection) {
         collection.find().toArray(function(err,items) {
             res.send(items);
         });      
      });
}

exports.findByLocation = function(req,res){
    var loc = req.params.loc;
    var body='';
    req.setEncoding('utf8');
    console.log('Retrieving Assets in '+loc);
    db.collection('assets',function(err,collection) {
           collection.find({'location':loc}).toArray(function(err,items) {
               console.log('Found items');
               res.send(items);
           });
//         var stream = collection.find({'location':'California'}).stream();
//         stream.on("data", function(err, item){
     
//             console.log('Found data '+ item.length);
//             body += item;
            // res.send(item);
//         });
//         stream.on("end", function(){
//             try {
//                 console.log('found end');
//                 var data = JSON.parse(body);
//             } catch (err) {
//                 res.statusCode = 400;
//                 return res.end('error: '+err.message);
//             }
//             res.write(typeof data);
//             res.end();
//         });

         //collection.find({'location':loc}, function(err,items) {
             
         //    res.send(items.toArray);
         //});
    });
}
exports.findById = function(req,res) {
      var id = req.params.id;
      console.log('Retrieving Asset : '+id);
      db.collection('assets',function(err, collection) {
         collection.findOne({'_id':new BSON.ObjectID(id)}, function(err,item) {
            res.send(item);
         });

      });
}


/*  Populate data */
var populateDB = function() {
   var assets = [
   {
        name:"My Laptop",
        make:"HP",
        model:"Elitebook 2560p",
        AssignedTo:"10538683"
   },
   {
        name:"my phone",
        make:"Apple",
        model:"IPhone 5",
        AssignedTo:"10538683"
   }];

   db.collection('assets', function(err, collection) {
      collection.insert(assets, {safe:true}, function(err,result){});
   });
};
