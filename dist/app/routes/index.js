"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const books_route_1 = __importDefault(require("./books.route"));
const borrow_route_1 = __importDefault(require("./borrow.route"));
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/books",
        route: books_route_1.default,
    },
    {
        path: "/borrow",
        route: borrow_route_1.default,
    },
];
moduleRoutes.forEach((route) => exports.router.use(route.path, route.route));
