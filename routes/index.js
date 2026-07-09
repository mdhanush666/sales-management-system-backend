const AuthRoutes = require("./auth/authRoutes");
const UserRoutes = require("./admin/userRoutes");
const StatusRoutes = require("./admin/statusRoutes");
const ProvinceRoutes = require("./common/provinceRoutes");
const DistrictRoutes = require("./common/districtRoutes");
const CityRoutes = require("./common/cityRoutes");
const CustomerRoutes = require("./common/customerRoutes");
const CategoryRoutes = require("./common/categoryRoutes");
const ProductRoutes = require("./common/productRoutes");
const CartRoutes = require("./user/cartRoutes");
const CartItemRoutes = require("./user/cartItemRoutes");
const OrderRoutes = require("./user/orderRoutes");
const LogRoutes = require("./admin/logRoutes");
const LoginHistoryRoutes = require("./admin/loginHistoryRoutes");
const UserPermissionRoutes = require("./admin/userPermissionRoutes");
// Reports Routes..
const ReportRoutes = require("./admin/reports/reportRotues");


module.exports = (app) => {
    // app.use("", (req, res) => {
    //     return res.send("Welcome to Sales Management System API's");
    // });
    app.use("/api/v1/auth", AuthRoutes);
    app.use("/api/v1/users", UserRoutes);
    app.use("/api/v1/status", StatusRoutes);
    app.use("/api/v1/province", ProvinceRoutes);
    app.use("/api/v1/district", DistrictRoutes);
    app.use("/api/v1/city", CityRoutes);
    app.use("/api/v1/customer", CustomerRoutes);
    app.use("/api/v1/category", CategoryRoutes);
    app.use("/api/v1/product", ProductRoutes);
    app.use("/api/v1/cart", CartRoutes);
    app.use("/api/v1/cartItem", CartItemRoutes);
    app.use("/api/v1/order", OrderRoutes);
    app.use("/api/v1/log", LogRoutes);
    app.use("/api/v1/loginHistory", LoginHistoryRoutes);
    app.use("/api/v1/user-permission", UserPermissionRoutes);
    // Report Routes..
    app.use("/api/v1/reports", ReportRoutes);

};