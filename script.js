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

// Modal Apply Button

function clearApplyButton() {
  const existingApplyButton = document.querySelector(".modal-apply");
  if (existingApplyButton) {
    existingApplyButton.remove();
  }
}

//

// fetching data

function fetchTodo() {
  fetch("https://jsonplaceholder.typicode.com/todos?_limit=30")
    .then((response) => response.json())
    .then((todos) => {
      function displayTodos(todos) {
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
        //
        // todo items
        todos.forEach((item, index) => {
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

          // Editing

          todoEdit.addEventListener("click", () => {
            clearApplyButton();
            const modalApply = document.createElement("button");
            modalApply.className = "modal-apply";
            modalApply.innerText = "Apply Edit";
            modalbtnDiv.appendChild(modalApply);
            modalDiv.style.display = "block";
            modalTitle.innerText = "Change Your Note";
            modalInput.value = item.title;
            modalApply.onclick = () => {
              item.title = modalInput.value;
              modalInput.value = "";
              modalDiv.style.display = "none";
              displayTodos(todos);
            };
          });
          //
          //Deleting
          todoDelete.addEventListener("click", () => {
            todos.splice(index, 1);
            displayTodos(todos);
          });
          //
          todoList.appendChild(todoItem);
          todoItem.appendChild(todoText);
          todoItem.appendChild(todoAction);
          todoItem.after(hr);
          todoText.appendChild(todoInput);
          todoText.appendChild(todoTitle);
          todoAction.appendChild(todoEdit);
          todoAction.appendChild(todoDelete);
        });
      }
      displayTodos(todos);

      // Search
      const searchBtn = document.querySelector("#search-img");
      const searchInput = document.querySelector("#search-input");
      searchBtn.addEventListener("click", () => {
        searchInput.focus();
      });

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

      const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        const filteredTodos = todos.filter((todo) =>
          todo.title.toLowerCase().includes(value)
        );
        displayTodos(filteredTodos);
      };

      searchInput.addEventListener("input", debounce(handleSearch, 300));

      //

      //Select functionality

      const select = document.querySelector("#select");
      select.addEventListener("change", () => {
        if (select.value === "incomplete") {
          const filteredTodos = todos.filter(
            (todo) => todo.completed === false
          );
          displayTodos(filteredTodos);
        } else if (select.value === "complete") {
          const filteredTodos = todos.filter((todo) => todo.completed === true);
          displayTodos(filteredTodos);
        } else {
          displayTodos(todos);
        }
      });

      //

      // addTodo

      addTodo.addEventListener("click", () => {
        clearApplyButton();
        const modalApply = document.createElement("button");
        modalApply.className = "modal-apply";
        modalApply.innerText = "Apply";
        modalbtnDiv.appendChild(modalApply);

        modalDiv.style.display = "block";
        modalDiv.style.display = "block";
        modalInput.placeholder = "Input your note...";
        modalTitle.innerText = "New Note";

        modalApply.addEventListener("click", () => {
          searchInput.value = "";
          addNewTodo();
        });
      });

      //

      // modal close,cancel

      close.addEventListener("click", () => {
        modalDiv.style.display = "none";
      });

      modalCancel.addEventListener("click", () => {
        modalDiv.style.display = "none";
      });

      //

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
          .then((data) => {
            todos.push(data);
            modalInput.value = "";
            modalDiv.style.display = "none";
            updateTodoList();
          });
      }
      //

      // Update

      function updateTodoList() {
        displayTodos(todos);
      }
      //
    })
    .catch((err) => console.error(err));
}

fetchTodo();
