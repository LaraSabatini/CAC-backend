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
exports.updatePaymentData = void 0;
const index_1 = __importDefault(require("../database/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const updatePaymentData = (id, subscription, plan, paymentDate, paymentExpireDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [client] = yield index_1.default.query(`UPDATE clients SET subscription = '${subscription}', paymentDate = '${paymentDate}',
      paymentExpireDate = '${paymentExpireDate}', plan = '${plan}'
        WHERE id = ${id}`);
        if (client) {
            return {
                message: "Profile updated successfully",
                status: statusCodes_1.default.CREATED,
            };
        }
        return {
            message: "Client not found",
            status: statusCodes_1.default.NOT_FOUND,
        };
    }
    catch (error) {
        return {
            message: "Something went wrong",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        };
    }
    return {};
});
exports.updatePaymentData = updatePaymentData;
