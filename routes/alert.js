'use strict';

const Joi = require('joi');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
const rp = require('request-promise')
var dburl = 'mongodb://localhost:27017/singulert';

const API_BASE_PATH = '/api/alert';

const routes = [];

routes.push({
    method: 'POST',
    path: API_BASE_PATH + '/checkuser',
    config: {
        auth: false,
        handler: function (request, reply) {
            MongoClient.connect(dburl, function(err, db) {
                db.listCollections({name: request.payload.username}).toArray(function(err, items) {
                    if(items.length > 0){
                        reply(false);
                    }
                    else{
                        reply(true);
                    }
                    db.close();
                }); 
            });
        },
        tags: ['api'],
        validate: {
            payload: {
              username: Joi.string().required()
            }
        }
    }
});

routes.push({
    method: 'POST',
    path: API_BASE_PATH + '/createuser',
    config: {
        auth: false,
        handler: function (request, reply) {
            MongoClient.connect(dburl, function(err, db) {
                var collection = db.collection('users');
                collection.insert({username: request.payload.username, score: request.payload.password});
                db.createCollection(request.payload.username, function(err, collection){
                   if (err) throw err;
                    console.log("Created Collection: " + request.payload.username);
                    db.close();
                });
               
            });
        },
        tags: ['api'],
        validate: {
            payload: {
              username: Joi.string().required(),
              password: Joi.string().required()
            }
        }
    }
});

routes.push({
    method: 'POST',
    path: API_BASE_PATH + '/login',
    config: {
        auth: false,
        handler: function (request, reply) {
            MongoClient.connect(dburl, function(err, db) {
            var collection = db.collection('users');
            var userData = collection.findOne({username: request.payload.username});
            if(request.payload.password == userData.password){
                reply(true);
            }
            else{
                reply(false);
            }

              db.close();
            });
        },
        tags: ['api'],
        validate: {
            payload: {
              username: Joi.string().required(),
              password: Joi.string().required()
            }
        }
    }
});

routes.push({
    method: 'POST',
    path: API_BASE_PATH + '/userprofile',
    config: {
        auth: false,
        handler: function (request, reply) {
            MongoClient.connect(dburl, function(err, db) {
              var collection = db.collection('userdata');
              var url = "https://open-ic.epic.com/FHIR/api/FHIR/DSTU2/Patient/Tuh-qbjlmtLPCn20yjzYj8qKGeIRWOipYwfdBc9b3U3AB";
              var options = {
                uri: url,
                json: true
              }
              return rp(options).then(
                function(data){
                    data.username = request.payload.username;
                    collection.insert(data);
                    db.close();
                    reply(data);
                }
              );
            });
        },
        tags: ['api'],
        validate: {
            payload: {
              username: Joi.string().required()
            }
        }
    }
});

routes.push({
    method: 'GET',
    path: API_BASE_PATH + '/userdata/{username}',
    config: {
        auth: false,
        handler: function (request, reply) {
            MongoClient.connect(dburl, function(err, db) {
              var collection = db.collection('userdata');
              var value = collection.findOne({username: request.params.username});
              reply(value);
            });
        },
        tags: ['api'],
        validate: {
            params: {
                username: Joi.string().required()
            }
        }
    }
});

module.exports = routes;
