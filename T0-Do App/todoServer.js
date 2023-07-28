const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/todoViews/index.html");
});

app.post("/todo", function (req, res) {
  saveTodoInFile(req.body, function (err) {
    if (err) {
      res.status(500).send("error");
      return;
    }

    res.status(200).send("success");
  });
});

app.post("/delete-todo",function (req,res){
  removeTodoFromFile(req.body,function (err){
    if (err){
      res.status(500).send("error");
    }
    else{
      res.status(200).send("success");
    }
  });
});

app.post("/edit-todo",function (req,res){
  editTodo(req.body,function (err){
    if (err){
      res.status(500).send("error");
    }
    else{
      res.status(200).send("success");
    }
  });
});

app.get("/todo-data", function (req, res) {
  readAllTodos(function (err, data) {
    if (err) {
      res.status(500).send("error");
      return;
    }

    //res.status(200).send(JSON.stringify(data));
    res.status(200).json(data);
  });
});

app.get("/edit-todo", function (req,res) {
  res.sendFile(__dirname + "/todoViews/todo.html");
});
app.get("/delete-todo", function (req,res) {
  res.sendFile(__dirname + "/todoViews/todo.html");
});
app.get("/bootstrap.min.css", function (req, res) {
  res.sendFile(__dirname + "/bootstrap.min.css");
});
app.get("/bootstrap.min.css.map", function (req, res) {
  res.sendFile(__dirname + "/bootstrap.min.css.map");
});


app.get("/about", function (req, res) {
  res.sendFile(__dirname + "/todoViews/about.html");
});

app.get("/contact", function (req, res) {
  res.sendFile(__dirname + "/todoViews/contact.html");
});

app.get("/todo", function (req, res) {
  res.sendFile(__dirname + "/todoViews/todo.html");
});

app.get("/todoScript.js", function (req, res) {
  res.sendFile(__dirname + "/todoViews/scripts/todoScript.js");
});

app.listen(8000, function () {
  console.log("server on port 8000");
});

function readAllTodos(callback) {
  fs.readFile("./treasure.mp4", "utf-8", function (err, data) {
    if (err) {
      callback(err);
      return;
    }

    if (data.length === 0) {
      data = "[]";
    }

    try {
      data = JSON.parse(data);
      callback(null, data);
    } catch (err) {
      callback(err);
    }
  });
}

function saveTodoInFile(todo, callback) {
  readAllTodos(function (err, data) {
    if (err) {
      callback(err);
      return;
    }

    data.push(todo);

    fs.writeFile("./treasure.mp4", JSON.stringify(data), function (err) {
      if (err) {
        callback(err);
        return;
      }

      callback(null);
    });
  });
}

// Function to update the JSON data
function editTodo(body) {
  const {filePath,property,value} = body;
  // Read the JSON data from the file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    try {
      // Parse the JSON data into a JavaScript array
      const jsonData = JSON.parse(data);

      // Find the object with id: 1 > modification
      const objectToUpdate = jsonData.find(item => item[property] === value);

      // Check if the object exists
      if (objectToUpdate) {
        // Modify the object by adding the desired data
        
        objectToUpdate['completed'] = !objectToUpdate['completed'];

        // Convert the modified data back to JSON string
        const updatedData = JSON.stringify(jsonData, null, 2);

        // Write the updated data back to the file
        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
          if (err) {
            console.error('Error writing to the file:', err);
            return;
          }
          console.log('Data updated successfully!');
        });
      } else {
        console.error('Object not found!');
      }
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
    }
  });
}

// delteting todo from the file

function removeTodoFromFile(body) {
  const {filePath,property,value} = body;
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      const filteredData = jsonData.filter(item => item[property] !== value);
      const updatedData = JSON.stringify(filteredData, null, 2);

      fs.writeFile(filePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to the file:', err);
        } else {
          console.log(`Data with '${property}' equal to '${value}' removed successfully.`);
        }
      });
    } catch (err) {
      console.error('Error parsing JSON data:', err);
    }
  });
}