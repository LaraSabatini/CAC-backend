"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../config/index"));
const returnPaymentResponse = (type) => {
    const successURL = type === "subscription"
        ? `${index_1.default.FONT_URL}/payment?payment_status=success`
        : `${index_1.default.FONT_URL}/profile?payment_status=success`;
    const failureURL = type === "subscription"
        ? `${index_1.default.FONT_URL}/payment?payment_status=failure`
        : `${index_1.default.FONT_URL}/profile?payment_status=failure`;
    const pendingURL = type === "subscription"
        ? `${index_1.default.FONT_URL}/payment?payment_status=pending`
        : `${index_1.default.FONT_URL}/profile?payment_status=pending`;
    return {
        success: successURL,
        failure: failureURL,
        pending: pendingURL,
    };
};
exports.default = returnPaymentResponse;
