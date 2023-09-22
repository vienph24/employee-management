const express = require('express');
const router = express.Router();

const departmentService = require('../services/department.service');

/* POST employee. */
router.post('/', async function (req, res, next) {
  const code = req.body.code?.trim();
  const name = req.body.name?.trim();

  const newDepartment = await departmentService.createOne(code, name);

  res.json(newDepartment);
});

module.exports = router;
