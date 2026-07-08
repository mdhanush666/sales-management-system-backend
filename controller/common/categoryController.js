const Category = require("../../model/common/categoryModel");

const getCategory = async (req, res, next) => {
    try {
        const { id } = req.params
        const { statusID } = req.query;
        let filters = {};

        if (id) {
            const getCategoryData = await Category.findById(id);

            if (!getCategoryData || getCategoryData.length <= 0) {
                return res.status(404).json({
                    statusCode: 404,
                    success: false,
                    message: "No Data Found"
                });
            }

            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Category Data Fetched Successfully",
                data: getCategoryData
            });
        }

        if (statusID) filters.statusID = statusID;

        const getCategoryData = await Category.find(filters);

        if (!getCategoryData || getCategoryData.length <= 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No Data Found"
            });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Category Data Fetched Successfully",
            data: getCategoryData
        });

    } catch (error) {
       next(error);
    }
}

const createCategory = async (req, res, next) => {
    try {

        const { category, statusID } = req.body;

        if (!category || !statusID) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Missing Required Fields",
                requiredFields: [
                    "category",
                    "statusID",
                ]
            });
        }

        const existingCategory = await Category.findOne({ category });

        if (existingCategory) {
            return res.status(409).json({
                statusCode: 409,
                success: false,
                message: `Category (${category}) Already Exits`,
                error: "Conflict"
            });
        }

        const prefix = `CAT${category.trim().substring(0, 1).toUpperCase()}`;
        const count = await Category.countDocuments({ categoryCode: { $regex: `^${prefix}` } });
        const paddedNumber = String(count + 1).padStart(4, '0');
        const categoryCode = `${prefix}${paddedNumber}`;

        const categoryData = new Category({
            categoryCode,
            category,
            statusID
        });

        const newCategory = await categoryData.save();

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Category Created Successfully",
            data: newCategory
        });

    } catch (error) {
       next(error);
    }
}

const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { category, statusID } = req.body;

        if (!id) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "ID is required when update category!"
            });
        }

        const getCategoryDetail = await Category.findById(id);

        if (!getCategoryDetail || getCategoryDetail.length <= 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: `No Data Found for Given ID (${id})`
            });
        }

        const existingCategory = await Category.findOne({ category });

        if (existingCategory && existingCategory._id != id) {
            return res.status(409).json({
                statusCode: 409,
                success: false,
                message: `Category Already Exits`,
                duplicateFields: ["category"],
                error: "Conflict"
            });
        }

        getCategoryDetail.category = category || getCategoryDetail.category;
        getCategoryDetail.statusID = statusID ?? getCategoryDetail.statusID;

        await Category.updateOne({ _id: getCategoryDetail._id }, { $set: getCategoryDetail });

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Category Updated Successfully",
            data: getCategoryDetail
        });

    } catch (error) {
       next(error);
    }
}

module.exports = { getCategory, createCategory, updateCategory };