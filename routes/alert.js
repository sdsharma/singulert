'use strict';

const Joi = require('joi');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var dburl = 'mongodb://localhost:27017/singulert';

const API_BASE_PATH = '/api/alert';

const routes = [];
function currentDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) {
        dd='0'+dd;
    } 

    if(mm<10) {
        mm='0'+mm;
    } 
    today = yyyy+'-'+mm+'-'+dd;
    return today;
}
// GET /api/fit
routes.push({
    method: 'GET',
    path: API_BASE_PATH,
    config: {
        auth: false,
        handler: function (request, reply) {
            MongoClient.connect(dburl, function(err, db) {
              assert.equal(null, err);
              reply("Connected successfully to server");
              db.close();
            });
        },
        tags: ['api']
    }
});

routes.push({
    method: 'GET',
    path: API_BASE_PATH + '/authorize',
    config: {
        auth: false,
        handler: function (request, reply) {
            reply(true);
        },
        tags: ['api']
    }
});

routes.push({
    method: 'POST',
    path: API_BASE_PATH + '/checkuser',
    config: {
        auth: false,
        handler: function (request, reply) {
            MongoClient.connect(dburl, function(err, db) {
              if(db.getCollection(request.payload.username).exists()){
                reply(false);
              }
              else{
                reply(true);
              }
              db.close();
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
            });

              db.close();
            });
        },
        tags: ['api'],
        validate: {
            params: {
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
            params: {
              username: Joi.string().required(),
              password: Joi.string().required()
            }
        }
    }
});

routes.push({
    method: 'POST',
    path: API_BASE_PATH + '/userscore',
    config: {
        auth: false,
        handler: function (request, reply) {
            MongoClient.connect(dburl, function(err, db) {
              var collection = db.collection(request.payload.username);
              collection.insert({date: new Date(), score: request.payload.score});
              db.close();
            });
        },
        tags: ['api'],
        validate: {
            params: {
              username: Joi.string().required(),
              score: Joi.number().integer().required()
            }
        }
    }
});

module.exports = routes;
