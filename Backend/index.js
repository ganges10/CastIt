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

app.get("/genre/similar",function(req,res){
  let resultList="";
  var spawn = require("child_process").spawn;
	
	var process = spawn('python',["./recommend.py",req.query.q]);

	process.stdout.on('data', function(data) {
		resultList=data.toString().replace('\r\n','').split(',');
    MongoClient.connect('mongodb://project:1234@cluster0-shard-00-00.frp8d.mongodb.net:27017,cluster0-shard-00-01.frp8d.mongodb.net:27017,cluster0-shard-00-02.frp8d.mongodb.net:27017/castit?ssl=true&replicaSet=atlas-exb9eg-shard-0&authSource=admin&retryWrites=true&w=majority', function(err, client){
      if(err) throw err;
      let db = client.db('castit');
      db.collection("MovieData").find({'$or':[
        {'Title':resultList[0]},
        {'Title':resultList[1]},
        {'Title':resultList[2]},
        {'Title':resultList[3]},
        {'Title':resultList[4]}
      ]}).toArray(function(err, result){
        if(err) throw err;
        res.json(result);
        client.close();
     });
  })

	} )
})


const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`active port : ${port}`);
});





