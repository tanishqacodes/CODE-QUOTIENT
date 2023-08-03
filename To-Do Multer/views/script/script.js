const form = document.getElementById("input-task-form");

fetch("/tasks").then((res)=>{
    return res.json();
}).then((tasks)=>{
    console.log("Tasks : ",tasks);

    for(let task of tasks){
        createTaskElement(
            task.taskText,
            task.taskImage.filename,
            task.id,
            task.completed
        );
    }
});

form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const taskText =document.querySelector("#task").value.trim();

    const image = document.querySelector("#logo").files[0];

    console.log(taskText , image);

    // task doesn't equal to null
    if(taskText !== ""){
        // FormData is commonly used in the browser to handle form data and construct multipart/form-data requests when submitting forms or uploading files. However, it can also be used in Node.js with the help of some libraries like form-data or fetch to create and send HTTP requests with form data.

        const formData = new FormData();

        formData.append("taskText",taskText);
        formData.append("image",image);

        fetch("/todo",{
            method:"POST",
            body:formData,
        }).then((res)=>{
            return res.json();

        }).then((data)=>{
            
            console.log(data);

            createTaskElement(
                data.taskText,
                data.image.filename,
                data.id,
                data.completed
            );
        });
    }

    else{
        alert("Please enter a valid task ... ");
        return;
    }

    document.querySelector("#task").value = "";
});

function createTaskElement(taskText,taskImage, id, completed){
    const newTask = document.createElement("li");
    newTask.setAttribute("todo-task-id",id);

    newTask.classList.add("todo");
    newTask.innerHTML = `<span class = "todo-text">${taskText}</span>
    <img src="${taskImage}"/>
    <div class="buttons-container">
    <button class="del-button">DELETE</button>
    <button class="complete-button">COMPLETE</button>
    </div>`;

    const todoList = document.querySelector(".todo-list");

    if(completed){
        newTask.classList.add("completed-list");
        newTask.firstChild.classList.add("line-through");
    }

    todoList.append(newTask);

    const delButton = newTask.querySelector(".del-button");

    delButton.addEventListener("click",function(){
        deleteToDo(id);
    });

    const doneButton = newTask.querySelector(".complete-button");

    doneButton.addEventListener("click", function(){
        updateCompletedTask(id,!completed);
        completed = !completed;

    });
}

function deleteToDo(id){

    fetch(`task/${id}`,{
        method:"DELETE",
    }).then(()=>{
        //select the li(task) with the required data-task-id and assign the element to variable taskItem

        //[data-task-id=taskId] is the attribute selector(we can select elements using attributes)
        const taskItem = document.querySelector(`li[todo-task-id]="${id}"]`);
        // remove id form ui
        taskItem.remove();
    });
}

function updateCompletedTask(id,status){
    fetch(`/task/${id}`,{
        method:"PUT",
        headers:{
            "Content-type" : "application/json",
        },
        body: JSON.stringify({status}),
    }).then(()=>{
        const taskItem = document.querySelector(`li[todo-task-id="${id}"]`);

        // update UI
        taskItem.classList.toggle("completed-list");
        taskItem.firstChild.classList.toggle("line-through");
    });
}