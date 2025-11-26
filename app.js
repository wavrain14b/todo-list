// JS features:
// dynamically add tasks to todo 
// delete a task with trash icon
// save task to local storage so it stays the same after leaving page
// save status of a task if completed

const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

// buttons
const todoSortBtn = document.getElementById('todo-sort-btn');
const completeSortBtn = document.getElementById('complete-sort-btn');
const showAllBtn = document.getElementById('show-all-btn');
const clearAllBtn = document.getElementById('clear-all-btn');


let allTodos = getTodos();
updateTodoList();
// see all tasks todo in console
console.log(allTodos);

todoForm.addEventListener('submit', function(e){
    e.preventDefault();
    addTask();
})

todoSortBtn.addEventListener("click", () => updateTodoList("todo"));
completeSortBtn.addEventListener("click", () => updateTodoList("completed"));
showAllBtn.addEventListener("click", () => updateTodoList("all"));
clearAllBtn.addEventListener("click", () => clearAllTasks());


console.log(todoSortBtn, completeSortBtn, showAllBtn);


function addTask(){
     const todoText = todoInput.value.trim();
     if(todoText.length > 0){
        const todoObj = {
            text: todoText, 
            completed: false
        }
        allTodos.push(todoObj);
        updateTodoList("all");
        saveTodos();
        todoInput.value = "";
     }
}

function updateTodoList(filter = "all"){
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex)=>{
        if (filter === "all" ||                           // -- all tasks listed
            (filter === "todo" && !todo.completed) ||     //tasks not completed
            (filter === "completed" && todo.completed)) { //tasks completed
            const todoItem = createTodoItem(todo, todoIndex);
            todoListUL.append(todoItem);
        }
        // todoItem = createTodoItem(todo, todoIndex);
        // todoListUL.append(todoItem);
    })
}

function createTodoItem(todo, todoIndex){
    const todoId = "todo-"+todoIndex;
    const todoLI = document.createElement("li");
    const todoText = todo.text;
    todoLI.className = "todo";
    todoLI.innerHTML = `
                <input type = "checkbox" id = "${todoId}">
                <label class = "custom-checkbox" for="${todoId}">
                    <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                    </svg>
                </label>
                <label for = "${todoId}" class = "todo-text">
                    ${todoText}
                </label>
                <button class = "delete-button">
                    <svg fill="(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                    </svg>
                </button>
                <button class = "multi-option-button"> 
                    <svg fill="(--secondary-color)"xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"> 
                        <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/> 
                    </svg> 
                </button>
                <div class="todo-options hidden">
                    <button class="edit-todo">Edit</button>
                    <button class="pin-todo">Pin</button>
                </div>
                `

    // delete task
    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", ()=>{
        deleteTodoItem(todoIndex);
    })

    // entering and saving input
    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", ()=>{
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodos();
    });

    // multi option btn + option buttons
    const multiOptionBtn = todoLI.querySelector(".multi-option-button");
    const optionMenu    = todoLI.querySelector(".todo-options");
    const editBtn       = todoLI.querySelector(".edit-todo");
    const pinBtn        = todoLI.querySelector(".pin-todo");
    // open/close menu
    multiOptionBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        optionMenu.classList.toggle("hidden");
    });
    // edit functionality
    editBtn.addEventListener("click", () => {
        const newText = prompt("Edit task:", todo.text);
        if (newText !== null && newText.trim() !== "") {
            allTodos[todoIndex].text = newText.trim();
            saveTodos();
            updateTodoList("all");
        }
    });
    // pin functionality
    pinBtn.addEventListener("click", () => {
        const item = allTodos[todoIndex];
        allTodos.splice(todoIndex, 1);     // remove from current position
        allTodos.unshift(item);            // move to top
        saveTodos();
        updateTodoList("all");
    });

    // close menu when clicking outside
    document.addEventListener("click", () => optionMenu.classList.add("hidden"));

    checkbox.checked = todo.completed;
    
    return todoLI;
}

function saveTodos(){
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJson);
}

function getTodos(){
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}

function deleteTodoItem(todoIndex){
    allTodos = allTodos.filter((_, i)=> i !== todoIndex);
    saveTodos();
    updateTodoList("all");
}

function clearAllTasks(){
    const result = confirm("Do you want to proceed? The following will clear all tasks");
    if(result){
        allTodos = [];
        localStorage.clear();
        alert("Local storage cleared");
        updateTodoList("all");
    } else {
        alert("Clear all cancelled");
    }
}

