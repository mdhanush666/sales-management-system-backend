const express = require("express");
const { createStatus, getStatus } = require("../../controller/admin/statusController");
const router = express.Router();

router.post("/createStatus", createStatus);
router.get("/getStatus", getStatus);

module.exports = router;