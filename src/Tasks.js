const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');
const TABLE = 'tasks-table-dev';

async function handlerListTasks(req, res) {
  const dynamoDbClient = new AWS.DynamoDB.DocumentClient({region: 'sa-east-1'});
  const TableName = TABLE;
  const { user } = req.query;
  // const user = 'paulo';

  try {
    const tasks = await dynamoDbClient.scan({ TableName }).promise();
    if (tasks.Items.length !== 0) {
      const filteredTasks = user
        ? tasks.Items.filter(task => task.user === user)
        : tasks.Items;
      res.json(filteredTasks);
    } else {
      res
        .status(404)
        .json({ error: 'Could not find nothing in tasks' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Could not retreive tasks' });
  }
}

async function handleCreateTask(req, res) {
  const dynamoDbClient = new AWS.DynamoDB.DocumentClient({region: 'sa-east-1'});

  const { description, user } = req.body;
  // const user = 'paulo';

  if (typeof description !== 'string') {

    res.status(400).json({ error: 'description must be a string' });
    return;
  }
  if(typeof user !== 'string') {
    res.status(400).json({ error: 'user must be a string' });
    return;
  }

  const id = uuid();

  const Task = {
    id,
    description,
    user,
    completed: false,
  }

  const params = {
    TableName: TABLE,
    Item: Task,
  };

  try {
    await dynamoDbClient.put(params).promise();
    const task = await dynamoDbClient.get({ TableName: TABLE, Key: { id } }).promise();
    const { Item } = task;
    // delete Item.user;
    res.json({
      ...Item
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Could not create or update task' });
  }
}

async function handleDeleteTask(req, res) {
  const dynamoDbClient = new AWS.DynamoDB.DocumentClient({region: 'sa-east-1'});
  const TableName = TABLE;
  const { id } = req.params;
  try {
    const task = await dynamoDbClient.get({ TableName, Key: { id } }).promise();
    await dynamoDbClient.delete({ TableName, Key: { id } }).promise();
    const {Item} = task;
    // delete Item.user;
    res.json(Item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Could not delete task' });
  }
}

async function handleGetTask(req, res) {
  const dynamoDbClient = new AWS.DynamoDB.DocumentClient({region: 'sa-east-1'});
  const TableName = TABLE;
  const { id } = req.params;
  try {
    const { Item } = await dynamoDbClient.get({ TableName, Key: { id } }).promise();
    res.json(Item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Could not get task ${id}` });
  }
}

async function handleUpdateTask(req, res) {
  const dynamoDbClient = new AWS.DynamoDB.DocumentClient({region: 'sa-east-1'});
  const TableName = TABLE;
  const { id } = req.params;
  const { description, completed, user } = req.body;
  // const user = 'paulo';

  let Task = {
    id,
    description,
    user,
    completed,
  }

  Object.keys(Task).forEach(key => {
    if(!Task[key]) {
      delete Task[key];
    }
  });

  const params = {
    TableName,
    Item: Task,
  };

  try {
    const oldTask = await dynamoDbClient.get({ TableName, Key: { id } }).promise();
    const newTask = {
      ...params,
      Item: {
        ...oldTask.Item,
        ...Task,
      }
    }
    await dynamoDbClient.put(newTask).promise();
    const task = await dynamoDbClient.get({ TableName, Key: { id } }).promise();
    const {Item} = task;
    // delete Item.user;
    res.json(Item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Could not update task' });
  }
}

module.exports = {
  handlerListTasks,
  handleCreateTask,
  handleDeleteTask,
  handleGetTask,
  handleUpdateTask,
}
