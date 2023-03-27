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
exports.createPreference = exports.getPaymentsByClient = exports.registerPaymentInDB = void 0;
const mercadoPago_1 = __importDefault(require("../helpers/mercadoPago"));
const index_1 = __importDefault(require("../database/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const registerPaymentInDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paymentId, collectionId, collectionStatus, status, paymentType, merchantOrderId, preferenceId, pricePaid, clientId, paymentExpireDate, itemId, } = req.body;
        const registerPayment = yield index_1.default.query(`INSERT INTO payments (paymentId,
        collectionId,
        collectionStatus,
        status,
        paymentType,
        merchantOrderId,
        preferenceId,
        pricePaid,
        clientId,
        paymentExpireDate,
        itemId) VALUES ('${paymentId}',
        '${collectionId}',
        '${collectionStatus}',
        '${status}',
        '${paymentType}',
        '${merchantOrderId}',
        '${preferenceId}',
        '${pricePaid}',
        '${clientId}',
        '${paymentExpireDate}',
        '${itemId}');`);
        if (registerPayment) {
            res.status(statusCodes_1.default.CREATED).json({
                message: "Payment registered successfully",
                status: statusCodes_1.default.CREATED,
            });
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
exports.registerPaymentInDB = registerPaymentInDB;
const getPaymentsByClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [payment] = yield index_1.default.query(`SELECT * FROM payments WHERE clientId = ${id}`);
        if (payment.length) {
            res.status(statusCodes_1.default.OK).json({ data: payment, status: statusCodes_1.default.OK });
        }
        else {
            res.status(statusCodes_1.default.NOT_FOUND);
            res.send({ error: "Payments not found", status: statusCodes_1.default.NOT_FOUND });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while getting the payments, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.getPaymentsByClient = getPaymentsByClient;
const createPreference = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const preference = {
            items: req.body.item,
            payer: req.body.payer,
            back_urls: {
                success: "http://localhost:3000/payment?payment_status=success",
                failure: "http://localhost:3000/payment?payment_status=failure",
                pending: "http://localhost:3000/payment?payment_status=pending",
            },
            auto_return: "approved",
        };
        mercadoPago_1.default.preferences
            .create(preference)
            .then((response) => {
            res.json({
                id: response.body.id,
                status: statusCodes_1.default.CREATED,
            });
        })
            .catch((error) => {
            res.status(statusCodes_1.default.NOT_FOUND);
            res.send({
                error,
                message: "Couldn't process payment",
                status: statusCodes_1.default.NOT_FOUND,
            });
        });
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while getting the preference, please try again.",
        });
    }
    return {};
});
exports.createPreference = createPreference;
