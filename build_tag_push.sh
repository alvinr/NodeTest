#!/bin/sh

#docker build -t couchbase-node-test-eight-8a -f dockerfile .

#docker tag couchbase-node-test-eight-8a:latest dockertr.es.ad.adp.com/couch-perf-test/ohcm_couchbase_noder_eightworkerssa_test:0.0.8

#docker push dockertr.es.ad.adp.com/couch-perf-test/ohcm_couchbase_noder_eightworkerssa_test:0.0.8

docker build -t mongo-node-test-eight-8 -f dockerfile .

docker tag mongo-node-test-eight-8:latest dockertr.es.ad.adp.com/mongo-perf-test/ohcm_mongo_noder_eightworkers_test:0.0.8

docker push dockertr.es.ad.adp.com/mongo-perf-test/ohcm_mongo_noder_eightworkers_test:0.0.8
