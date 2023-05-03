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
exports.filterTrainings = exports.editTraining = exports.deleteTraining = exports.createTraining = exports.getTrainings = void 0;
const index_1 = __importDefault(require("../database/index"));
const pagination_1 = require("../helpers/pagination");
const index_2 = __importDefault(require("../config/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const getTrainings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page } = req.params;
        const offset = pagination_1.getOffset(index_2.default.listPerPage, page);
        const [trainings] = yield index_1.default.query(`SELECT * FROM trainings ORDER BY id DESC LIMIT ${offset},${index_2.default.listPerPage}`);
        if (trainings) {
            return res
                .status(statusCodes_1.default.OK)
                .json({ data: trainings, status: statusCodes_1.default.OK });
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
exports.getTrainings = getTrainings;
const createTraining = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { youtubeURL, title, author, description, theme, region } = req.body;
        const registerTraining = yield index_1.default.query(`INSERT INTO trainings (
            youtubeURL,
            title,
            author,
            description,
            theme,
            region) VALUES ('${youtubeURL}', '${title}', '${author}', '${description}', '${theme}','${region}');`);
        if (registerTraining) {
            return res.status(statusCodes_1.default.CREATED).json({
                message: "Training created successfully",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.CREATED).json({
            message: "An error has occurred while creating the training, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.createTraining = createTraining;
const deleteTraining = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [training] = yield index_1.default.query(`DELETE FROM trainings WHERE id=${id}`);
        if (training) {
            res.status(statusCodes_1.default.OK);
            res.send({
                message: "Training deleted successfully",
                status: statusCodes_1.default.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.OK).json({
            message: "An error has occurred while deleting the training, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.deleteTraining = deleteTraining;
const editTraining = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { youtubeURL, title, author, description, theme, region } = req.body;
        const editTraining = yield index_1.default.query(`UPDATE trainings SET youtubeURL = '${youtubeURL}', title = '${title}', author = '${author}', description = '${description}', theme = '${theme}', region = '${region}' WHERE id = ${id}`);
        if (editTraining) {
            return res.status(statusCodes_1.default.CREATED).json({
                message: "Training edited successfully",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.CREATED).json({
            message: "An error has occurred while creating the training, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.editTraining = editTraining;
const filterTrainings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { themeIds } = req.body;
        let trainings = [];
        for (let i = 0; i < themeIds.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const [results] = yield index_1.default.query(`SELECT * FROM trainings WHERE theme LIKE '%${themeIds[i]}%'`);
            trainings = [...trainings, ...results];
        }
        if (trainings) {
            return res.status(statusCodes_1.default.OK).json({
                data: trainings,
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
exports.filterTrainings = filterTrainings;
