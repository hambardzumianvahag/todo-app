const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;
let todos = [];

app.use(cors());
app.use(express.json());

app.get("/todos", async (req, res) => {
  try {
    if (todos.length === 0) {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos?_limit=30"
      );
      todos = response.data;
    }

    const { title_like, completed } = req.query;

    let filteredTodos = todos;

    if (title_like) {
      filteredTodos = filteredTodos.filter((todo) =>
        todo.title.toLowerCase().includes(title_like.toLowerCase())
      );
    }

    if (completed !== undefined) {
      filteredTodos = filteredTodos.filter(
        (todo) => String(todo.completed) === completed
      );
    }

    res.json(filteredTodos);
  } catch (error) {
    res.status(500).send("Error fetching todos");
  }
});

app.post("/todos", (req, res) => {
  try {
    const newTodo = req.body;
    newTodo.id = todos.length + 1;
    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Error adding todo", error });
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTodo = req.body;

    const index = todos.findIndex((todo) => todo.id == id);
    if (index === -1) {
      return res.status(404).send("Todo not found");
    }

    todos[index] = { ...todos[index], ...updatedTodo };
    res.json(todos[index]);
  } catch (error) {
    res.status(500).send("Error updating todo");
  }
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex((todo) => todo.id == id);
  if (index !== -1) {
    todos.splice(index, 1);
    res.status(200).send(`Todo with id ${id} deleted`);
  } else {
    res.status(404).send("Todo not found");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
