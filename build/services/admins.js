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
exports.removeProfilePic = exports.getProfilePic = exports.uploadProfilePic = exports.editAdminData = exports.getAdminName = exports.getAdmins = void 0;
const index_1 = __importDefault(require("../database/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const path_1 = __importDefault(require("path"));
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
const uploadProfilePic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { file } = req.files;
    const { id } = req.params;
    const filepath = path_1.default.resolve(__dirname, "..", "files/profiles", file.name);
    const profilePic = `https://camarafederal.com.ar/software/api/files/profiles/${file.name}`;
    yield index_1.default.query(`UPDATE admin SET profilePic = '${profilePic}' WHERE id = ${id}`);
    file.mv(filepath, (err) => {
        if (err) {
            res.status(500).send({
                message: "File upload failed",
                code: statusCodes_1.default.INTERNAL_SERVER_ERROR,
            });
        }
        res
            .status(200)
            .send({ message: "File Uploaded", code: statusCodes_1.default.CREATED });
    });
});
exports.uploadProfilePic = uploadProfilePic;
const getProfilePic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name } = req.params;
        const [admin] = yield index_1.default.query(`SELECT profilePic FROM admin WHERE id = '${id}' OR userName LIKE '${name}'`);
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
exports.getProfilePic = getProfilePic;
const removeProfilePic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [admin] = yield index_1.default.query(`UPDATE admin SET profilePic = '' WHERE id = ${id}`);
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
exports.removeProfilePic = removeProfilePic;
