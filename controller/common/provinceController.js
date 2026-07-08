const Province = require("../../model/common/provinceModel");

const getProvince = async (req, res, next) => {
    try {

        const getProvinceData = await Province.find({});

        if (!getProvinceData || getProvinceData.length <= 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No Data Found"
            });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Province Data Fetched Successfully",
            data: getProvinceData
        });

    } catch (error) {
       next(error);
    }
}

module.exports = { getProvince };