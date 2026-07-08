const express = require('express');
const router = express.Router();

const { createUser, getUsers, updateUser, deleteUser } = require('../../controller/admin/userController');

router.get("/getUsers", getUsers);
router.get("/getUsers/:id", getUsers);
router.post("/createUser", createUser);
router.put("/updateUser/:id", updateUser);
router.put("/deleteUser/:id", deleteUser);


module.exports = router;