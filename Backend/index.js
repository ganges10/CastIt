const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config()

let MongoClient = require('mongodb').MongoClient;


 app.get("/movie/cast",function(req,res){
   var q = req.query.q;
   MongoClient.connect(process.env.uri, function(err, client){
     if(err) throw err;
     let db = client.db('castit');
     db.collection("MovieData").aggregate([
      {
        '$search': {
          'index': 'cast',
          'text': {
            'query': q,
            'path': {
              'wildcard': '*'
            }
          }
        }
      }
    ]).limit(10).toArray(function(err, result){
       if(err) throw err;
       res.json(result);
       client.close();
    });
})
})

app.get("/movie/character",function(req,res){
  var q = req.query.q;
  MongoClient.connect(process.env.uri, function(err, client){
    if(err) throw err;
    let db = client.db('castit');
    db.collection("MovieData").aggregate([
      {
        '$search': {
          'index': 'character',
          'text': {
            'query': q,
            'path': {
              'wildcard': '*'
            }
          }
        }
      }
    ]).limit(10).toArray(function(err, result){
      if(err) throw err;
      res.json(result);
      client.close();
   });
})
})


app.get("/movie/director",function(req,res){
  var q = req.query.q;
  MongoClient.connect(process.env.uri, function(err, client){
    if(err) throw err;
    let db = client.db('castit');
    db.collection("MovieData").aggregate([
      {
        '$search': {
          'index': 'director',
          'text': {
            'query': q,
            'path': {
              'wildcard': '*'
            }
          }
        }
      }
    ]).limit(10).toArray(function(err, result){
      if(err) throw err;
      res.json(result);
      client.close();
   });
})
})


const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`active port : ${port}`);
});





