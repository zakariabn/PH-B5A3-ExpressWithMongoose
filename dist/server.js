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
const app_1 = __importDefault(require("./app"));
require("dotenv/config");
const db_1 = require("./app/utils/db");
const port = process.env.PORT || 5000;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //db connection
            (0, db_1.connectToDatabase)().catch((err) => {
                console.error("Startup database connection failed:", err);
            });
            app_1.default.listen(port, () => {
                console.log(`🟢 App listening on port: ${port}`);
            });
        }
        catch (error) {
            console.error("❌ Failed to start server:", error);
            process.exit(1);
        }
    });
}
// function call
main();
