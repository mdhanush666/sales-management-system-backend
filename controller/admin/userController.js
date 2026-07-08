const User = require("../../model/admin/userModel");
const Hash = require('object-hash');

const createUser = async (req, res, next) => {
    try {
        const {
            name,
            address,
            phoneNumber,
            userName,
            password,
            profileImage,
            role
        } = req.body;

        if (!name ||
            !address ||
            !phoneNumber ||
            !userName ||
            !password ||
            !role
        ) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Missing Required Fields",
                requiredFields: [
                    "name",
                    "address",
                    "phoneNumber",
                    "userName",
                    "password",
                    "role",
                ]
            });
        }

        const hashedPassword = Hash(password, { algorithm: "md5" })

        if (phoneNumber.length > 10) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Phone Number Can't be greater than 10 Numbers"
            });
        }

        const userData = new User({
            name,
            address,
            phoneNumber,
            userName,
            password: hashedPassword,
            profileImage,
            role
        });

        const newUser = await userData.save();

        return res.status(201).json({
            statusCode: 201,
            success: true,
            message: "User Created Successfully",
            data: newUser
        });
    } catch (error) {
        next(error);
    }
}

const getUsers = async (req, res, next) => {
    try {

        const { id } = req.params;
        const { statusID, userName } = req.query;

        if (id) {
            const getUsers = await User.findById(id);

            if (!getUsers || getUsers.length <= 0) {
                return res.status(404).json({
                    statusCode: 404,
                    success: false,
                    message: "No Data Found!"
                });
            }

            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Users Recevied Successfully",
                data: getUsers
            });
        }

        let filters = {};

        if (statusID) filters.statusID = statusID;
        if (userName) filters.userName = userName;

        const getUsers = await User.find(filters);

        if (!getUsers || getUsers.length <= 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No Data Found!"
            });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Users Recevied Successfully",
            data: getUsers
        });

    } catch (error) {
        next(error);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { name, userName, password, address, phoneNumber, statusID, profileImage, role } = req.body;

        if (!id) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "ID is required when update user!"
            });
        }

        const getUserDetail = await User.findById(id);

        if (!getUserDetail || getUserDetail.length <= 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: `No Data Found for Given ID (${id})`
            });
        }

        if (password) {
            const hashedPassword = Hash(password, { algorithm: "md5" })
            getUserDetail.password = hashedPassword || getUserDetail.password;
        }

        if (phoneNumber.length > 10) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Phone Number Can't be greater than 10 Numbers"
            });
        }

        getUserDetail.name = name || getUserDetail.name;
        getUserDetail.userName = userName || getUserDetail.userName;
        getUserDetail.address = address || getUserDetail.address;
        getUserDetail.phoneNumber = phoneNumber || getUserDetail.phoneNumber;
        getUserDetail.profileImage = profileImage || getUserDetail.profileImage;
        getUserDetail.role = role || getUserDetail.role;
        getUserDetail.statusID = statusID ?? getUserDetail.statusID;

        await User.updateOne({ _id: getUserDetail._id }, { $set: getUserDetail });

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "User Updated Successfully",
            data: getUserDetail
        });

    } catch (error) {
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;


        if (!id) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "ID is required when delete user!"
            });
        }

        const getUserDetail = await User.findById(id);

        if (!getUserDetail || getUserDetail.length <= 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: `No Data Found for Given ID (${id})`
            });
        }

        await User.findByIdAndDelete(id);

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "User Deleted Successfully",
        });

    } catch (error) {
        next(error);
    }
}

module.exports = { createUser, getUsers, updateUser, deleteUser };