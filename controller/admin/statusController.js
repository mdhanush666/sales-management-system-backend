const Status = require("../../model/admin/statusModel");

const createStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Status is required!",
                error: "Bad Request"
            });
        }

        const existingStatus = await Status.findOne({ status });

        if (existingStatus) {
            return res.status(409).json({
                statusCode: 409,
                success: false,
                message: `Duplicate Entry Status (${status}) Already Found`,
                error: "Conflict"
            });
        }

        // Get the last status entry sorted by statusID descending
        const lastStatus = await Status.findOne().sort({ statusID: -1 });

        // Determine the next statusID
        const nextStatusID = (lastStatus.statusID ?? -1) + 1;
        // Create and save the new status
        const newStatus = new Status({
            status,
            statusID: nextStatusID
        });

        await newStatus.save();

        return res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Status created successfully",
            data: newStatus
        });

    } catch (error) {
        next(error);
    }
};

const getStatus = async (req, res, next) => {
    try {

        const getStatusInfo = await Status.find({}).sort({ statusID: 1 });

        if (getStatusInfo || getStatusInfo.length > 0) {
            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Status Data Received Successfully",
                data: getStatusInfo
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

module.exports = { createStatus, getStatus };