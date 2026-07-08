const express = require("express");
const router = express.Router();

const { getUserPermission, updateUserPermissions } = require("../../controller/admin/userPermissionController");

router.get("/getUserPermission", getUserPermission);
router.put("/updateUserPermission", updateUserPermissions);

module.exports = router;