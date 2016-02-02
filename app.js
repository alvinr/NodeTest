'use strict';

// var couchbase = require('couchbase');
var express =  require('express');
var uuid = require('uuid');
var cluster2 = require('cluster');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
// var cluster = new couchbase.Cluster('couchbase://couchbase-8091.service.consul');
// var bucket = cluster.openBucket('default');

// var HOST = 'mongodb:/mongo.service.consul:27017';
var HOST = 'mongodb://localhost:27017';
var DB;

MongoClient.connect(HOST, function(err, db) {
  if(err) throw err;
  console.log("Connected correctly to server");
  DB = db;
});

var Count = 0;

if(cluster2.isMaster) {
    var numWorkers = 8;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for(var i = 0; i < numWorkers; i++) {
        cluster2.fork();
    }

    cluster2.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster2.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster2.fork();
    });
} else {

  var app = require('express')();

app.get('/api/mongodb-perf', function (req, res) {

  var CollectData = false;
  Count+=1;
  if(Count % 1000 == 0)
  {
    CollectData = true;
    var time = process.hrtime();

  }
  var Id = '00000bc2-c122-11e5-81ff-97058a781c2b';
// ******************************************************
  // bucket.get(Id, function (err) {
  //   if (err) {
  //     res.statusCode = 404;
  //     res.send('error took place');
  //   } else {
  //     if(CollectData === true)
  //     {
  //       var diff = process.hrtime(time);
  //      console.log('get: ' + diff[1]/1000000);
  //     }
  //     res.statusCode = 200;
  //     res.send('OK');
  //   }
  // });
  // ******************************************************


  var findObj = function(db, callback) {
    var o_id = new ObjectId("V¯â¨\fá\u001a\u0000å\u0015");
     var cursor =db.collection('default').find({"_id": o_id});
    //  console.log(cursor);
    //  callback();
     cursor.each(function(err, doc) {
       assert.equal(err, null);
      if (doc != null) {
        if(CollectData === true)
           {
            //  console.dir(doc);
             var diff = process.hrtime(time);
            console.dir('get: ' + diff[1]/1000000);
           }
      }
      else {
         callback();
      }
     });
  };

findObj(DB, function(){
  res.statusCode = 200;
  res.send("OK")
  DB.close();
});

});

app.post('/api/mongodb-perf', function(req, res){
  // console.log(req);
  // var start = new Date().getMilliseconds();
  var CollectData = false;
  if(Count % 1000 == 0)
  {
    CollectData = true;
    var time = process.hrtime();

  }
  var randomData = {
	"_typeId": "00000000000000000000000000000003",
	"_isOverride": true,
	"name": {
		"_isOverridden": true,
		"_baseValue": "_k",
		"_capsuleValue": "z9"
	},
	"caption": {
		"_isOverridden": true,
		"_baseValue": "ze",
		"_capsuleValue": "Yl"
	},
	"values": [{
		"_objectId": "872c63f7-17a0-4b3c-9445-8c91cd8df70a",
		"_typeId": "10000000000000000000000000000002",
		"_isOverride": false,
		"_ownedByEditing": false,
		"_isMoved": false,
		"store": {
			"_isOverridden": true,
			"_baseValue": "FZ",
			"_capsuleValue": "on"
		},
		"display": {
			"_isOverridden": true,
			"_baseValue": null,
			"_capsuleValue": "N4"
		}
	}, {
		"_objectId": "93831ec3-b17e-40d6-b615-3c94f7ea451e",
		"_typeId": "10000000000000000000000000000002",
		"_isOverride": true,
		"_ownedByEditing": false,
		"_isMoved": true,
		"store": {
			"_isOverridden": true,
			"_baseValue": "tg",
			"_capsuleValue": "zX"
		},
		"display": {
			"_isOverridden": false,
			"_baseValue": null,
			"_capsuleValue": "bH"
		}
	}, {
		"_objectId": "668d0224-af09-4120-be78-38d497bd2450",
		"_typeId": "10000000000000000000000000000002",
		"_isOverride": false,
		"_ownedByEditing": false,
		"_isMoved": false,
		"store": {
			"_isOverridden": false,
			"_baseValue": "X1",
			"_capsuleValue": "KE"
		},
		"display": {
			"_isOverridden": false,
			"_baseValue": null,
			"_capsuleValue": "Rk"
		}
	}, {
		"_objectId": "fe7517b7-8a05-487e-9a7e-61ab69242a73",
		"_typeId": "10000000000000000000000000000002",
		"_isOverride": true,
		"_ownedByEditing": true,
		"_isMoved": false,
		"store": {
			"_isOverridden": true,
			"_baseValue": "WJ",
			"_capsuleValue": "nv"
		},
		"display": {
			"_isOverridden": false,
			"_baseValue": null,
			"_capsuleValue": "rj"
		}
	}, {
		"_objectId": "ae73afa2-1bf8-4aa8-9c43-95746f81fe0b",
		"_typeId": "10000000000000000000000000000002",
		"_isOverride": false,
		"_ownedByEditing": true,
		"_isMoved": true,
		"store": {
			"_isOverridden": true,
			"_baseValue": "a4",
			"_capsuleValue": "s0"
		},
		"display": {
			"_isOverridden": false,
			"_baseValue": null,
			"_capsuleValue": "dW"
		}
	}, {
		"_objectId": "f93aac27-5ca1-4a34-9f32-765f30480b88",
		"_typeId": "10000000000000000000000000000002",
		"_isOverride": true,
		"_ownedByEditing": false,
		"_isMoved": true,
		"store": {
			"_isOverridden": true,
			"_baseValue": "jk",
			"_capsuleValue": "G9"
		},
		"display": {
			"_isOverridden": true,
			"_baseValue": null,
			"_capsuleValue": "CD"
		}
	}, {
		"_objectId": "a62ce47b-f107-4962-afc3-3cb2050cee69",
		"_typeId": "10000000000000000000000000000002",
		"_isOverride": false,
		"_ownedByEditing": true,
		"_isMoved": true,
		"store": {
			"_isOverridden": false,
			"_baseValue": "Y8",
			"_capsuleValue": "rl"
		},
		"display": {
			"_isOverridden": false,
			"_baseValue": null,
			"_capsuleValue": "WE"
		}
	}, {
		"_objectId": "6db7dbd5-f0fd-4949-b9f5-14548085c983",
		"_typeId": "10000000000000000000000000000002",
		"_isOverride": true,
		"_ownedByEditing": false,
		"_isMoved": false,
		"store": {
			"_isOverridden": false,
			"_baseValue": "HK",
			"_capsuleValue": "Pm"
		},
		"display": {
			"_isOverridden": true,
			"_baseValue": null,
			"_capsuleValue": "uO"
		}
	}, {
		"_objectId": "ed5c6656-5219-4523-b1f6-2eecf845a234",
		"_typeId": "10000000000000000000000000000002",
		"_isOverride": false,
		"_ownedByEditing": true,
		"_isMoved": true,
		"store": {
			"_isOverridden": false,
			"_baseValue": "Wy",
			"_capsuleValue": "H0"
		},
		"display": {
			"_isOverridden": true,
			"_baseValue": null,
			"_capsuleValue": "tw"
		}
	}],
	"order": {
		"_isOverridden": true,
		"_baseValue": "Bv",
		"_capsuleValue": "Pg"
	}
};

  var Id = uuid.v1();
  Count = Count +1;
    // bucket.upsert(Id, randomData, function(err) {
    //   if(err){
    //    res.statusCode = 500;
    //    res.send('error took place');
    //  } else {
    //    if(CollectData === true)
    //    {
    //      var diff = process.hrtime(time);
    //     //  var end = new Date().getMilliseconds();
    //     //  var time = parseFloat(end - start);
    //     console.log('post ' + diff[1]/1000000);
    //     //  console.log(time.toFixed(7));
    //
    //    }
    //    res.statusCode = 201;
    //    res.send('OK');
    //  }
    // });

    var insertDocument = function(db, callback) {
      // console.log('Id ', Id);
      db.collection("default").insertOne(randomData, function(err, result) {
        if(err){
          assert.equal(err, null);
        } else {
          if(CollectData === true)
             {
               var diff = process.hrtime(time);
              console.log('post ' + diff[1]/1000000);
             }
             callback(result);
        }

      });
    };

    insertDocument(DB, function(result){
      res.statusCode = 201;
      res.send("OK")
      DB.close();
    });

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

}
