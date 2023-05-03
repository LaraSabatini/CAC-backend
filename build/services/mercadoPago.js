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
exports.paymentNotification = exports.getClientId = exports.createPreference = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
const axios_1 = __importDefault(require("axios"));
const mercadoPago_1 = __importDefault(require("../helpers/mercadoPago"));
const index_1 = __importDefault(require("../database/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const index_2 = __importDefault(require("../config/index"));
const returnPaymentResponse_1 = __importDefault(require("../helpers/returnPaymentResponse"));
const addMonths_1 = __importDefault(require("../helpers/addMonths"));
const generatePassword_1 = __importDefault(require("../helpers/generatePassword"));
const handleBcrypt_1 = require("../helpers/handleBcrypt");
const clients_1 = require("./clients");
const getToday_1 = require("../helpers/getToday");
const defaultPost_1 = __importDefault(require("../helpers/defaultPost"));
const createPreference = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.params;
        const preference = {
            binary_mode: true,
            items: req.body.item,
            payer: req.body.payer,
            back_urls: returnPaymentResponse_1.default(type),
            auto_return: "approved",
            notification_url: "https://camarafederal.com.ar/software/api/mercadoPago/notifications",
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
const getClientId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { preferenceId } = req.params;
        const headers = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${index_2.default.MP_ACCESS_TOKEN_AS_SELLER}`,
            },
        };
        const response = yield axios_1.default.get(`https://api.mercadopago.com/checkout/preferences/${preferenceId}`, headers);
        return res.status(statusCodes_1.default.OK).json({
            clientId: response.data.client_id,
            status: statusCodes_1.default.OK,
        });
    }
    catch (_a) {
        return res.status(statusCodes_1.default.OK).json({
            message: "An error has occurred, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.getClientId = getClientId;
const getPaymentData = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${index_2.default.MP_ACCESS_TOKEN_AS_SELLER}`,
        },
    };
    const response = yield axios_1.default.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, headers);
    return response;
});
const sendRegisterEmail = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield defaultPost_1.default(`https://camarafederal.com.ar/software/api/users/client/register_success_email`, body);
    return res;
});
const processPayment = (email, paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    const password = generatePassword_1.default();
    const [client] = yield index_1.default.query(`SELECT id, email, name, mpId FROM clients WHERE email LIKE '${email}'`);
    const getPaymentDataCall = yield getPaymentData(paymentId);
    const [pricing] = yield index_1.default.query(`SELECT * FROM pricing`);
    const filterPlans = pricing.filter((plan) => plan.id ===
        parseInt(getPaymentDataCall.data.additional_info.items[0].id, 10))[0].time;
    const today = new Date();
    const updatePayment = yield clients_1.updatePaymentData(client[0].id, 1, parseInt(getPaymentDataCall.data.additional_info.items[0].id, 10), getToday_1.dateFormated, addMonths_1.default(filterPlans, today));
    // Checkear si enviar mail o no
    const [payment] = yield index_1.default.query(`SELECT id FROM payments WHERE clientId = ${client[0].id}`);
    const registerPayment = yield index_1.default.query(`INSERT INTO payments (paymentId,
          clientId,
          mpId,
          itemId,
          pricePaid,
          date,
          paymentExpireDate) VALUES ('${paymentId}',
          '${client[0].id}',
          '${client[0].mpId}',
          '${getPaymentDataCall.data.additional_info.items[0].id}',
          '${parseInt(getPaymentDataCall.data.additional_info.items[0].unit_price, 10)}',
          '${getToday_1.dateFormated}',
          '${addMonths_1.default(filterPlans, today)}'
          );`);
    success = registerPayment.length && updatePayment.status === 201;
    if (!payment.length) {
        const passwordHash = yield handleBcrypt_1.encrypt(password);
        const [changePassword] = yield index_1.default.query(`UPDATE clients SET password = '${passwordHash}' WHERE id = ${client[0].id}`);
        if (changePassword) {
            const sendEmail = yield sendRegisterEmail({
                recipients: [client[0].email],
                name: client[0].name,
                item: getPaymentDataCall.data.additional_info.items[0].title,
                password,
                loginURL: "http://localhost:3000/login?user=client",
            });
            success = sendEmail.status === 201;
        }
    }
    return success;
});
const paymentNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const mpUser = yield getPaymentData(data.id);
        const processAdmission = yield processPayment(mpUser.data.payer.email, data.id);
        if (processAdmission) {
            res.status(200).send("OK");
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while registering the payment, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
            error,
        });
    }
    return {};
});
exports.paymentNotification = paymentNotification;
