const District = require("../../model/common/districtModel");
require("../../model/common/provinceModel");

const getDistrict = async (req, res, next) => {
    try {
        const { provinceID } = req.query;
        let filters = {};

        if (provinceID) filters.provinceID = provinceID;

        const getDistrictData = await District.find(filters).populate("provinceID", "province");

        if (!getDistrictData || getDistrictData.length <= 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No Data Found"
            });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "District Data Fetched Successfully",
            data: getDistrictData
        });

    } catch (error) {
       next(error);
    }
}

module.exports = { getDistrict };