var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from "../database/index";
import config from "../config/index";
import statusCodes from "../config/statusCodes";
import { getOffset } from "../helpers/pagination";
const createFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { optionId, optionValue, clientId } = req.body;
        const registerFeedback = yield pool.query(`INSERT INTO feedback (optionId, optionValue, clientId) VALUES ('${optionId}', '${optionValue}', '${clientId}');`);
        if (registerFeedback) {
            return res.status(statusCodes.CREATED).json({
                message: "Feedback registered successfully",
                status: statusCodes.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while saving the feedback, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
const getFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page } = req.params;
        const offset = getOffset(config.listPerPage, page);
        const [feedback] = yield pool.query(`SELECT * FROM feedback LIMIT ${offset},${config.listPerPage}`);
        const [amountOfPages] = yield pool.query(`SELECT COUNT(*) FROM feedback`);
        if (feedback) {
            const rowData = amountOfPages;
            const meta = {
                page,
                totalPages: parseInt(Object.keys(rowData)[0], 10),
            };
            return res.status(statusCodes.OK).json({
                data: feedback,
                meta,
                status: statusCodes.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
export { createFeedback, getFeedback };
