// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json()); // for parsing application/json

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.listen(3000, function() {
    console.log("Server started on port 3000");
});

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, *"
    );
    next();
  });

mongoose.connect('mongodb://localhost:27017/GKC', {useNewUrlParser : true});
//////////////////////////////// CONNECTION ESTABLISHED  //////////////////////////////////////

// Schema of Note
const noteSchema = new mongoose.Schema ({
    email_id : String,
    title : String,
    content : String
})

const Note = mongoose.model("Note", noteSchema);

// const note = new Note ({
//     email : "abcd@gmail.com",
//     title : "Apple",
//     data : "Hi I am apple"
// })

// note.save();

// console.log("note has been saved");

// Schema of Auth
const authSchema = new mongoose.Schema ({
    email : String,
    password : String
})

const Auth = mongoose.model("Auth", authSchema);

// const auth = new Auth ({
//     email : "abcd@gmail.com",
//     password : "abcd"
// })

// auth.save();



//////////////////////////////// AUTH  //////////////////////////////////////

app.route('/auth')

.get(function(req, res){
    Auth.find(function(err, foundAuths){
        if(!err){
            console.log("Success GET /auth request", foundAuths);
            res.send(foundAuths);
        }
        else{
            console.log("Error GET /auth request", err);
            res.send(err);
        }
        
    });
});

.post(function(req, res){

    const newUser = new Auth({
        email : req.body.email,
        password : req.body.password
    })

    newUser.save(function(err){
        if(err){
            console.log("Error while POST /auth : ", newNote, err);
            res.send(err);
        }
        else{
            console.log("Succes POST /auth : ", newUser);
            res.send("Success");
        }
    })
})

.delete(function(req, res){
    Auth.deleteMany(function(err){
        if(!err){
            console.log("Success DELETE /auth");
            res.send("Success");
        }
        else {
            console.log("Error DELETE /auth ", err);
            res.send(err);
        }
    })
})

//////////////////////////////// AUTH - SPECIFIC ID  //////////////////////////////////////

app.route('/auth/:uniqueId')

.get(function(req, res){
    Auth.findOne({_id : req.params.uniqueId}, function(err, foundAuth){
        if(!err){
            console.log("Success GET /auth/uniqueId : ", uniqueId, foundAuth);
            res.send(foundAuth);
        }
        else{
            console.log("Error GET /auth/uniqueId : ", uniqueId, err);
            res.send(err);
        }
    })
})

.delete(function(req, res){
    Auth.deleteOne({_id : req.params.uniqueId},
        function(err)
        {
            if(!err){
                console.log("Success DELETE /auth/uniqueId", uniqueId);
                res.send("Success");
            }
            else
            {
                console.log("Error DELETE /auth/uniqueId", uniqueId);
                res.send(err);
            }
        }
    )
})

//////////////////////////////// NOTES //////////////////////////////////////

app.get('/notes', function(req, res){
    Note.find(function(err, foundNotes){
        if(!err){
            console.log("Success GET /notes", foundNotes);
            res.send(foundNotes);
        }
        else{
            console.log("Error while GET /notes", err);
            res.send(err);
        }    
    })
})

app.post('/notes', function(req, res){  
    const newNote = new Note({
        email : req.body.email,
        title : req.body.title,
        content : req.body.content
    })

    newNote.save(function(err){
        if(err){
            console.log("Error POST /notes", newNote, err);
            res.send(err);
        }
        else{
            console.log("Success POST /notes", newNote);
            res.send("Success");
        }
    })
})

app.delete('/notes', function(req, res){

    Note.deleteMany(function(err){
        if(!err){
            console.log("All notes deleted");
            res.send("Success");
        }
        else {
            console.log("Error while deleting all nodes", err);
            res.send(err);
        }
    })
})

//////////////////////////////// NOTES - SPECIFIC ID  //////////////////////////////////////

app.route('/notes/:uniqueId')

.get(function(req, res){

    Note.findOne({_id : req.params.uniqueId}, function(err, foundNote){
        if(!err){
            console.log("Success GET /notes/uniqueId ", uniqueId, foundNote);
            res.send(foundNote);
        }
        else{
            console.log("Error GET /notes/uniqueId ", uniqueId, err);
            res.send(err);
        }
    })
})

.delete(function(req, res){
    Note.deleteOne({_id : req.params.uniqueId},function(err){
            if(!err){
                console.log("Success DELETE /notes/uniqueId", uniqueId);
                res.send("Success");
            }
            else
            {
                console.log("Error DELETE /notes/uniqueId", uniqueId);
                res.send(err);
            }
        });
});