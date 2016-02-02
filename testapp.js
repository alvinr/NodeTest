'use strict';

var couchbase = require('couchbase');

var cluster = new couchbase.Cluster('couchbase://couchbase-8091.service.consul');
var bucket = cluster.openBucket('default');

var totalDocs = 10000;
var totalOps = 10000000;
var opsGroups = 1000;
var execedOps = 0;


var randomData = '';
for (var j = 0; j < 2048; j++) {
  randomData += 'a';
}

// Preload
function step1() {
  var completed = 0;
  var start = new Date().getTime();
  for (var i = 0; i < totalDocs; ++i) {
    bucket.upsert('test'+i, randomData, function(err) {
      completed++;
      if (completed === totalDocs) {
        var end = new Date().getTime();
        var time = end - start;
        console.log('avg time to post', time/totalDocs)
        step2();
      }
    });
  }
}

function step2() {
  var start2 = new Date().getTime();
  var doOne = function () {
    execedOps++;
    if (execedOps > totalOps) {
      var end2 = new Date().getTime();
      var time2 = end2 - start2;
      console.log('avg time to get', time2/totalOps)
      step3();
    }

    // Pick a random document to affect
    var randId = Math.floor(Math.random() * totalDocs);
    var randDocId = 'test' + randId;

    // 50/50 split of gets/sets
    if (Math.random() < 0.9999999) {
      // Perform a get operation to the rand
      bucket.get(randDocId, function (err) {
        doOne();
      });
    } else {
      bucket.upsert(randDocId, randomData, function(err) {
        doOne();
      });
    }
  };

  for (var i = 0; i < opsGroups; ++i) {
    doOne();
  }
}

function step3() {
  process.exit(0);
}

step1();
return;
