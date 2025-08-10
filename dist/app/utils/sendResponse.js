"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
// utils/sendResponse.ts
const sendResponse = (res, statusCode, { success, message, data, errors, }) => {
    return res.status(statusCode).json(Object.assign(Object.assign({ success,
        message }, (data && { data })), (errors && { errors })));
};
exports.sendResponse = sendResponse;
