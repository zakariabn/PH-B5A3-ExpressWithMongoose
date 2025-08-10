"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const luxon_1 = require("luxon");
const defaultDue = 3;
const borrowSchema = new mongoose_1.default.Schema({
    book: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "books",
        required: true,
    },
    quantity: {
        type: Number,
        min: 1,
        required: true,
    },
    dueDate: {
        type: Date,
        // required: true,
        // default: () => DateTime.now().plus({ days: defaultDue }).toJSDate(),
    },
}, { timestamps: true, versionKey: false });
// --- Pre middleware
borrowSchema.pre("save", function (next) {
    if (!this.dueDate) {
        this.dueDate = luxon_1.DateTime.now().plus({ days: defaultDue }).toJSDate();
    }
    next();
});
// --- Post middleware
borrowSchema.post("save", function (doc, next) {
    console.log(`✅ Borrow record saved for book ID: ${doc.book}`);
    next();
});
borrowSchema.method("isOverdue", function () {
    return this.dueDate < new Date();
});
const Borrow = (0, mongoose_1.model)("borrow", borrowSchema);
exports.default = Borrow;
