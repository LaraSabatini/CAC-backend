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
exports.getFeedback = exports.createFeedback = void 0;
const index_1 = __importDefault(require("../database/index"));
const index_2 = __importDefault(require("../config/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const pagination_1 = require("../helpers/pagination");
const createFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { optionId, optionValue, clientId } = req.body;
        const registerFeedback = yield index_1.default.query(`INSERT INTO feedback (optionId, optionValue, clientId) VALUES ('${optionId}', '${optionValue}', '${clientId}');`);
        if (registerFeedback) {
            return res.status(statusCodes_1.default.CREATED).json({
                message: "Feedback registered successfully",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.CREATED).json({
            message: "An error has occurred while saving the feedback, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.createFeedback = createFeedback;
const getFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page } = req.params;
        const offset = pagination_1.getOffset(index_2.default.listPerPage, page);
        const [feedback] = yield index_1.default.query(`SELECT * FROM feedback LIMIT ${offset},${index_2.default.listPerPage}`);
        const [amountOfPages] = yield index_1.default.query(`SELECT COUNT(*) FROM feedback`);
        if (feedback) {
            const rowData = amountOfPages;
            const meta = {
                page,
                totalPages: parseInt(Object.keys(rowData)[0], 10),
            };
            return res.status(statusCodes_1.default.OK).json({
                data: feedback,
                meta,
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
exports.getFeedback = getFeedback;
