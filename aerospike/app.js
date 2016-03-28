// NODE API TEST
//
// CHANGES IN 2.0.1
//   -- Changed timing to be couchbase event specific.
//   -- Moved random data (~5k JSON Document) out of request listener
//   -- Moved instantiation of Express.  It was being instantiated twice, for every process.
//   -- Isolated stats collection between post and get operations, and included special
//       casing for 1st op, and interval average timing for all subsequent events.  Included
//       process identifier for each stats collection event.
//   -- Built a buffer for added id's.  GET operations shift id's from this array for each get operation.
//   -- Returned interval stats timings back over HTTP, along with errors
//   -- Included generic error sink for unhandled exceptions.
//   -- Removed unused package.
//   -- Included load test
//
// TO RUN:
//  [1] Include package.json file below
//  [2] npm install
//  [3] Change Couchbase cluster Connection string
//  [4] node app.js OR npm start
//  [5] To generate load, from ./node_modules/bin:
//    ./loadtest.js -c 20 --rps 200 -m POST http://localhost:3000/api/couchbase-perf
//
/*
 // package.json File, save and include separately
     {
     "name": "node_couch_test",
     "version": "2.0.1",
     "description": "API Test for clustered node environment writing to couchbase",
     "main": "app.js",
     "scripts": {
     "start": "node app.js"
     },
     "engines": {
     "node": "4.0.0"
     },
     "dependencies": {
     "cluster": "*",
     "couchbase": "^2.1.2",
     "express": "*",
     "request": "*",
     "assert": "*",
     "uuid":"*",
     "loadtest":"*"
     },
     "engines": {
     "node": "4.0.0"
     },
     "author": "",
     "license": "ISC"
     }
*/

'use strict';

// Imports
var aerospike = require('aerospike');
var client = aerospike.client({
  hosts: [
      { addr: "127.0.0.1", port: 3000 }
  ],
  log: {
      level: aerospike.log.INFO
  },
  policies: {
      timeout: argv.timeout
  }
});
//var couchbase = require('couchbase');
var uuid = require('uuid');
var cluster2 = require('cluster');
//var cluster = new couchbase.Cluster('couchbase://127.0.0.1');
//var bucket = cluster.openBucket('default');
var app = require('express')();

// Counters
var count = 0;
var countGet = 0;
var aggregateTime = 0;
var aggregateTimeGet = 0
var intervalCount = 0;
var intervalCountGet = 0;
var intervalBetweenStats = 1000;
var idBuffer = [];

// Setup Document to add
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

if (cluster2.isMaster) {
    var numWorkers = 8;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for (var i = 0; i < numWorkers; i++) {
        cluster2.fork();
    }

    cluster2.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster2.on('exit', function (worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster2.fork();
    });
} else {
  
    app.get('/api/aerospike-perf', function (req, res) {

        // Grab an id from the buffer, or use a generic if empty
        var id = (idBuffer.length > 0 ? idBuffer.shift() : '00000bc2-c122-11e5-81ff-97058a781c2b');
        // Grab Start Operation Time
        var d_startTime = process.hrtime();

        // Get from Aerospike
        var key = {
            ns:  "test",
            set: "adp",
            key: id
        };

        client.get(key, function (err, record, metadata, key) {

            // Check for Error
            if (err.code !== aerospike.status.AEROSPIKE_OK) {
                console.log("ERR:", err.message);
                res.statusCode = 404;
                res.send('ERR:', err.message);
            } else {

                //Operation Succeeded, calculate duration f
                var d_endTime = process.hrtime(d_startTime);
                d_endTime = d_endTime[1] / 1000000;

                // Print output if stats interval is correct
                if (countGet % intervalBetweenStats == 0) {

                    var trace_debug = '+------------------------------' + "\n";
                    trace_debug += '| GET /API/AEROSPIKE-PERF \n';
                    trace_debug += '| PROCESS:' + process.pid + "\n";
                    trace_debug += '| COUNT:' + countGet + "\n";

                    // Check to see if first operation.  Only useful in developer environment.
                    if (countGet == 0) {

                        // Print Timing for First Iteration;
                        trace_debug += '| EXECUTION TIME FIRST OPERATION:' + Math.round(d_endTime * 1000) / 1000 + " ms \n";
                        trace_debug += '+------------------------------' + "\n";
                    } else {

                        // Print Timing for interval average;
                        trace_debug += '| EXECUTION TIME AVG:' + Math.round((aggregateTimeGet / intervalCountGet) * 1000) / 1000 + " ms FOR " + intervalCountGet + " OPERATIONS \n";
                        trace_debug += '+------------------------------' + "\n";
                    }

                    // Output to console, clear intermediates
                    console.log(trace_debug);
                    aggregateTimeGet = 0;
                    intervalCountGet = 0;
                } else {

                    // Increment intermediates
                    intervalCountGet++;
                    aggregateTimeGet += d_endTime;
                    trace_debug = 'OK';
                }

                // Send Result back
                countGet++;
                res.statusCode = 200;
                res.send(trace_debug);
            }
        });
    });

    app.post('/api/aerospike-perf', function (req, res) {

        // Set ID for document to insert, add to buffer if not full
        var Id = uuid.v1();
        if (idBuffer.length < intervalCount)
            idBuffer.push(Id);

        // Grab Start Operation Time
        var d_startTime = process.hrtime();

        // Upsert to Aerospike
        var key = {
            ns:  "test",
            set: "adp",
            key: randDocId
        };

        client.put(key, randomData, function (err) {

            // Check for Error
            if ( err.code !== aerospike.status.AEROSPIKE_OK ) {
                console.log("ERR:", err.message);
                res.statusCode = 500;
                res.send('ERR:', err.message);
            } else {

                //Operation Succeeded, calculate duration f
                var d_endTime = process.hrtime(d_startTime);
                d_endTime = d_endTime[1] / 1000000;

                // Print output if stats interval is correct
                if (count % intervalBetweenStats == 0) {

                    var trace_debug = '+------------------------------' + "\n";
                    trace_debug += '| POST /API/AEROSPIKE-PERF \n';
                    trace_debug += '| PROCESS:' + process.pid + "\n";
                    trace_debug += '| COUNT:' + count + "\n";

                    // Check to see if first operation.  Only useful in developer environment.
                    if (count == 0) {

                        // Print Timing for First Iteration;
                        trace_debug += '| EXECUTION TIME FIRST OPERATION:' + Math.round(d_endTime * 1000) / 1000 + " ms \n";
                        trace_debug += '+------------------------------' + "\n";
                    }
                    else {

                        // Print Timing for interval average;
                        trace_debug += '| EXECUTION TIME AVG:' + Math.round((aggregateTime / intervalCount) * 1000) / 1000 + " ms FOR " + intervalCount + " OPERATIONS \n";
                        trace_debug += '+------------------------------' + "\n";
                    }

                    // Output to console, clear intermediates
                    console.log(trace_debug);
                    aggregateTime = 0;
                    intervalCount = 0;
                } else {

                    // Increment intermediates
                    intervalCount++;
                    aggregateTime += d_endTime;
                    trace_debug = 'OK';
                }

                // Send Result back
                count++;
                res.statusCode = 201;
                res.send(trace_debug);
            }
        });
    });

    app.listen(5000, function () {
        console.log('Example app listening on port 5000!');
    });

    process.on('uncaughtException', function (err) {
        var errOut = '+------------------------------' + "\n";
        errOut += '| UNHANDLED EXCEPTION' + "\n";
        errOut += '| PROCESS:' + process.pid + "\n";
        errOut += '| ERROR: err' + err + "\n";
        errOut += '+------------------------------' + "\n";
        console.log(errOut);
    });
}