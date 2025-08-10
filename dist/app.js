"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = __importDefault(require("./app/middleware/errorHandler"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./app/routes");
const app = (0, express_1.default)();
//for body parser
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        // Local frontend during development
        "http://localhost:5173",
        // Production frontend
        "https://library-management-client-silk.vercel.app",
    ],
    // credentials: true,
}));
// routes
app.use("/api", routes_1.router);
// root path
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to library management app",
    });
});
// global error handler
app.use(errorHandler_1.default);
// 404 route
app.use((req, res, next) => {
    try {
        res.status(404).json({
            success: false,
            message: `Your request path doesn't exist.`,
            path: req.originalUrl,
        });
    }
    catch (error) {
        console.log("Something went wrong");
        res.status(500).json({
            success: false,
            message: `Something went wrong`,
            error,
        });
    }
    finally {
        next();
    }
});
exports.default = app;
