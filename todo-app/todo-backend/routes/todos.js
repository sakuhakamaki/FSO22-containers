const { response } = require('express');
const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis');

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  const oldTodoCount = await redis.getAsync('added_todos')
  if (oldTodoCount === null) {
    await redis.setAsync('added_todos', 1)
  }
  else {
    const newTodoCount = parseInt(oldTodoCount) + 1

    await redis.setAsync('added_todos', newTodoCount)
  }

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const todo = req.todo
  res.send(todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {

  const updatedTodo = {
    text: req.body.text,
    done: req.body.done,
  }

  const newTodo = await Todo.findByIdAndUpdate(
    req.todo._id,
    updatedTodo,
    { 
      new: true,
      useFindAndModify: false
    },
  )

  res.json(newTodo)
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
