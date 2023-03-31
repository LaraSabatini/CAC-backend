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
/* eslint-disable @typescript-eslint/naming-convention */
const axios_1 = __importDefault(require("axios"));
const mercadoPago_1 = __importDefault(require("../helpers/mercadoPago"));
const index_1 = __importDefault(require("../database/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const index_2 = __importDefault(require("../config/index"));
const returnPaymentResponse_1 = __importDefault(require("../helpers/returnPaymentResponse"));
// import addMonths from "../helpers/addMonths"
// import { updatePaymentData } from "./clients"
// import { dateFormated } from "../helpers/getToday"
// import defaultPost from "../helpers/defaultPost"
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
                Authorization: `Bearer ${index_2.default.MP_ACCESS_TOKEN_TEST}`,
            },
        };
        const response = yield axios_1.default.get(`https://api.mercadopago.com/checkout/preferences/${preferenceId}`, headers);
        return res.status(statusCodes_1.default.OK).json({
            clientId: response.data.client_id,
            status: statusCodes_1.default.OK,
        });
    }
    catch (_a) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
});
exports.getClientId = getClientId;
// const getPaymentData = async (paymentId: string) => {
//   const headers = {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${config.MP_ACCESS_TOKEN_TEST}`,
//     },
//   }
//   const response: any = await axios.get(
//     `https://api.mercadopago.com/v1/payments/${paymentId}`,
//     headers,
//   )
//   return response
// }
// const registerPaymentInDB = async (payment: DBPaymentInterface) => {
//   const res = await defaultPost(
//     "http://localhost:3001/software/api/payment/register-in-db",
//     payment,
//   )
//   return res
// }
const paymentNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get https://api.mercadopago.com/v1/payments/${data.id}
        // bearer: TEST-6602058583432591-010310-2f7ad3d408353f5b162ce3e24a7ddc17-1270310472
        const { id, action, data, date_created, type, user_id } = req.body;
        const savePayment = yield index_1.default.query(`INSERT INTO notifications (id, action, payment_id, date_created, type, user_id) VALUES ('${id}', '${action}', '${data.id}', '${date_created}', '${type}', '${user_id}');`);
        // const [client]: any = await pool.query(
        //   `SELECT id FROM clients WHERE mpId = '${user_id}'`,
        // )
        // // 1. traer datos de la compra
        // const getPaymentDataCall = await getPaymentData(data.id)
        // // 2. traer datos de planes
        // const [pricing]: any = await pool.query(`SELECT * FROM pricing`)
        // // 3. encontrar el plan al que se anoto
        // const filterPlans = pricing.filter(
        //   (plan: PlanInterface) =>
        //     plan.id === getPaymentDataCall.additional_info.items[0].id,
        // )[0].time
        // // 4. Actualizar datos de subscripcion en el perfil con esos datos
        // const today = new Date()
        // const updatePayment = await updatePaymentData(
        //   user_id,
        //   1,
        //   getPaymentDataCall.additional_info.items[0].id,
        //   dateFormated,
        //   addMonths(filterPlans, today),
        // )
        // // eslint-disable-next-line no-console
        // console.log("updatePayment", updatePayment)
        // // 5. crear pago nuevo
        // const registerPaymentInDBCall = await registerPaymentInDB({
        //   paymentId: data.id,
        //   preferenceId: "",
        //   clientId: client[0].id,
        //   mpId: user_id,
        //   itemId: getPaymentDataCall.additional_info.items[0].id,
        //   pricePaid: getPaymentDataCall.additional_info.items[0].unit_price,
        //   date: dateFormated,
        //   paymentExpireDate: addMonths(filterPlans, today),
        // })
        // // eslint-disable-next-line no-console
        // console.log("registerPaymentInDBCall", registerPaymentInDBCall)
        // const [payment]: any = await pool.query(
        //   `SELECT id FROM payments WHERE mpId = ${user_id}`,
        // )
        // if (!payment.length) {
        //   // a.
        //   // enviar mail de registro
        //   // eslint-disable-next-line no-console
        //   console.log(client)
        //   // eslint-disable-next-line no-console
        //   console.log("ENVIAR MAIL")
        // } else {
        //   // b.
        //   // eslint-disable-next-line no-console
        //   console.log("NADA")
        // }
        if (savePayment) {
            res.status(200).send("OK");
        }
        else {
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
exports.paymentNotification = paymentNotification;
