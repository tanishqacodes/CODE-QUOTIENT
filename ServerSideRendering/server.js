const fs = require("fs");
const express = require("express");
const session = require("express-session");
const app = express();

app.set("view engine", "ejs");

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// session trackinh ke liye
app.use(session({
    secret: "mainhibataungi",
    resave: false,
    saveUninitialized: true,
})
);

app.get("/", function (req, res) {
    if (!req.session.isLoggedIn) {
        res.redirect("/login");
        return;
    }
    res.render("dashboard.ejs",{username:req.session.username});
});

app.get("/login", function (req, res) {
    if (req.session.isLoggedIn) {
        res.redirect("/");
        return;
    }
    res.render("login.ejs");
});

app.post("/login", function (req, res) {
    readUserData((err, users) => {
        if (err) {
            console.log("error in reading file during login post");
            return;
        }
        for (let user of users) {
            if (user.password === req.body.password.trim() && user.email === req.body.email.trim()) {
                // user logged in ka flag to keep track
                req.session.isLoggedIn = true;
                req.session.email = req.body.email;
                req.session.username = user.username;
                res.redirect("/");
                return;
            }
        }
        res.redirect("/invalid");
    });
});

app.get("/signup", (req, res) => {
    if(req.session.isLoggedIn === true){
        res.redirect("/");
    }
    else{
        res.render("signup.ejs",{message:""});
    }
});

app.post("/create-account", (req, res) => {
    readUserData((err, users) => {
        if (req.body.username.trim() !== "" && req.body.email.trim() !== "" && req.body.password.trim() !== "") {
            if (err) {
                console.log("Error in create-account : ", err);
                return;
            }
            else {
                for(let user of users){
                    if(user.email.toLowerCase() === req.body.email.toLowerCase()){
                        // res.send(`<h1>USER ALREADY EXISTS!</h1> <br> <hr> <br> <a href="/login">Click here to login </a>`);
                        let message = "User already exists! Go To Login Page...";
                        res.render("signup",{
                            message,
                        });
                        return;
                    }
                }

                addNewUser(
                    req.body.username,
                    req.body.email.toLowerCase(),
                    req.body.password
                );
                res.render("/login");
            }
        }
        else{
            res.redirect("/signup");
        }
    });
});

app.delete("/logout",(req,res)=>{
    req.session.isLoggedIn = false;
    res.sendStatus(200);
});

app.get("/script",(req,res)=>{
    res.sendFile(__dirname+"/script.js");
})

app.get("/getusername",(req,res)=>{
    res.json(JSON.stringify(req.session.username));
});

app.get("/invalid",(req,res)=>{
    res.render("error");
})

app.listen(3000, function () {
    console.log("Server is running at port 3000");
});


// read user data 
function readUserData(callback) {
    fs.readFile("users.json", "utf-8", function (err, data) {
        if (err) {
            console.log("ERROR IN READING THE FILE : ", err);
            callback(err, null);
        }
        else {
            {
                const users = JSON.parse(data);
                callback(null, users);
            }
        }
    });
}

// function write users in file
function writeUserData(users) {
    fs.writeFile("./users.json", users, (err) => {
        if (err) {
            console.log("Error in writing the file!!!");
        }
    });
}

// remove user
function removeUser(email) {
    readUserData((err, users) => {
        if (err) {
            console.log("Error in removing user : ", err);
            return;
        }
        const updatedUsers = users.filter((user) => user.email != email);
        writeUserData(JSON.stringify(updatedUsers));
    });
}

// add new user
function addNewUser(username, email, password) {
    newUser = {
        username,
        email,
        password,
    };
    readUserData((err, users) => {
        if (err) {
            console.log("Error during insertion : ", err);
        }
        else {
            users.push(newUser);
            writeUserData(JSON.stringify(users));
        }
    });
}