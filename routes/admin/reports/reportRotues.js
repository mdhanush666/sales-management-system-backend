const express = require("express");
const router = express.Router();

const { getLoginHistoryReport } = require("../../../controller/admin/reports/loginHistoryReportController");
const { getLeadboardReport } = require("../../../controller/admin/reports/leadboardController");
const { getCustomerOrderSummaryReport } = require("../../../controller/admin/reports/customerOrderSummaryController");

router.get("/loginHistoryReport", getLoginHistoryReport);
router.get("/leadboardReport", getLeadboardReport);
router.get("/customerOrderSummary", getCustomerOrderSummaryReport);

module.exports = router;