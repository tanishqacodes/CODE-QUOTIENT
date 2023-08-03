const express = require('express');
const fs = require('fs');
const app = express();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req,file,callback){
        callback(null,"public/");
    },
    filename : function(req,file,callback){
        callback(null,`${Date.now()}_${file.originalname}`);
    },
});
// const upload = multer({dest:'public/'});

const upload = multer({storage:storage});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("views"));
app.use(express.static("public"));

app.use(upload.single("logo"));


app.get("/",function(req,res){
    res.sendFile(__dirname+"/views/index.html");
});

app.get("/tasks",function(req,res){
    getAllTodo((err,todos)=>{
        if(err){
            console.log("Error in get tasks : ",err);

            res.status(500).send(err);
        }
        else{
            res.json(todos);
        }
    });
});


app.post("/todo",function(req,res){
    const taskText = req.body.task;
    const taskImage = req.file;
  
    console.log(taskText,taskImage);

    getAllTodo(function(err,todos){
        if(err){
            console.log("Error : ",err);
            res.status(500).send(err);
        }
        else{
            const newTaskId = todos.length > 0 ? todos[todos.length - 1].id+1 : 1;

            const newTask = {
                taskImage : taskImage,
                taskText : taskText,
                completed : false,
                id : newTaskId,
            };

            todos.push(newTask);
            writeTodoInFile(todos,(err)=>{
                if(err){
                    console.log(err);
                }
            });

            res.json(newTask);
            // res.status(200).json("success");
        }
    });

    // saveTodoInFile(newTask,function(err){
    //     if(err){
    //         res.status(500).send("Error");
    //         return;
    //     }
    //     res.json(newTask);
    // });

});

app.get("/todo",function(req,res){
    res.sendFile(__dirname+"index.html");
})

app.listen(3000,function(){
    console.log("Listen at 3000 port....");
});


// function saveTodoInFile(todoData,callback){
//     getAllTodo(function (err,data){
//         if(err){
//             callback(err);
//             return;
//         }
        
//         data.push(todoData);

//         writeTodoInFile(todoData,(err)=>{
//             if(err){
//                 console.log(err);
//             }
//         });

//     });
// }


function getAllTodo(callback){
    fs.readFile('./users.json',"utf-8",function(err,data){
        if(err){
            callback(err,null);
            // return;
        }

        // if(data.length === 0){
        //     data = "[]";
        // }

        // try{
        //     data = JSON.parse(data);
        //     callback(null,data);
        // }
        // catch(err){
        //     callback([]);
        // }

        else if(data.length === 0){
            todos = "[]";
        }
        else{
            todos = JSON.parse(data);
            callback(null,todos);
        }

    });
}


function writeTodoInFile(todos,callback){
    fs.writeFile("./users.json",JSON.stringify(todos),(err)=>{
        if(err){
            callback(err);
        }
        else{
            callback(null);
        }
    });
}