const Log = require("../../model/admin/logModel");
require("../../model/admin/userModel");

const createLog = async (req, res, next) => {
    try {
        const { userID, ui, method, errorMsg } = req.body;

        if (!userID || !ui || !method || !errorMsg) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Missing Required Fields",
                requiredFields: ["userID", "ui", "method", "errorMsg"],
                error: "Bad Request"
            });
        }

        const logData = new Log({
            userID,
            ui,
            method,
            errorMsg
        });

        await logData.save();

        return res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Log Saved successfully"
        });

    } catch (error) {
        next(error);
    }
};

const getLog = async (req, res, next) => {
    try {
        const { userID } = req.query;
        let filters = {};

        if (userID) filters.userID = userID;

        const getLogs = await Log.find(filters)
            .populate("userID", "name role");

        if (getLogs || getLogs.length > 0) {
            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Logs Received Successfully",
                data: getLogs
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

module.exports = { createLog, getLog };