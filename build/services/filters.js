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
import statusCodes from "../config/statusCodes";
const getFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.params;
        const [filters] = yield pool.query(`SELECT * FROM ${type}`);
        if (filters) {
            return res
                .status(statusCodes.OK)
                .json({ data: filters, status: statusCodes.OK });
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
const createFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { value, type } = req.body;
        const insertFilter = yield pool.query(`INSERT INTO ${type} (value) VALUES ('${value}');`);
        if (insertFilter) {
            return res.status(statusCodes.CREATED).json({
                message: "Filter created successfully",
                status: statusCodes.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while creating the filter, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
const deleteFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, type } = req.params;
        const [filter] = yield pool.query(`DELETE FROM ${type} WHERE id=${id}`);
        if (filter) {
            res.status(statusCodes.CREATED);
            res.send({
                message: "Filter deleted successfully",
                status: statusCodes.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while deleting the filter, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
export { getFilters, createFilter, deleteFilter };
