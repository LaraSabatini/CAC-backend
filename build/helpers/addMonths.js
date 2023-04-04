"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formatDate_1 = __importDefault(require("./formatDate"));
const addMonths = (months, date = new Date()) => {
    date.setMonth(date.getMonth() + months);
    return formatDate_1.default(date);
};
exports.default = addMonths;
