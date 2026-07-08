const City = require("../../model/common/cityModel");
const Province = require("../../model/common/provinceModel");
const District = require("../../model/common/districtModel");

const getCity = async (req, res, next) => {
    try {
        const { id } = req.params
        const { districtID } = req.query;
        let filters = {};

        if (id) {
            const getCityData = await City.findById(id)
                .populate({
                    path: "districtID",
                    model: District,
                    select: "district provinceID",
                    populate: {
                        path: "provinceID",
                        model: Province,
                        select: "province"
                    }
                });

            if (!getCityData || getCityData.length <= 0) {
                return res.status(404).json({
                    statusCode: 404,
                    success: false,
                    message: "No Data Found"
                });
            }

            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "City Data Fetched Successfully",
                data: getCityData
            });
        }

        if (districtID) filters.districtID = districtID;

        const getCityData = await City.find(filters)
            .populate({
                path: "districtID",
                model: District,
                select: "district provinceID",
                populate: {
                    path: "provinceID",
                    model: Province,
                    select: "province"
                }
            });

        if (!getCityData || getCityData.length <= 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No Data Found"
            });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "City Data Fetched Successfully",
            data: getCityData
        });

    } catch (error) {
       next(error);
    }
}
const addCity = async (req, res, next) => {
    try {

        const { city, districtID } = req.body;

        if (!city || !districtID) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Missing Required Fields",
                requiredFields: [
                    "city",
                    "districtID",
                ]
            });
        }

        const existingCity = await City.findOne({ city, districtID })
            .populate({
                path: "districtID",
                model: District,
                select: "district"
            });

        if (existingCity) {
            return res.status(409).json({
                statusCode: 409,
                success: false,
                message: `City (${city}) Already Available In District (${existingCity.districtID.district}) `,
                error: "Conflict"
            });
        }

        const cityData = new City({
            city,
            districtID
        });

        const newCity = await cityData.save();

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "City Added Successfully",
            data: newCity
        });

    } catch (error) {
       next(error);
    }
}
const updateCity = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { city } = req.body;

        if (!id) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "ID is required when update city!"
            });
        }

        const getCityDetail = await City.findById(id);

        if (!getCityDetail || getCityDetail.length <= 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: `No Data Found for Given ID (${id})`
            });
        }

        getCityDetail.city = city || getCityDetail.city;

        await City.updateOne({ _id: getCityDetail._id }, { $set: getCityDetail });

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "City Updated Successfully",
            data: getCityDetail
        });

    } catch (error) {
       next(error);
    }
}

module.exports = { getCity, addCity, updateCity };