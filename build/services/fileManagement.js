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
exports.deleteFile = exports.getFile = exports.uploadFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const uploadFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { file } = req.files;
    const filepath = path_1.default.resolve(__dirname, "..", "files", file.name);
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
exports.uploadFiles = uploadFiles;
const getFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        root: "https://camarafederal.com.ar/software/api/files",
    };
    const fileName = req.params.file_name;
    const fileExtension = req.params.file_extension;
    res.sendFile(`${fileName}.${fileExtension}`, options, (err) => {
        if (err) {
            next(err);
        }
    });
});
exports.getFile = getFile;
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    fs_1.default.unlink(req.params.route, error => {
        if (error) {
            res.status(500).send({
                message: "Server error",
                code: statusCodes_1.default.INTERNAL_SERVER_ERROR,
            });
        }
        else {
            res
                .status(201)
                .send({ message: "File deleted successfully", code: statusCodes_1.default.OK });
        }
    });
});
exports.deleteFile = deleteFile;
