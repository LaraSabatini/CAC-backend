var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from "path";
import fs from "fs";
import statusCodes from "../config/statusCodes";
const uploadFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newpath = `${__dirname.split("services")[0]}files/`;
    const { file } = req.files;
    const filename = file.name;
    file.mv(`${newpath}${filename}`, (err) => {
        if (err) {
            res.status(500).send({
                message: "File upload failed",
                code: statusCodes.INTERNAL_SERVER_ERROR,
            });
        }
        res
            .status(200)
            .send({ message: "File Uploaded", code: statusCodes.CREATED });
    });
});
const getFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        root: `${path.join(__dirname).split("services")[0]}files`,
    };
    const fileName = req.params.file_name;
    const fileExtension = req.params.file_extension;
    res.sendFile(`${fileName}.${fileExtension}`, options, (err) => {
        if (err) {
            next(err);
        }
    });
});
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    fs.unlink(req.params.route, error => {
        if (error) {
            res.status(500).send({
                message: "Server error",
                code: statusCodes.INTERNAL_SERVER_ERROR,
            });
        }
        else {
            res
                .status(201)
                .send({ message: "File deleted successfully", code: statusCodes.OK });
        }
    });
});
export { uploadFiles, getFile, deleteFile };
