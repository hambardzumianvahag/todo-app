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

//main show

function showTodo() {
  fetch("http://localhost:3000/todos")
    .then((response) => response.json())
    .then((todos) => {
      printTodo(todos);
    })
    .catch((error) => console.error("Error fetching todos:", error));
}
showTodo();

// Modal Apply Button

function clearApplyButton() {
  const existingApplyButton = document.querySelector(".modal-apply");
  if (existingApplyButton) {
    existingApplyButton.remove();
  }
}

// main print function

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
  const todoItems = document.querySelectorAll(".todo-item");
  checkboxTodo();
  editTodo();
  deleteTodo();
}

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

const searchTodo = async (event) => {
  if (event.target.value) {
    try {
      const response = await fetch(
        `http://localhost:3000/todos?title_like=${event.target.value.toLowerCase()}&_limit=10`
      );
      const todos = await response.json();
      todoList.innerHTML = "";
      if (todos.length === 0) {
        const noTodoImg = document.createElement("img");
        noTodoImg.className = "nothing";
        noTodoImg.src = "./src/img/notodo-img.png";
        noTodoImg.alt = "No Available";
        todoList.appendChild(noTodoImg);
        return;
      }
      printTodo(todos);
    } catch (error) {
      console.error("Error searching todos:", error);
    }
  } else {
    showTodo();
  }
};

searchInput.addEventListener("input", debounce(searchTodo, 1000));

// Select

const select = document.querySelector("#select");

select.addEventListener("change", async () => {
  try {
    let response;
    if (select.value === "incomplete") {
      response = await fetch("http://localhost:3000/todos?completed=false");
    } else if (select.value === "complete") {
      response = await fetch("http://localhost:3000/todos?completed=true");
    } else {
      showTodo();
      return;
    }
    const todos = await response.json();
    todoList.innerHTML = "";
    printTodo(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
});

// Edit

function editTodo() {
  const todoItems = document.querySelectorAll(".todo-item");
  todoItems.forEach((item, index) => {
    const editImg = item.querySelector(".todo-edit");
    editImg.addEventListener("click", () => {
      clearApplyButton();

      const modalApply = document.createElement("button");
      modalApply.className = "modal-apply";
      modalApply.innerText = "Apply Edit";
      modalbtnDiv.appendChild(modalApply);

      modalDiv.style.display = "block";
      modalTitle.innerText = "Change Your Note";
      modalInput.value = item.querySelector(".todo-title").textContent;

      modalApply.onclick = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/todos/${index + 1}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: modalInput.value,
                completed: item.querySelector(".input-check").checked,
              }),
            }
          );

          const todosResponse = await fetch("http://localhost:3000/todos");
          const todos = await todosResponse.json();

          printTodo(todos);

          modalInput.value = "";
          modalDiv.style.display = "none";
        } catch (error) {
          console.error("Error updating todo:", error);
        }
      };
    });
  });
}

// Delete

function deleteTodo() {
  const todoItems = document.querySelectorAll(".todo-item");
  todoItems.forEach((item, index) => {
    const deleteImg = item.querySelector(".todo-delete");

    deleteImg.addEventListener("click", async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/todos/${index + 1}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          item.remove();
        } else {
          console.error("Failed to delete todo");
        }
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    });
  });
}

close.addEventListener("click", () => {
  modalDiv.style.display = "none";
});

modalCancel.addEventListener("click", () => {
  modalDiv.style.display = "none";
});

// checkboxes

function checkboxTodo() {
  const todoItems = document.querySelectorAll(".todo-item");

  todoItems.forEach((item, index) => {
    const todoInput = item.querySelector(".input-check");
    const todoTitle = item.querySelector(".todo-title");

    todoInput.addEventListener("click", async () => {
      try {
        const newCompletedStatus = todoInput.checked;
        const response = await fetch(
          `http://localhost:3000/todos/${index + 1}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              completed: newCompletedStatus,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update todo");
        }
        if (newCompletedStatus) {
          todoTitle.classList.add("todo-completed");
        } else {
          todoTitle.classList.remove("todo-completed");
        }
      } catch (error) {
        console.error("Error updating todo:", error);
        todoInput.checked = !todoInput.checked;
      }
    });
  });
}

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

  fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((response) => response.json())
    .then((todo) => {
      fetch("http://localhost:3000/todos")
        .then((response) => response.json())
        .then((data) => {
          printTodo(data);
        });
      modalInput.value = "";
      modalDiv.style.display = "none";
    })
    .catch((error) => console.error("Error adding todo:", error));
}

// searchi jamanak normal chi ashxatum
