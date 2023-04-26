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
exports.getAllAvailavility = exports.editAvailavility = exports.getAvailavility = exports.createAvailavility = void 0;
const index_1 = __importDefault(require("../database/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const createAvailavility = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId, availability } = req.body;
        //
        const request = yield index_1.default.query(`INSERT INTO advisoryAvailability (adminId, availability) VALUES ('${adminId}', '${availability}');`);
        if (request) {
            return res.status(statusCodes_1.default.CREATED).json({
                message: "success",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Internal error",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.createAvailavility = createAvailavility;
const getAvailavility = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId } = req.params;
        const [request] = yield index_1.default.query(`SELECT * FROM advisoryAvailability WHERE adminId LIKE '${adminId}';`);
        if (request) {
            return res.status(statusCodes_1.default.OK).json({
                data: request,
                status: statusCodes_1.default.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Internal error",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.getAvailavility = getAvailavility;
const editAvailavility = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, adminId, availability } = req.body;
        const [availabilityChange] = yield index_1.default.query(`UPDATE advisoryAvailability SET adminId = '${adminId}', availability = '${availability}' WHERE id = ${id}`);
        if (availabilityChange) {
            return res.status(statusCodes_1.default.CREATED).json({
                message: "success",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Internal error",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.editAvailavility = editAvailavility;
const getAllAvailavility = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [request] = yield index_1.default.query(`SELECT * FROM advisoryAvailability;`);
        if (request) {
            return res.status(statusCodes_1.default.OK).json({
                data: request,
                status: statusCodes_1.default.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Internal error",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.getAllAvailavility = getAllAvailavility;
