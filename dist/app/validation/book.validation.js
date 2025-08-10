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
exports.bookQuerySchema = exports.updateBookRequestBodyZodSchema = exports.bookZodSchema = exports.genreEnum = void 0;
const z = __importStar(require("zod/v4"));
exports.genreEnum = z.enum([
    "FICTION",
    "NON_FICTION",
    "SCIENCE",
    "HISTORY",
    "BIOGRAPHY",
    "FANTASY",
]);
exports.bookZodSchema = z.object({
    title: z.string().trim(),
    author: z.string().trim(),
    genre: exports.genreEnum,
    isbn: z.string(),
    copies: z.number().min(1),
    available: z.boolean().default(true),
    description: z.string().trim().optional(),
});
exports.updateBookRequestBodyZodSchema = z.object({
    copies: z
        .number("Copies should be a number value")
        .min(1, "Copies value must be a positive number"),
});
exports.bookQuerySchema = z.object({
    filter: exports.genreEnum.optional(),
    sortBy: z.string().optional().default("createdAt"),
    // sortBy: z
    //   .enum(["title", "author", "copies", "createdAt", "updatedAt"])
    //   .optional()
    //   .default("createdAt"),
    sort: z.enum(["desc", "asc"]).optional().default("desc"), // optionally validate allowed values
    limit: z
        .string()
        .regex(/^\d+$/, "Limit must be a positive integer")
        .transform((val) => parseInt(val, 10))
        .optional()
        .default(10),
    skip: z
        .string()
        .regex(/^\d+$/, "Skip must be a positive integer")
        .transform((val) => parseInt(val, 10))
        .optional()
        .default(0),
    page: z
        .string()
        .regex(/^\d+$/, "Skip must be a positive integer")
        .transform((val) => parseInt(val, 10))
        .optional()
        .default(1),
});
