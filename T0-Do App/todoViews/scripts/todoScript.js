const submitTodoNode = document.getElementById("submitTodo");
const userInputNode = document.getElementById("userInput");
const prioritySelectorNode = document.getElementById("prioritySelector");

const todoListNode = document.getElementById("todo-list");

// listen to click of submit button
submitTodoNode.addEventListener("click", function () {
  // get text from the input
  // send text to server using api ( fetch or xmlhttprequest )
  // get response from server
  // if request is successful then display text in the list
  // else display error message

  const todoText = userInputNode.value;
  // const priority = prioritySelectorNode.value;

  if (!todoText) {
    alert("Please enter a todo");
    return;
  }

  const todo = {
    todoText, // if key and value are same then we can write it like this
    completed: false,
  };

  fetch("/todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  }).then(function (response) {
    if (response.status === 200) {
      // display todo in UI
      showTodoInUI(todo);
    } else {
      alert("something weird happened");
    }
  });
});

function showTodoInUI(todo) {

  // console.log(todo);
  const todoNode = document.createElement("li");
  todoNode.classList = 'todo-item'
  todoNode.style.alignItems = "center";

  const todoTextNode = document.createElement("text");
  todoTextNode.className = "text";
  todoTextNode.innerText = "Task : "+todo.todoText;
  if (todo.completed){
    todoTextNode.style.textDecoration = "line-through";
    todoTextNode.style.color = "grey";
  }
  const checkboxNode = document.createElement("input");
  checkboxNode.type = 'checkbox';
  checkboxNode.className = 'checkbox';
  checkboxNode.checked = false;
  checkboxNode.style.margin = "10px" ;
  // checkboxNode.style.alignItems = "right";

  if (todo.completed){
    checkboxNode.disabled = "true";
    checkboxNode.checked = true;
  }

  const xButtonNode = document.createElement('button');
  xButtonNode.className = 'xButton';
  xButtonNode.innerText = '❌';
  xButtonNode.style.margin = "10px";
  // xButtonNode.style.alignItems = "right";

  todoNode.appendChild(todoTextNode);
  todoNode.appendChild(checkboxNode);
  todoNode.appendChild(xButtonNode);
  todoListNode.appendChild(todoNode);

  const checkboxes = document.querySelectorAll('.checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', checkboxChangeHandler);
  });  

  const xButtons = document.querySelectorAll('.xButton');
  xButtons.forEach(xButton => {
    xButton.addEventListener('click', editDoneHandler);
  });
}

function checkboxChangeHandler(event) {
  const checkbox = event.target;
  if (checkbox.checked) {
    checkbox.removeEventListener('change', checkboxChangeHandler);

    // Checkbox is checked, delete the parent div
    const parentDiv = this.parentNode;
    const todo_item = parentDiv.querySelector('.text').innerText.replace("Task : ", "");
    parentDiv.querySelector('.text').style.textDecoration = "line-through";
    parentDiv.querySelector('.text').style.color = "grey";
    parentDiv.querySelector('.checkbox').disabled = "true";
    console.log(todo_item);
    fetch('/edit-todo', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filePath: './treasure.mp4',
        property: 'todoText',
        value: todo_item
      })
    }).then(function (response) {
      if (response.status === 200) {
        console.log("success");
      }
      else {
        alert('something weird happened');
      }
    });
  }
}

function editDoneHandler(event) {
  const xButton = event.target;
  xButton.removeEventListener('click', editDoneHandler);
  // button is clicked , delete the parent div
  const parentDiv = this.parentNode;
  parentDiv.remove();
  const todo_item = parentDiv.querySelector('.text').innerText.replace("Task : ", "");
  console.log(todo_item);
  fetch('/delete-todo', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filePath: './treasure.mp4',
      property: 'todoText',
      value: todo_item
    })
  }).then(function (response) {
    if (response.status === 200) {
      console.log("success");
    }
    else {
      alert('something weird happened');
    }
  });
}

fetch("/todo-data")
  .then(function (response) {
    if (response.status === 200) {
      return response.json();
    } else {
      alert("something weird happened");
    }
  })
  .then(function (todos) {
    todos.forEach(function (todo) {
      showTodoInUI(todo);
    });
  });