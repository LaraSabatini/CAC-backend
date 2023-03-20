var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mercadopago from "../helpers/mercadoPago";
import pool from "../database/index";
import statusCodes from "../config/statusCodes";
const registerPaymentInDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paymentId, collectionId, collectionStatus, status, paymentType, merchantOrderId, preferenceId, pricePaid, clientId, paymentExpireDate, itemId, } = req.body;
        const registerPayment = yield pool.query(`INSERT INTO payments (paymentId,
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
            res.status(statusCodes.CREATED).json({
                message: "Payment registered successfully",
                status: statusCodes.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while registering the payment, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
const getPaymentsByClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [payment] = yield pool.query(`SELECT * FROM payments WHERE clientId = ${id}`);
        if (payment.length) {
            res.status(statusCodes.OK).json({ data: payment, status: statusCodes.OK });
        }
        else {
            res.status(statusCodes.NOT_FOUND);
            res.send({ error: "Payments not found", status: statusCodes.NOT_FOUND });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while getting the payments, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
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
        mercadopago.preferences
            .create(preference)
            .then((response) => {
            res.json({
                id: response.body.id,
                status: statusCodes.CREATED,
            });
        })
            .catch((error) => {
            res.status(statusCodes.NOT_FOUND);
            res.send({
                error,
                message: "Couldn't process payment",
                status: statusCodes.NOT_FOUND,
            });
        });
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while getting the preference, please try again.",
        });
    }
    return {};
});
export { registerPaymentInDB, getPaymentsByClient, createPreference };
