const Order = require("../../../model/user/orderModel");

const getCustomerOrderSummaryReport = async (req, res, next) => {
    try {
        const report = await Order.aggregate([
            // Join Cart
            {
                $lookup: {
                    from: "carts",
                    localField: "cartID",
                    foreignField: "_id",
                    as: "cart"
                }
            },
            { $unwind: "$cart" },

            // Join Customer
            {
                $lookup: {
                    from: "customers",
                    localField: "customerID",
                    foreignField: "_id",
                    as: "customer"
                }
            },
            { $unwind: "$customer" },

            // Join Sales Rep (User)
            {
                $lookup: {
                    from: "users",
                    localField: "salesRepID",
                    foreignField: "_id",
                    as: "salesRep"
                }
            },
            { $unwind: "$salesRep" },

            // Group by customer + rep
            {
                $group: {
                    _id: {
                        customerID: "$customer._id",
                        salesRepID: "$salesRep._id"
                    },
                    customerName: { $first: "$customer.shopName" },
                    customerCode: { $first: "$customer.customerCode" },
                    salesRepName: { $first: "$salesRep.name" },
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: "$cart.totalAmount" },
                    lastOrderDate: { $max: "$orderDate" }
                }
            },

            { $sort: { totalAmount: -1 } }
        ]);

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Customer Order Summary Generated Successfully",
            data: report
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getCustomerOrderSummaryReport };