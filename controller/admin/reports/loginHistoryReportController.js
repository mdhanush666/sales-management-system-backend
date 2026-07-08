const LoginHistory = require("../../../model/admin/loginHistoryModel");
require("../../../model/admin/userModel");
const mongoose = require('mongoose');

const getLoginHistoryReport = async (req, res, next) => {
    try {
        const { userID, startDate, endDate, role, reportType } = req.query;
        let filters = {};

        // Fix userID filter
        if (userID) {
            filters.userID = new mongoose.Types.ObjectId(userID);
        }

        // Date range filter
        if (startDate || endDate) {
            filters.loginDate = {};
            if (startDate) filters.loginDate.$gte = new Date(startDate).setHours(0, 0, 0, 0);
            if (endDate) filters.loginDate.$lte = new Date(endDate).setHours(23, 59, 59, 999);
        }

        let result;

        switch (reportType) {
            case 'user-summary':
                result = await LoginHistory.aggregate([
                    { $match: filters },
                    {
                        $group: {
                            _id: "$userID",
                            totalLogins: { $sum: 1 },
                            firstLogin: { $min: "$loginDate" },
                            lastLogin: { $max: "$loginDate" }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "_id",
                            foreignField: "_id",
                            as: "userDetails"
                        }
                    },
                    {
                        $unwind: "$userDetails"
                    },
                    //Basic Filters..
                    ...(role ? [{ $match: { "userDetails.role": role } }] : []),

                    {
                        $project: {
                            _id: 0,
                            userID: "$_id",
                            userName: "$userDetails.name",
                            userRole: "$userDetails.role",
                            totalLogins: 1,
                            firstLogin: 1,
                            lastLogin: 1
                        }
                    },
                    { $sort: { totalLogins: -1 } }
                ]);
                break;
            default:
                result = {
                    message: "Enter a valid report type!"
                };
        }

        if (result && (Array.isArray(result) ? result.length > 0 : true)) {
            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Login History Report Generated Successfully",
                data: result
            });
        }

        return res.status(404).json({
            statusCode: 404,
            success: false,
            message: "No Data Found!"
        });

    } catch (error) {
        next(error);
    }
}

module.exports = { getLoginHistoryReport };