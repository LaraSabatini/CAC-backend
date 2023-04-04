"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const returnPaymentResponse = (type) => {
    const successURL = type === "subscription"
        ? "http://localhost:3000/payment?payment_status=success"
        : "http://localhost:3000/profile?payment_done=success";
    const failureURL = type === "subscription"
        ? "http://localhost:3000/payment?payment_status=failure"
        : "http://localhost:3000/profile?payment_done=failure";
    const pendingURL = type === "subscription"
        ? "http://localhost:3000/payment?payment_status=pending"
        : "http://localhost:3000/profile?payment_done=pending";
    return {
        success: successURL,
        failure: failureURL,
        pending: pendingURL,
    };
};
exports.default = returnPaymentResponse;
