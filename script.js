const todoList = document.querySelector("#todo-list");

// Dark/Light Mode

document.getElementById("theme-toggle").addEventListener("click", function () {
  toggleTheme();
});

function toggleTheme() {
  const htmlElement = document.documentElement;
  const currentTheme = htmlElement.classList.contains("dark")
    ? "dark"
    : "light";

  if (currentTheme === "light") {
    htmlElement.classList.remove("light");
    htmlElement.classList.add("dark");
    document.getElementById("theme-icon").src = "./src/img/sun-icon.png";
  } else {
    htmlElement.classList.remove("dark");
    htmlElement.classList.add("light");
    document.getElementById("theme-icon").src = "./src/img/moon-icon.png";
  }
}

//

const addTodo = document.querySelector("#add-img");
const modalDiv = document.querySelector("#modal-div");
const close = document.querySelector(".close");
const modalTitle = document.querySelector(".modal-title");
const modalInput = document.querySelector(".modal-input");
const modalbtnDiv = document.querySelector(".modal-btn-div");
const modalCancel = document.querySelector(".modal-cancel");
const modalApply = document.querySelector(".modal-apply");
// let data = [];

// Modal Apply Button

function clearApplyButton() {
  const existingApplyButton = document.querySelector(".modal-apply");
  if (existingApplyButton) {
    existingApplyButton.remove();
  }
}

function printTodo(list) {
  todoList.innerHTML = "";
  list.forEach((item) => {
    const todoItem = document.createElement("div");
    const todoText = document.createElement("div");
    const todoAction = document.createElement("div");
    const todoInput = document.createElement("input");
    const todoTitle = document.createElement("p");
    const todoEdit = document.createElement("img");
    const todoDelete = document.createElement("img");
    const hr = document.createElement("hr");
    todoItem.className = "todo-item";
    todoText.className = "todo-text";
    todoAction.className = "todo-action";
    todoInput.className = "input-check";
    todoTitle.className = "todo-title";
    todoEdit.className = "todo-edit";
    todoDelete.className = "todo-delete";
    todoTitle.innerHTML = item.title;
    // checkbox
    todoInput.type = "checkbox";
    todoInput.checked = item.completed;
    if (todoInput.checked) {
      todoTitle.classList.add("todo-completed");
    }
    todoInput.addEventListener("click", () => {
      item.completed = todoInput.checked;
      if (todoInput.checked) {
        todoTitle.classList.add("todo-completed");
      } else {
        todoTitle.classList.remove("todo-completed");
      }
    });
    //

    todoEdit.src = "./src/img/edit-icon.png";
    todoDelete.src = "./src/img/delete-icon.png";

    todoList.appendChild(todoItem);
    todoItem.appendChild(todoText);
    todoItem.appendChild(todoAction);
    todoItem.after(hr);
    todoText.appendChild(todoInput);
    todoText.appendChild(todoTitle);
    todoAction.appendChild(todoEdit);
    todoAction.appendChild(todoDelete);
  });
  editTodo();
  deleteTodo();
}

function showTodo() {
  fetch("https://jsonplaceholder.typicode.com/todos?_limit=30")
    .then((response) =>
      response.json().then((todos) => {
        todoList.innerHTML = "";
        // no data available image
        if (todos.length === 0) {
          const noTodoImg = document.createElement("img");
          noTodoImg.className = "nothing";
          noTodoImg.src = "./src/img/notodo-img.png";
          noTodoImg.alt = "no Available";
          todoList.appendChild(noTodoImg);
          return;
        }
        printTodo(todos);
      })
    )
    .catch((err) => {
      console.error(err);
    });
}
showTodo();

// Search

const searchBtn = document.querySelector("#search-img");

searchBtn.addEventListener("click", () => {
  searchInput.focus();
});

const searchInput = document.querySelector("#search-input");

// debounce

const debounce = (callback, waitTime) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, waitTime);
  };
};

const searchTodo = (event) => {
  fetch(
    `https://jsonplaceholder.typicode.com/todos?title_like=${event.target.value.toLowerCase()}&_limit=10`
  )
    .then((response) => response.json())
    .then((todos) => {
      todoList.innerHTML = "";
      if (todos.length === 0) {
        const noTodoImg = document.createElement("img");
        noTodoImg.className = "nothing";
        noTodoImg.src = "./src/img/notodo-img.png";
        noTodoImg.alt = "no Available";
        todoList.appendChild(noTodoImg);
        return;
      }
      printTodo(todos);
    });
};

searchInput.addEventListener("input", debounce(searchTodo, 1000));

// Select

const select = document.querySelector("#select");
select.addEventListener("change", () => {
  if (select.value === "incomplete") {
    fetch(
      "https://jsonplaceholder.typicode.com/todos?completed=false&_limit=10"
    )
      .then((response) => response.json())
      .then((todos) => {
        todoList.innerHTML = "";
        printTodo(todos);
      });
  } else if (select.value === "complete") {
    fetch("https://jsonplaceholder.typicode.com/todos?completed=true&_limit=10")
      .then((response) => response.json())
      .then((todos) => {
        todoList.innerHTML = "";
        printTodo(todos);
      });
  } else {
    showTodo();
  }
});

// Edit

function editTodo() {
  const todoItem = document.querySelectorAll(".todo-item");
  let editImg;
  for (let i = 0; i < todoItem.length; i++) {
    const item = todoItem[i];
    editImg = item.childNodes[1].childNodes[0];
    editImg.addEventListener("click", () => {
      clearApplyButton();
      const modalApply = document.createElement("button");
      modalApply.className = "modal-apply";
      modalApply.innerText = "Apply Edit";
      modalbtnDiv.appendChild(modalApply);
      modalDiv.style.display = "block";
      modalTitle.innerText = "Change Your Note";
      modalInput.value = item.childNodes[0].childNodes[1].textContent;
      modalApply.onclick = () => {
        fetch(`https://jsonplaceholder.typicode.com/todos/${i + 1}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...item,
            title: modalInput.value,
          }),
        })
          .then((response) => response.json())
          .then((todo) => {
            fetch("https://jsonplaceholder.typicode.com/todos?_limit=30")
              .then((response) => response.json())
              .then((todos) => {
                todos.forEach((item) => {
                  if (item.id === todo.id) {
                    item.title = todo.title;
                  }
                });
                printTodo(todos);
              });
          });

        modalInput.value = "";
        modalDiv.style.display = "none";
      };
    });
  }
}

// Delete

function deleteTodo() {
  const todoItem = document.querySelectorAll(".todo-item");
  let deleteImg;
  for (let i = 0; i < todoItem.length; i++) {
    const item = todoItem[i];
    deleteImg = item.childNodes[1].childNodes[1];
    deleteImg.addEventListener("click", () => {
      fetch(`https://jsonplaceholder.typicode.com/todos/${i + 1}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            item.remove();
          } else {
            console.error("Fail");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }
}

close.addEventListener("click", () => {
  modalDiv.style.display = "none";
});

modalCancel.addEventListener("click", () => {
  modalDiv.style.display = "none";
});

// Add

addTodo.addEventListener("click", () => {
  clearApplyButton();
  const modalApply = document.createElement("button");
  modalApply.className = "modal-apply";
  modalApply.innerText = "Apply";
  modalbtnDiv.appendChild(modalApply);
  modalInput.value = "";
  modalDiv.style.display = "block";
  modalDiv.style.display = "block";
  modalInput.placeholder = "Input your note...";
  modalTitle.innerText = "New Note";

  modalApply.addEventListener("click", () => {
    searchInput.value = "";
    addNewTodo();
  });
});

//addTodo

function addNewTodo() {
  const newTodo = {
    completed: false,
    userId: 3,
    title: modalInput.value,
  };
  fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((response) => response.json())
    .then((todos) => {
      fetch("https://jsonplaceholder.typicode.com/todos?_limit=30")
        .then((response) => response.json())
        .then((data) => {
          data.push(todos);
          printTodo(data);
        });
      modalInput.value = "";
      modalDiv.style.display = "none";
    });
}

// checkere actionic heto nuynna mnum
// edit, add menak mihata linum anel, 2 tarber elementner poxel chi linum
