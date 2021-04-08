// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.json()); // for parsing application/json

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

let port = process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}

app.use(express.static("public"));

app.listen(port, function () {
  
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, *"
  );
  next();
});

// Link to connection
const URL =
  "mongodb+srv://admin-raghav:raghav2710@cluster0.kulcz.mongodb.net/GKC";
mongoose.connect(URL, { useNewUrlParser: true });
//////////////////////////////// CONNECTION ESTABLISHED  //////////////////////////////////////

// Schema of Note
// Hi
const noteSchema = new mongoose.Schema({
  email_id: String,
  title: String,
  content: String,
});

const Note = mongoose.model("Note", noteSchema);

// const note = new Note ({
//     email : "abcd@gmail.com",
//     title : "Apple",
//     data : "Hi I am apple"
// })

// note.save();

// 

// Schema of Auth
const authSchema = new mongoose.Schema({
  email_id: String,
  password: String,
});

const Auth = mongoose.model("Auth", authSchema);

// const auth = new Auth ({
//     email : "abcd@gmail.com",
//     password : "abcd"
// })

// auth.save();

//////////////////////////////// AUTH  //////////////////////////////////////

app
  .route("/auth")

  .get(function (req, res) {
    Auth.find(function (err, foundAuths) {
      if (!err) {
        
        res.send(foundAuths);
      } else {
        
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    const newUser = new Auth({
      email_id: req.body.email_id || req.query.email_id,
      password: req.body.password || req.query.password,
    });

    newUser.save(function (err) {
      if (err) {
        
        res.send(err);
      } else {
        
        res.send("Success");
      }
    });
  })

  .delete(function (req, res) {
    Auth.deleteMany(function (err) {
      if (!err) {
        
        res.send("Success");
      } else {
        
        res.send(err);
      }
    });
  });

//////////////////////////////// AUTH - SPECIFIC ID  //////////////////////////////////////

app
  .route("/auth/:uniqueId")

  .get(function (req, res) {
    Auth.findOne({ email_id: req.params.uniqueId }, function (err, foundAuth) {
      if (!err) {
        
          "Success GET /auth/uniqueId : ",
          req.params.uniqueId,
          foundAuth
        );
        res.send(foundAuth);
      } else {
        
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Auth.deleteOne({ email_id: req.params.uniqueId }, function (err) {
      if (!err) {
        
        res.send("Success");
      } else {
        
        res.send(err);
      }
    });
  });

//////////////////////////////// NOTES //////////////////////////////////////

app.get("/notes", function (req, res) {
  Note.find(function (err, foundNotes) {
    if (!err) {
      
      res.send(foundNotes);
    } else {
      
      res.send(err);
    }
  });
});

app.post("/notes", function (req, res) {
  const newNote = new Note({
    email_id: req.body.email_id || req.query.email_id,
    title: req.body.title || req.query.title,
    content: req.body.content || req.query.content,
  });

  

  newNote.save(function (err) {
    if (err) {
      
      res.send(err);
    } else {
      
      res.send("Successesses");
    }
  });
});

app.delete("/notes", function (req, res) {
  Note.deleteMany(function (err) {
    if (!err) {
      
      res.send("Success");
    } else {
      
      res.send(err);
    }
  });
});

//////////////////////////////// NOTES - SPECIFIC ID  //////////////////////////////////////

app
  .route("/notes/:uniqueId")

  .get(function (req, res) {
    Note.find({ email_id: req.params.uniqueId }, function (err, foundNote) {
      if (!err) {
        
          "Success GET /notes/uniqueId ",
          req.params.uniqueId,
          foundNote
        );
        res.send(foundNote);
      } else {
        
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Note.deleteOne({ _id: req.params.uniqueId }, function (err) {
      if (!err) {
        
        res.send("Success");
      } else {
        
        res.send(err);
      }
    });
  });
