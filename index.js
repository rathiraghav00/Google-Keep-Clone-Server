// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

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

var cnt_notes = 0;
var cnt_emails = 0;

// Schema of Note
const noteSchema = new mongoose.Schema ({
    note_id : Number,
    email : String,
    title : String,
    data : String
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
    auth_id : Number,
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
app.get('/auth', function(req, res){
    Auth.find(function(err, foundAuths){
        res.send(foundAuths);
    });
});

app.post('/auth', function(req, res){

    const newUser = new Auth({
        auth_id : cnt_emails++,
        email : req.query.email,
        password : req.query.password
    })

    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("New User saved i.e email and password");
            res.send("Success");
        }
    })
})

app.delete('/auth', function(req, res){
    Auth.deleteMany(function(err){
        if(!err){
            console.log("Succesfully deleted all the athorisation details");
        }
        else {
            console.log(err);
        }
    })
})

//////////////////////////////// AUTH - SPECIFIC ID  //////////////////////////////////////

app.route('/auth/:authEmail')

.get(function(req, res){
    Auth.findOne({email : req.params.authEmail}, function(err, foundAuth){
        if(!foundAuth){
            res.send("Invalid Query : No such record in auth found");
        }
        else{
            res.send(foundAuth);
        }
    })
})

.delete(function(req, res){
    Auth.deleteOne(
        {email : req.params.authEmail},
        function(err)
        {
            if(!err){
                res.send("Successfully Deleted");
            }
            else
            {
                res.send("Invalid Query : No such record exists");
            }
        }
    )
})

//////////////////////////////// NOTES //////////////////////////////////////
app.get('/notes', function(req, res){
    Note.find(function(err, foundNotes){
        res.send(foundNotes);
    })
})

app.post('/notes', function(req, res){

    const newNote = new Note({
        note_id : cnt_notes++,
        email : req.query.email,
        title : req.query.title,
        data : req.query.data
    })

    newNote.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("New Note Saved");
            res.send("Success");
        }
    })
})

app.delete('/notes', function(req, res){
    Note.deleteMany(function(err){
        if(!err){
            res.send("Success!");
        }
        else {
            res.send(err);
        }
    })
})

//////////////////////////////// NOTES - SPECIFIC ID  //////////////////////////////////////

app.route('/notes/:noteId')

.get(function(req, res){

    console.log(req.params.noteId);

    Note.findOne({note_id : req.params.noteId}, function(err, foundNote){
        if(!foundNote){
            res.send("Invalid Query : No such record in auth found");
        }
        else{
            res.send(foundNote);
        }
    })
})

.delete(function(req, res){
    Note.deleteOne({note_id : req.params.noteId},function(err){
            if(!err){
                res.send("Successfully Deleteds");
            }
            else
            {
                res.send("Invalid Query : No such record exists");
            }
        });
});