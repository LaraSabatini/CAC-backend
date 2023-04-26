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
exports.getPricingAsFilter = exports.getPricing = exports.deletePricing = exports.editPricing = exports.createPricing = void 0;
const index_1 = __importDefault(require("../database/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const getPricing = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [pricing] = yield index_1.default.query(`SELECT * FROM pricing`);
        if (pricing) {
            return res
                .status(statusCodes_1.default.OK)
                .json({ data: pricing, status: statusCodes_1.default.OK });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.getPricing = getPricing;
const createPricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, description, time } = req.body;
        const insertPricing = yield index_1.default.query(`INSERT INTO pricing (name, price, description, time) VALUES ('${name}', '${price}', '${description}', '${time}');`);
        if (insertPricing) {
            return res.status(statusCodes_1.default.CREATED).json({
                message: "Pricing created successfully",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while creating the pricing, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.createPricing = createPricing;
const editPricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, description, time } = req.body;
        const { id } = req.params;
        const [pricing] = yield index_1.default.query(`UPDATE pricing SET price = '${price}', name = '${name}', description = '${description}', time = '${time}' WHERE id = ${id}`);
        if (pricing) {
            res.status(statusCodes_1.default.CREATED);
            res.send({
                message: "Pricing updated successfully",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while updating the pricing, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.editPricing = editPricing;
const deletePricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [pricing] = yield index_1.default.query(`DELETE FROM pricing WHERE id=${id}`);
        if (pricing) {
            res.status(statusCodes_1.default.CREATED);
            res.send({
                message: "Pricing deleted successfully",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while deleting the pricing, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.deletePricing = deletePricing;
const getPricingAsFilter = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [pricing] = yield index_1.default.query(`SELECT id, name FROM pricing`);
        if (pricing) {
            return res
                .status(statusCodes_1.default.OK)
                .json({ data: pricing, status: statusCodes_1.default.OK });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.getPricingAsFilter = getPricingAsFilter;
