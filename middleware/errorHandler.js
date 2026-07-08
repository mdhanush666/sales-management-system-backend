const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        statusCode,
        success: false,
        message: err.message || "Internal Server Error",
        errorDetail: process.env.NODE_ENV === "development" ? err.stack : undefined
    });

}

module.exports = errorHandler;