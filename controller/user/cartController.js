const Cart = require("../../model/user/cartModel");
const CartItem = require("../../model/user/cartItemModel");
const User = require("../../model/admin/userModel");
const Customer = require("../../model/common/customerModel");


const createCart = async (req, res, next) => {
    try {

        const { products, totalAmount, customerID, salesRepID, statusID } = req.body;

        if (!products || products.length <= 0 || !totalAmount || !customerID || !salesRepID || !statusID) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Missing Required Fields",
                requiredFields: ["products", "totalAmount", "customerID", "salesRepID", "statusID"],
                error: "Bad Request"
            });
        }

        if (!Array.isArray(products)) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Products Must Be An Array Type",
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

        // Cart Code Generation..
        const extractCustomer = (getCustomerDetail.shopName).trim().substring(0, 3).toUpperCase();
        const extractSalesRep = (getSalesRepDetail.name).trim().substring(0, 1).toUpperCase();

        const prefix = `C${extractCustomer}${extractSalesRep}`;
        const count = await Cart.countDocuments({ cartCode: { $regex: `^${prefix}` } });
        const paddedNumber = String(count + 1).padStart(5, '0');
        const cartCode = `${prefix}${paddedNumber}`;

        const cartData = new Cart({
            cartCode,
            totalAmount,
            customerID,
            salesRepID,
            statusID
        });

        const newCartData = await cartData.save();

        for (let product of products) {
            const item = new CartItem({
                cartID: newCartData._id,
                productID: product.productID,
                quantity: product.quantity,
                price: product.price
            });
            await item.save();
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Cart Created Successfully",
            data: newCartData
        });

    } catch (error) {
       next(error);
    }
}

const getCart = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { customerID, salesRepID, statusID } = req.query;

        let filters = {};

        if (id) {
            const getCartData = await Cart.findById(id)
                .populate("customerID", "customerCode shopName")
                .populate("salesRepID", "name");

            if (!getCartData || getCartData.length === 0) {
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
                message: "Cart Data Received Successfully",
                data: getCartData
            });
        }

        if (customerID) filters.customerID = customerID;
        if (salesRepID) filters.salesRepID = salesRepID;
        if (statusID) filters.statusID = statusID;

        const getCartData = await Cart.find(filters)
            .populate("customerID", "customerCode shopName")
            .populate("salesRepID", "name");

        if (!getCartData || getCartData.length === 0) {
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
            message: "Cart Data Received Successfully",
            data: getCartData
        });

    } catch (error) {
       next(error);
    }
}

const updateCart = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { statusID } = req.body;

        const getCartData = await Cart.findById(id)
            .populate("customerID", "customerCode shopName")
            .populate("salesRepID", "name");

        if (!getCartData || getCartData.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No Data Found",
                error: "Data Not Found"
            });
        }

        getCartData.statusID = statusID ?? getCartData.statusID;

        await Cart.updateOne({ _id: getCartData._id }, { $set: getCartData });

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Cart Updated Successfully",
            data: getCartData
        });


    } catch (error) {
       next(error);
    }
}


module.exports = { createCart, getCart, updateCart };