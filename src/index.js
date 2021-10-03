const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if (!user) {
    return response.status(400).json({ error: "User account not exist!" });
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const isUserExists = users.some(user => user.username === username);

  if (isUserExists) {
    return response.status(400).json({ error: "Username already exist!" });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const data = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(data);

  return response.status(201).json(data);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todoToBeUpdated = user.todos.findIndex(todo => todo.id === id);

  if (todoToBeUpdated <= -1) {
    response.status(404).json({ error: "Todo not found!" });
  }

  user.todos[todoToBeUpdated].title = title;
  user.todos[todoToBeUpdated].deadline = new Date(deadline);

  return response.status(201).send(user.todos[todoToBeUpdated]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todoToBeDone = user.todos.findIndex(todo => todo.id === id);

  if (todoToBeDone <= -1) {
    response.status(404).json({ error: "Todo not found!" });
  }

  user.todos[todoToBeDone].done = !user.todos[todoToBeDone].done;

  return response.status(201).json(user.todos[todoToBeDone]);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todoToDelete = user.todos.findIndex(todo => todo.id === id);

  if (todoToDelete <= -1) {
    response.status(404).json({ error: "Todo not found!" });
  }

  user.todos.splice(todoToDelete, 1);

  return response.status(204).send();
});

module.exports = app;