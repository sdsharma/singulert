'use strict';

const Joi = require('joi');
var FitbitApiClient = require("fitbit-node");
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var dburl = 'mongodb://localhost:27017/singularitydiabetes';

var client = new FitbitApiClient("227H7Z", "d9a1cd45ceb53e96d4b9eeac77af5c60");
const API_BASE_PATH = '/api/fit';

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
            reply(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'http://localhost:3000/api/fit/callback'));
        },
        tags: ['api']
    }
});

routes.push({
    method: 'GET',
    path: API_BASE_PATH + '/callback',
    config: {
        auth: false,
        handler: function (request, reply) {
            client.getAccessToken(request.query.code, 'http://localhost:3000/api/fit/callback').then(function (result) {
                var date = currentDate();
                client.get("/activities/date/" + date + ".json", result.access_token).then(function (results) {
                    reply(results[0]);
                });
            }).catch(function (error) {
                reply(false);
            });
        },
        tags: ['api']
    }
});

routes.push({
    method: 'POST',
    path: API_BASE_PATH + '/createuser',
    config: {
        auth: false,
        handler: function (request, reply) {
            MongoClient.connect(dburl, function(err, db) {
              if(db.getCollection(request.payload.username).exists()){
                reply(false);
              }
              else{
                db.createCollection(request.payload.username, function(err, collection){
                   if (err) throw err;
                    console.log("Created Collection: " + request.payload.username);
                });
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
