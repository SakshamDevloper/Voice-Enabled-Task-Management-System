const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    { _id: '1', title: 'Sample Task', status: 'todo', priority: 'med' }
  ]);
});

module.exports = router;