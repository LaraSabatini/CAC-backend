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
const index_1 = __importDefault(require("../database/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const paymentNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const savePayment = yield index_1.default.query(`INSERT INTO notifications (nombre) VALUES ('${JSON.stringify(req.body)}');`);
        if (savePayment) {
            res.status(200).send("OK");
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while registering the payment, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.default = paymentNotification;