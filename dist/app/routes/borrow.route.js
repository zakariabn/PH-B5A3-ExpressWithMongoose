"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const borrow_controller_1 = require("../controllers/borrow.controller");
const borrowRouter = express_1.default.Router();
borrowRouter.post("/", borrow_controller_1.borrowBook);
borrowRouter.get("/", borrow_controller_1.summary);
exports.default = borrowRouter;
