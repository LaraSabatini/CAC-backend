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
exports.editAdminData = exports.getAdminName = exports.getAdmins = void 0;
const index_1 = __importDefault(require("../database/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const getAdmins = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [admins] = yield index_1.default.query(`SELECT id, userName, email FROM admin`);
        if (admins) {
            return res.status(statusCodes_1.default.OK).json({
                data: admins,
                status: statusCodes_1.default.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.OK).json({
            message: "An error has occurred, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.getAdmins = getAdmins;
const getAdminName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [admin] = yield index_1.default.query(`SELECT userName FROM admin WHERE id = '${id}'`);
        if (admin) {
            return res.status(statusCodes_1.default.OK).json({
                data: admin,
                status: statusCodes_1.default.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.OK).json({
            message: "An error has occurred, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.getAdminName = getAdminName;
const editAdminData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, userName, email } = req.body;
        const [admin] = yield index_1.default.query(`UPDATE admin SET email = '${email}', userName = '${userName}' WHERE id = ${id}`);
        if (admin) {
            return res.status(statusCodes_1.default.OK).json({
                data: "success",
                status: statusCodes_1.default.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.OK).json({
            message: "An error has occurred, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
            error,
        });
    }
    return {};
});
exports.editAdminData = editAdminData;
