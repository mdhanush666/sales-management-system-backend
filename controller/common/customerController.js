const City = require("../../model/common/cityModel");
const Province = require("../../model/common/provinceModel");
const District = require("../../model/common/districtModel");
const User = require("../../model/admin/userModel");

const Customer = require("../../model/common/customerModel");

const getCustomer = async (req, res, next) => {
    try {
        const { id } = req.params
        const { customerCode, statusID, salesRepID } = req.query;
        let filters = {};

        if (id) {
            const getCustomerData = await Customer.findById(id)
                .populate({
                    path: "cityID",
                    model: City,
                    select: "city districtID",
                    populate: {
                        path: "districtID",
                        model: District,
                        select: "district provinceID",
                        populate: {
                            path: "provinceID",
                            model: Province,
                            select: "province",

                        }
                    }
                })
                .populate({
                    path: "salesRepID",
                    model: User,
                    select: "name",
                });

            if (!getCustomerData || getCustomerData.length <= 0) {
                return res.status(404).json({
                    statusCode: 404,
                    success: false,
                    message: "No Data Found"
                });
            }

            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Customer Data Fetched Successfully",
                data: getCustomerData
            });
        }

        if (customerCode) filters.customerCode = customerCode;
        if (salesRepID) filters.salesRepID = salesRepID;
        if (statusID) filters.statusID = statusID;

        const getCustomerData = await Customer.find(filters)
            .populate({
                path: "cityID",
                model: City,
                select: "city districtID",
                populate: {
                    path: "districtID",
                    model: District,
                    select: "district provinceID",
                    populate: {
                        path: "provinceID",
                        model: Province,
                        select: "province",

                    }
                }
            })
            .populate({
                path: "salesRepID",
                model: User,
                select: "name",
            });

        if (!getCustomerData || getCustomerData.length <= 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No Data Found"
            });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Customer Data Fetched Successfully",
            data: getCustomerData
        });

    } catch (error) {
        next(error);
    }
}

const createCustomer = async (req, res, next) => {
    try {
        const { shopName, address, contactNo, cityID, salesRepID, statusID } = req.body;

        if (!shopName || !address || !contactNo || !cityID || !salesRepID || !statusID) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Missing Required Fields",
                requiredFields: [
                    "shopName", "address", "contactNo", "cityID", "salesRepID", "statusID",
                ]
            });
        }

        const existingCustomer = await Customer.findOne({ shopName, contactNo, address, cityID, salesRepID });

        if (existingCustomer) {
            return res.status(409).json({
                statusCode: 409,
                success: false,
                message: `Customer Already Exits`,
                duplicateFields: ["shopName", "contactNo", "address", "city", "salesRep"],
                error: "Conflict"
            });
        }

        const existingCustomerContactNo = await Customer.findOne({ contactNo });

        if (existingCustomerContactNo) {
            return res.status(409).json({
                statusCode: 409,
                success: false,
                message: `Customer Contact Number Already Exits`,
                duplicateFields: ["contactNo"],
                error: "Conflict"
            });
        }

        if (contactNo.length != 10) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: `Contact Number Must be Length 10`,
                error: "Bad Request"
            });
        }

        // Customer Code Generation..

        const prefix = `C${shopName.trim().substring(0, 3).toUpperCase()}`;
        const count = await Customer.countDocuments({ customerCode: { $regex: `^${prefix}` } });

        const paddedNumber = String(count + 1).padStart(4, '0');
        const customerCode = `${prefix}${paddedNumber}`;

        const customerData = new Customer({
            customerCode, shopName, address, contactNo, cityID, salesRepID, statusID
        });

        const newCustomer = await customerData.save();

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Customer Registered Successfully",
            data: newCustomer
        });

    } catch (error) {
        next(error);
    }
}

const updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { shopName, address, contactNo, cityID, salesRepID, statusID } = req.body;

        if (!id) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "ID is required when update Customer!"
            });
        }

        const getCustomerDetail = await Customer.findById(id);

        if (!getCustomerDetail || getCustomerDetail.length <= 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: `No Data Found for Given ID (${id})`
            });
        }

        const existingCustomerContactNo = await Customer.findOne({ contactNo });

        if (existingCustomerContactNo && existingCustomerContactNo._id != id) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Contact Number Already Used!",
                error: "Bad Request"
            });
        }

        getCustomerDetail.shopName = shopName || getCustomerDetail.shopName;
        getCustomerDetail.address = address || getCustomerDetail.address;
        getCustomerDetail.contactNo = contactNo || getCustomerDetail.contactNo;
        getCustomerDetail.cityID = cityID || getCustomerDetail.cityID;
        getCustomerDetail.salesRepID = salesRepID || getCustomerDetail.salesRepID;
        getCustomerDetail.statusID = statusID ?? getCustomerDetail.statusID;

        await Customer.updateOne({ _id: getCustomerDetail._id }, { $set: getCustomerDetail });

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Customer Updated Successfully",
            data: getCustomerDetail
        });

    } catch (error) {
        next(error);
    }
}

module.exports = { getCustomer, createCustomer, updateCustomer };