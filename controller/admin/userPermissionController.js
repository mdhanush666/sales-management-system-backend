const UserPermission = require("../../model/admin/userPermissionModel");
require("../../model/admin/userModel");

const getUserPermission = async (req, res, next) => {
    try {
        const { userID, assignedBy } = req.query;
        let filters = {};

        if (userID) filters.userID = userID;
        if (assignedBy) filters.assignedBy = assignedBy;

        const getUserPermission = await UserPermission.find(filters)
            .populate("userID", "name role")
            .populate("assignedBy", "name role");

        if (getUserPermission || getUserPermission.length > 0) {
            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "User Permission Received Successfully",
                data: getUserPermission
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
};

// Update or create user permissions (upsert functionality)
const updateUserPermissions = async (req, res) => {
    try {
        const { userID, assignedBy, permissions } = req.body;

        // Upsert the permissions
        const updatedPermission = await UserPermission.findOneAndUpdate(
            { userID },
            {
                assignedBy,
                permissions,
                updatedAt: new Date(),
            },
            {
                new: true,
                upsert: true, // Create if doesn't exist
                runValidators: true,
            }
        );

        return res.status(200).json({
            statusCode: 200,
            success:true,
            message: "User permissions updated successfully",
            data: updatedPermission,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success:false,
            message: "Failed to update user permissions",
            error: error.message,
        });
    }
};

module.exports = { getUserPermission, updateUserPermissions };