const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const Todo = require('../models/Todo');

// Get todos for logged in user
router.get('/', verifyToken, async (req, res) => {
  const todos = await Todo.find({ userId: req.user.id });
  res.json(todos);
});

// Add todo
router.post('/', verifyToken, async (req, res) => {
  const { text } = req.body;
  const todo = new Todo({ userId: req.user.id, text });
  await todo.save();
  res.json(todo);
});

// Update todo (mark complete or edit)
router.put('/:id', verifyToken, async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.id });
  if (!todo) return res.status(404).json({ message: 'Todo not found' });

  if (req.body.text !== undefined) todo.text = req.body.text;
  if (req.body.completed !== undefined) todo.completed = req.body.completed;

  await todo.save();
  res.json(todo);
});

// Delete todo
router.delete('/:id', verifyToken, async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
