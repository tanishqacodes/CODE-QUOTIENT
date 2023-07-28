const express = require("express");
const fs = require("fs");
const session = require("express-session");
const exp = require("constants");
const { emit } = require("process");

const app = express();

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "seekret",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }, //localhost pe fatt jaayega
  })
);

let usenramee;

function readUserData(callback) {
  fs.readFile("users.json", "utf-8", function (err, data) {
    if (err) {
      console.log("ERROR:" + err);
      callback(err, null);
    } else {
      {
        const users = JSON.parse(data);
        callback(null, users);
      }
    }
  });
}

function writeUserData(users) {
  fs.writeFile("./users.json", users, (err) => {
    if (err) {
      console.log("ERROR WRITING FILE!!");
    }
  });
}

function removeUser(email) {
  readUserData((err, users) => {
    if (err) {
      console.log(err);
      return;
    }
    const updatedUsers = users.filter((user) => user.email != email);
    writeUserData(JSON.stringify(updatedUsers));
  });
}

function addNewUser(username, email, password) {
  newUser = {
    username,
    email,
    password,
  };
  readUserData((err, users) => {
    if (err) {
      console.log("ERROR READING FILE!");
    } else {
      users.push(newUser);
      writeUserData(JSON.stringify(users));
    }
  });
}

app.get("/", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
    return;
  }
  res.sendFile(__dirname + "/Views/dashboard.html");
});

app.get("/login", (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect("/");
    return;
  }
  res.sendFile(__dirname + "/Views/login.html");
});
// app.get("/dashboard", (req, res) => {
//   res.sendFile(__dirname + "/login-service-views/dashboard.html");
// });

app.post("/login", (req, res) => {
  readUserData((err, users) => {
    if (err) {
      console.log("ERROR READING FILE!");
      return;
    }
    for (let user of users) {
      if (
        user.password === req.body.password.trim() &&
        user.email === req.body.email.trim()
      ) {
        req.session.isLoggedIn = true; //flag add krdia
        req.session.email = req.body.email;
        req.session.username = user.username;
        res.redirect("/");
        return;
      }
    }
    res.redirect("/invalid");
  });
});

app.get("/style/style.css",(req,res)=>{
    res.sendFile(__dirname + "/Views/style/style.css");
});

app.get("/Script/script.js",(req,res)=>{
    res.sendFile(__dirname + "/Views/Scripts/script.js");
});


app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/Views/signup.html");
});

app.post("/create_account", (req, res) => {
  readUserData((err, users) => {
    if (
      req.body.username.trim() !== "" &&
      req.body.email.trim() !== "" &&
      req.body.password.trim() !== ""
    ) {
      if (err) {
        console.log(err);
        return;
      } else {
        for (let user of users) {
          if (user.email.toLowerCase() === req.body.email.toLowerCase()) {
            res.send(
              `<h1 >USER ALREADY EXISTS!</h1> <br> <hr> <br> <a href="/login">Click Here to Login</a>`
            );
            return;
          }
        }

        addNewUser(
          req.body.username,
          req.body.email.toLowerCase(),
          req.body.password
        );
        res.redirect("/login");
      }
    } else {
      res.redirect("/signup");
    }
  });
});

app.delete("/logout", (req, res) => {
  req.session.isLoggedIn = false;
  // removeUser(req.session.email);
  res.sendStatus(200);
});

app.get("/getusername", (req, res) => {
  res.json(JSON.stringify(req.session.username));
});

app.get("/invalid", (req, res) => {
  res.sendFile(__dirname + "/Views/invalid.html");
});

app.listen(3000, () => {
  console.log("Listening on Port 3000");
});
