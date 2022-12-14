const express = require('express');
const cors = require('cors');
const {
  handlerListTasks,
  handleCreateTask,
  handleDeleteTask,
  handleGetTask,
  handleUpdateTask,
} = require('./Tasks');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/tasks', handlerListTasks);

app.post('/tasks', handleCreateTask);

app.delete('/tasks/:id', handleDeleteTask);

app.get('/tasks/:id', handleGetTask);

app.put('/tasks/:id', handleUpdateTask);

app.use((req, res, next) => {
  return res.status(404).json({
    error: 'Not Found',
  });
});

module.exports = app;
