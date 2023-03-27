"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
const index_1 = __importDefault(require("../config/index"));
const pool = promise_1.createPool({
    host: index_1.default.DB.host,
    user: index_1.default.DB.user,
    password: index_1.default.DB.password,
    database: index_1.default.DB.database,
});
exports.default = pool;
