const User = require("../../model/admin/userModel");
const LoginHistory = require("../../model/admin/loginHistoryModel");

const Hash = require('object-hash');

const login = async (req, res, next) => {
    try {
        const { userName, password, geoLocation } = req.body;

        if (!userName || !password) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Missing Required Fields",
                requiredFields: ["userName", "password"],
                error: "Bad Request"
            });
        }

        const formatUserName = userName.toLowerCase().trim();

        const userInfo = await User.findOne({ userName: formatUserName }).lean();

        if (!userInfo || userInfo.statusID === 0) {
            // return res.status(404).json({
            //     statusCode: 404,
            //     success: false,
            //     message: `No User Exits with ${formatUserName}`,
            //     error: "Data Not Found"
            // });
            return next({
                statusCode: 404,
                success: false,
                message: `No User Exits with ${formatUserName}`,
                error: "Data Not Found"
            });
        }

        const hashedPassword = Hash(password, { algorithm: "md5" })

        if (hashedPassword !== userInfo.password) {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "Invalid Password",
                error: "Unauthorized Access"
            });
        }

        const loginHistoryData = new LoginHistory({
            userID: userInfo._id,
            geoLocation
        });

        await loginHistoryData.save();

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Login Success",
            data: {
                userID: userInfo._id,
                role: userInfo.role,
            }
        });

    } catch (error) {
        next(error);
    }
}

module.exports = { login };