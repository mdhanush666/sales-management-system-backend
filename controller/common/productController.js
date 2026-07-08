const Product = require("../../model/common/productModel");
require("../../model/common/categoryModel");

const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params
        const { categoryID, statusID } = req.query;
        let filters = {};

        if (id) {
            const getProductData = await Product.findById(id)
                .populate("categoryID", "category");

            if (!getProductData || getProductData.length <= 0) {
                return res.status(404).json({
                    statusCode: 404,
                    success: false,
                    message: "No Data Found"
                });
            }

            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Product Data Fetched Successfully",
                data: getProductData
            });
        }

        if (categoryID) filters.categoryID = categoryID;
        if (statusID) filters.statusID = statusID;

        const getProductData = await Product.find(filters)
            .populate("categoryID", "category");

        if (!getProductData || getProductData.length <= 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No Data Found"
            });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Product Data Fetched Successfully",
            data: getProductData
        });

    } catch (error) {
       next(error);
    }
}

const createProduct = async (req, res, next) => {
    try {

        const {
            name,
            description,
            modelNo,
            price,
            productImage,
            categoryID,
            statusID
        } = req.body;

        if (
            !name ||
            !description ||
            !modelNo ||
            !price ||
            // !productImage ||
            !categoryID ||
            !statusID
        ) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Missing Required Fields",
                requiredFields: [
                    "name",
                    "description",
                    "modelNo",
                    "price",
                    // "productImage",
                    "categoryID",
                    "statusID"
                ]
            });
        }

        const existingProduct = await Product.findOne({ modelNo });

        if (existingProduct) {
            return res.status(409).json({
                statusCode: 409,
                success: false,
                message: `Product ModelNo (${modelNo}) Already Exits `,
                error: "Conflict"
            });
        }

        const productData = new Product({
            name,
            description,
            modelNo,
            price,
            productImage,
            categoryID,
            statusID
        });

        const newProduct = await productData.save();

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Product Created Successfully",
            data: newProduct
        });

    } catch (error) {
       next(error);
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            name,
            description,
            price,
            productImage,
            categoryID,
            statusID
        } = req.body;

        if (!id) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "ID is required when update Product!"
            });
        }

        const getProductDetail = await Product.findById(id);

        if (!getProductDetail || getProductDetail.length <= 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: `No Data Found for Given ID (${id})`
            });
        }

        getProductDetail.name = name || getProductDetail.name;
        getProductDetail.description = description || getProductDetail.description;
        getProductDetail.price = price || getProductDetail.price;
        getProductDetail.productImage = productImage || getProductDetail.productImage;
        getProductDetail.categoryID = categoryID || getProductDetail.categoryID;
        getProductDetail.statusID = statusID ?? getProductDetail.statusID;

        await Product.updateOne({ _id: getProductDetail._id }, { $set: getProductDetail });

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Product Updated Successfully",
            data: getProductDetail
        });

    } catch (error) {
       next(error);
    }
}

module.exports = { getProduct, createProduct, updateProduct };