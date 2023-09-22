const express = require('express');
const router = express.Router();

const employeeService = require('../services/employee.service');

/* POST employee. */
router.post('/', async function (req, res, next) {
  const code = req.body?.code?.trim();
  const phone = req.body.phone?.trim();
  const email = req.body.email?.trim();
  const sex = req.body.sex?.trim();
  const departmentId = req.body.departmentId?.trim();
  const avatar = req.file.buffer;

  const newEmployee = await employeeService.createOne(code, phone, email, sex, departmentId, avatar);
  res.json(newEmployee);
});

/* GET an employee */
router.get('/:code', async function (req, res, next) {
  const empCode = req.params?.code?.trim();
  res.json(await employeeService.getEmployee(empCode))
})

/* GET employees */
router.get('/', async function (req, res, next) {
  res.json(await employeeService.getEmployee())
})

/* PATCH update employee's info */
router.patch('/:code', async function (req, res, next) {
  const empCode = req.params?.code.trim();
  res.json(await employeeService.updateOne(empCode, req.body));
})

/* DELET an employee */
router.delete('/:code', async function (req, res, next) {
  const empCode = req.params?.code.trim();
  const deleted = await employeeService.deleteOne(empCode);
  res.json(deleted);
})

module.exports = router;
