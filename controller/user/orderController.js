const Order = require("../../model/user/orderModel");
const User = require("../../model/admin/userModel");
const Customer = require("../../model/common/customerModel");
require("../../model/user/cartModel");


const createOrder = async (req, res, next) => {
    try {

        const { cartID, customerID, salesRepID, statusID } = req.body;

        if (!cartID || !customerID || !salesRepID || !statusID) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Missing Required Fields",
                requiredFields: ["cartID", "customerID", "salesRepID", "statusID"],
                error: "Bad Request"
            });
        }

        const getCustomerDetail = await Customer.findById(customerID);
        const getSalesRepDetail = await User.findById(salesRepID);

        if (!getCustomerDetail || getCustomerDetail.length <= 0) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: `No Customer Found for ID : ${customerID}`,
                error: "Bad Request"
            });
        }
        if (!getSalesRepDetail || getSalesRepDetail.length <= 0) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: `No Sales Rep Found for ID : ${salesRepID}`,
                error: "Bad Request"
            });
        }

        const existingCartID = await Order.findOne({ cartID })
            .populate("cartID", "cartCode");

        if (existingCartID) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: `Cart ${existingCartID.cartID.cartCode} Has Already An Order (${existingCartID.orderCode})`,
                error: "Bad Request"
            });
        }

        // Order Code Generation..
        const extractCustomer = (getCustomerDetail.shopName).trim().substring(0, 3).toUpperCase();
        const extractSalesRep = (getSalesRepDetail.name).trim().substring(0, 1).toUpperCase();

        const prefix = `O${extractCustomer}${extractSalesRep}`;
        const count = await Order.countDocuments({ orderCode: { $regex: `^${prefix}` } });
        const paddedNumber = String(count + 1).padStart(5, '0');
        const orderCode = `${prefix}${paddedNumber}`;

        const orderData = new Order({
            orderCode,
            cartID,
            customerID,
            salesRepID,
            statusID
        });

        const newOrderData = await orderData.save();

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Order Created Successfully",
            data: newOrderData
        });

    } catch (error) {
        next(error);
    }
}

const getOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { orderCode, cartID, customerID, salesRepID, statusID } = req.query;

        let filters = {};

        if (id) {
            const getOrderData = await Order.findById(id)
                .populate("customerID", "customerCode shopName")
                .populate("salesRepID", "name")
                .populate("cartID", "cartCode totalAmount")
                .sort({ "orderDate": -1 });

            if (!getOrderData || getOrderData.length === 0) {
                return res.status(404).json({
                    statusCode: 404,
                    success: false,
                    message: "No Data Found",
                    error: "Data Not Found"
                });
            }

            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Order Data Received Successfully",
                data: getOrderData
            });
        }

        if (orderCode) filters.orderCode = orderCode;
        if (cartID) filters.cartID = cartID;
        if (customerID) filters.customerID = customerID;
        if (salesRepID) filters.salesRepID = salesRepID;
        if (statusID) filters.statusID = statusID;

        const getOrderData = await Order.find(filters)
            .populate("customerID", "customerCode shopName")
            .populate("salesRepID", "name")
            .populate("cartID", "cartCode totalAmount")
            .sort({ "orderDate": -1 });

        if (!getOrderData || getOrderData.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No Data Found",
                error: "Data Not Found"
            });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Order Data Received Successfully",
            data: getOrderData
        });

    } catch (error) {
        next(error);
    }
}

const updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { statusID } = req.body;

        const getOrderData = await Order.findById(id)
            .populate("customerID", "customerCode shopName")
            .populate("salesRepID", "name");

        if (!getOrderData || getOrderData.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No Data Found",
                error: "Data Not Found"
            });
        }

        getOrderData.statusID = statusID ?? getOrderData.statusID;

        await Order.updateOne({ _id: getOrderData._id }, { $set: getOrderData });

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Order Updated Successfully",
            data: getOrderData
        });


    } catch (error) {
        next(error);
    }
}


module.exports = { createOrder, getOrder, updateOrder };