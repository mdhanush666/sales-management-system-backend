const Order = require("../../../model/user/orderModel");

const getLeadboardReport = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        let filters = {};

        if (!startDate && !endDate) {
            // Default: current month
            const now = new Date();
            // year, month, day, hour, minute, second, millisecond
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

            filters.orderDate = { $gte: firstDay, $lte: lastDay };
        } else {
            filters.orderDate = {};
            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0); // start of day
                filters.orderDate.$gte = start;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // end of day
                filters.orderDate.$lte = end;
            }
        }

        filters.statusID = 3;

        let result = await Order.aggregate([
            { $match: filters },
            {
                $lookup: {
                    from: "carts",
                    localField: "cartID",
                    foreignField: "_id",
                    as: "cartDetail"
                }
            },
            { $unwind: "$cartDetail" },
            {
                $group: {
                    _id: "$salesRepID",
                    orderCount: { $sum: 1 },
                    totalAmount: { $sum: "$cartDetail.totalAmount" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetail"
                }
            },
            { $unwind: "$userDetail" },
            {
                $project: {
                    _id: 1,
                    userName: "$userDetail.name",
                    orderCount: 1,
                    totalAmount: 1
                }
            },
            { $sort: { orderCount: -1, totalAmount: -1 } }
        ]);

        if (result && result.length > 0) {
            let topSale = 0, totalOrders = 0, participants = result.length, totalSales = 0;
            let summaryInfo = {};

            for (var ele of result) {
                topSale = topSale > ele.totalAmount ? topSale : ele.totalAmount;
                totalOrders += ele.orderCount;
                totalSales += ele.totalAmount;
            }

            summaryInfo.topSale = topSale;
            summaryInfo.totalOrders = totalOrders;
            summaryInfo.totalSales = totalSales;
            summaryInfo.participants = participants;

            result = result.map((ele, index) => ({
                rank: index + 1,
                ...ele,
            }));

            const finalResult = {
                "leaderBoardData": result,
                summaryInfo
            }


            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Leaderboard Data Fetched Successfully",
                data: finalResult
            });
        }

        return res.status(404).json({
            statusCode: 404,
            success: false,
            message: "No Data Found",
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { getLeadboardReport };