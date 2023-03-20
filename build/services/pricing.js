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
const getPricing = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [pricing] = yield pool.query(`SELECT * FROM pricing`);
        if (pricing) {
            return res
                .status(statusCodes.OK)
                .json({ data: pricing, status: statusCodes.OK });
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
const createPricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, description, time } = req.body;
        const insertPricing = yield pool.query(`INSERT INTO pricing (name, price, description, time) VALUES ('${name}', '${price}', '${description}', '${time}');`);
        if (insertPricing) {
            return res.status(statusCodes.CREATED).json({
                message: "Pricing created successfully",
                status: statusCodes.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while creating the pricing, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
const editPricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, description, time } = req.body;
        const { id } = req.params;
        const [pricing] = yield pool.query(`UPDATE pricing SET price = '${price}', name = '${name}', description = '${description}', time = '${time}' WHERE id = ${id}`);
        if (pricing) {
            res.status(statusCodes.CREATED);
            res.send({
                message: "Pricing updated successfully",
                status: statusCodes.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while updating the pricing, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
const deletePricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [pricing] = yield pool.query(`DELETE FROM pricing WHERE id=${id}`);
        if (pricing) {
            res.status(statusCodes.CREATED);
            res.send({
                message: "Pricing deleted successfully",
                status: statusCodes.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while deleting the pricing, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
export { createPricing, editPricing, deletePricing, getPricing };
