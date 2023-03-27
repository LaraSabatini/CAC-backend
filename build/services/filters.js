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
exports.deleteFilter = exports.createFilter = exports.getFilters = void 0;
const index_1 = __importDefault(require("../database/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const getFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.params;
        const [filters] = yield index_1.default.query(`SELECT * FROM ${type}`);
        if (filters) {
            return res
                .status(statusCodes_1.default.OK)
                .json({ data: filters, status: statusCodes_1.default.OK });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.getFilters = getFilters;
const createFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { value, type } = req.body;
        const insertFilter = yield index_1.default.query(`INSERT INTO ${type} (value) VALUES ('${value}');`);
        if (insertFilter) {
            return res.status(statusCodes_1.default.CREATED).json({
                message: "Filter created successfully",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while creating the filter, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.createFilter = createFilter;
const deleteFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, type } = req.params;
        const [filter] = yield index_1.default.query(`DELETE FROM ${type} WHERE id=${id}`);
        if (filter) {
            res.status(statusCodes_1.default.CREATED);
            res.send({
                message: "Filter deleted successfully",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while deleting the filter, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.deleteFilter = deleteFilter;
