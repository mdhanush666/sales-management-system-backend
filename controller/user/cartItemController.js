const CartItem = require("../../model/user/cartItemModel");
require("../../model/user/cartModel");
require("../../model/common/productModel");



const getCartItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { cartID, productID } = req.query;

        let filters = {};

        if (id) {
            const getCartItemData = await CartItem.findById(id)
                .populate("productID", "modelNo name productImage")
                .populate("cartID", "cartCode totalAmount statusID");

            if (!getCartItemData || getCartItemData.length === 0) {
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
                message: "Cart Items Received Successfully",
                data: getCartItemData
            });
        }

        if (cartID) filters.cartID = cartID;
        if (productID) filters.productID = productID;

        const getCartItemData = await CartItem.find(filters)
            .populate("productID", "modelNo name productImage")
            .populate("cartID", "cartCode totalAmount statusID");

        if (!getCartItemData || getCartItemData.length === 0) {
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
            message: "Cart Items Received Successfully",
            data: getCartItemData
        });

    } catch (error) {
        next(error);
    }
}


module.exports = { getCartItem };