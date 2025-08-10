"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const mongoURI = process.env.MONGODB_URI;
let cachedClient = null;
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        if (cachedClient) {
            return cachedClient;
        }
        try {
            const client = yield mongoose_1.default.connect(mongoURI);
            console.log("✅ New database connection successful 1");
            cachedClient = client;
            return client;
        }
        catch (error) {
            console.error("❌ Database connection failed:", error);
            throw error;
        }
    });
}
