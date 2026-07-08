const LoginHistory = require("../../model/admin/loginHistoryModel");
require("../../model/admin/userModel");

const createLoginHistory = async (req, res, next) => {
    try {
        const { userID, geoLocation } = req.body;

        if (!userID || !geoLocation) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Missing Required Fields",
                requiredFields: ["userID", "geoLocation"],
                error: "Bad Request"
            });
        }

        const loginHistoryData = new LoginHistory({
            userID,
            geoLocation
        });

        await loginHistoryData.save();

        return res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Login History Saved successfully"
        });

    } catch (error) {
        next(error);
    }
};

const getLoginHistory = async (req, res, next) => {
    try {
        const { userID } = req.query;
        let filters = {};

        if (userID) filters.userID = userID;

        const getLoginHistories = await LoginHistory.find(filters)
            .populate("userID", "name role")
            .sort({ loginDate: -1 });

        if (getLoginHistories || getLoginHistories.length > 0) {
            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Login Histories Received Successfully",
                data: getLoginHistories
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

module.exports = { createLoginHistory, getLoginHistory };