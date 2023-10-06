const express = require('express');
const { Todo } = require('../mongo')
const { getAsync, setAsync } = require('../redis/index');
const router = express.Router();

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

  // Increment the todo counter
  const currentCounter = await getAsync('todoCounter') || 0;
  const currentCounterInt = parseInt(currentCounter)
  await setAsync('todoCounter', currentCounterInt + 1);

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
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  if (!req.body.text || typeof req.body.done !== 'boolean') {
    return res.sendStatus(400);
  }
  req.todo.text = req.body.text;
  req.todo.done = req.body.done;

  const updatedTodo = await req.todo.save();
 
  res.send(updatedTodo);
});

/* GET todo statistics from redis */
router.get('/statistics', async (_, res) => {
  const currentCounter = await getAsync('todoCounter') || 0;
  
  res.json({"added_todos" : currentCounter});
});

router.use('/:id', findByIdMiddleware, singleRouter);


module.exports = router;
