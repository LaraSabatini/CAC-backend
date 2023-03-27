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
exports.accountUnblockedNotificationEmail = exports.accountBlockedNotificationEmail = exports.getClientDataForTable = exports.updateClientPaymentData = exports.restoreClientPasswordEmail = exports.registerSuccessEmail = exports.blockAccount = exports.editClientData = exports.getClientData = exports.validateIdentificationNumber = exports.validateEmail = exports.clientChangePassword = exports.clientRegister = exports.clientLogin = void 0;
const index_1 = __importDefault(require("../database/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const sendEmail_1 = __importDefault(require("../helpers/sendEmail"));
const pagination_1 = require("../helpers/pagination");
const handleBcrypt_1 = require("../helpers/handleBcrypt");
const clientRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, lastName, email, password, identificationType, identificationNumber, phoneAreaCode, phoneNumber, preferences, accountBlocked, subscription, dateCreated, loginAttempts, firstLogin, plan, region, paymentDate, paymentExpireDate, } = req.body;
        const passwordHash = yield handleBcrypt_1.encrypt(password);
        const [registerClient] = yield index_1.default.query(`INSERT INTO clients (name,
        lastName,
        email,
        password,
        identificationType,
        identificationNumber,
        phoneAreaCode,
        phoneNumber,
        preferences,
        accountBlocked,
        subscription,
        dateCreated,
        loginAttempts,
        firstLogin,
        plan,
        region,
        paymentDate,
        paymentExpireDate
        ) VALUES ('${name}',
        '${lastName}',
        '${email}',
        '${passwordHash}',
        '${identificationType}',
        '${identificationNumber}',
        '${phoneAreaCode}',
        '${phoneNumber}',
        '${preferences}',
        '${accountBlocked}',
        '${subscription}',
        '${dateCreated}',
        '${loginAttempts}',
        '${firstLogin}',
        '${plan}',
        '${region}',
        '${paymentDate}',
        '${paymentExpireDate}'
        );`);
        if (registerClient) {
            const rowData = registerClient;
            res.status(statusCodes_1.default.CREATED).json({
                message: "Client registered successfully",
                clientId: rowData.insertId,
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while registering the client, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.clientRegister = clientRegister;
const clientLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const [client] = yield index_1.default.query(`SELECT * FROM clients WHERE email = '${email}'`);
        if (client.length && client[0].accountBlocked === 0) {
            const checkPassword = yield handleBcrypt_1.compare(password, client[0].password);
            const rowClientData = client;
            const loginAttempts = rowClientData[0].loginAttempts + 1;
            if (checkPassword) {
                yield index_1.default.query(`UPDATE clients SET loginAttempts = '0' WHERE id = ${rowClientData[0].id}`);
                res.status(statusCodes_1.default.CREATED).json({
                    message: "Login successfully",
                    status: statusCodes_1.default.CREATED,
                    userId: rowClientData[0].id,
                    firstLogin: rowClientData[0].firstLogin,
                });
            }
            else if (rowClientData[0].accountBlocked === 0) {
                if (loginAttempts === 5) {
                    const [blockAccount] = yield index_1.default.query(`UPDATE clients SET loginAttempts = '${loginAttempts}', accountBlocked='1' WHERE id = ${rowClientData[0].id}`);
                    const rowBlockAccountData = blockAccount;
                    if (rowBlockAccountData.affectedRows === 1) {
                        res.status(statusCodes_1.default.UNAUTHORIZED);
                        res.send({
                            message: "Account blocked",
                            status: statusCodes_1.default.UNAUTHORIZED,
                        });
                    }
                }
                else {
                    const [updateLoginAttempts] = yield index_1.default.query(`UPDATE clients SET loginAttempts = '${rowClientData[0].loginAttempts + 1}' WHERE id = ${rowClientData[0].id}`);
                    const rowClientUpdatedData = updateLoginAttempts;
                    res.status(statusCodes_1.default.UNAUTHORIZED);
                    res.send({
                        message: "Wrong password or email",
                        status: statusCodes_1.default.UNAUTHORIZED,
                        loginAttempts: rowClientUpdatedData.affectedRows === 1 &&
                            rowClientData[0].loginAttempts + 1,
                    });
                }
            }
            else {
                res.status(statusCodes_1.default.UNAUTHORIZED);
                res.send({
                    message: "Account blocked",
                    status: statusCodes_1.default.UNAUTHORIZED,
                });
            }
        }
        else {
            const [admin] = yield index_1.default.query(`SELECT * FROM admin WHERE email = '${email}'`);
            if (admin.length) {
                res.status(statusCodes_1.default.NOT_FOUND);
                res.send({ error: "User is admin", status: statusCodes_1.default.NOT_FOUND });
            }
            else if (client[0].accountBlocked === 1) {
                res.status(statusCodes_1.default.UNAUTHORIZED);
                res.send({
                    message: "Account blocked",
                    status: statusCodes_1.default.UNAUTHORIZED,
                });
            }
            else {
                res.status(statusCodes_1.default.NOT_FOUND);
                res.send({ error: "User not found", status: statusCodes_1.default.NOT_FOUND });
            }
        }
    }
    catch (error) {
        res.status(statusCodes_1.default.NOT_FOUND);
        res.send({ error: "User not found", status: statusCodes_1.default.NOT_FOUND });
    }
    return {};
});
exports.clientLogin = clientLogin;
const clientChangePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { encrypted } = req.params;
        const { id, password, newPassword } = req.body;
        const [client] = yield index_1.default.query(`SELECT * FROM clients WHERE id = '${id}'`);
        let checkPassword = false;
        if (encrypted === "true") {
            checkPassword = password === client[0].password;
        }
        else {
            checkPassword = yield handleBcrypt_1.compare(password, client[0].password);
        }
        const passwordHash = yield handleBcrypt_1.encrypt(newPassword);
        if (checkPassword) {
            const [changePassword] = yield index_1.default.query(`UPDATE clients SET password = '${passwordHash}', firstLogin = '0' WHERE id = ${id}`);
            if (changePassword) {
                res.status(statusCodes_1.default.CREATED);
                res.send({
                    message: "Password updated successfully",
                    status: statusCodes_1.default.CREATED,
                });
            }
            else {
                return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
                    message: "Something went wrong",
                    status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
                });
            }
        }
        else {
            return res.status(statusCodes_1.default.UNAUTHORIZED).json({
                message: "Wrong password",
                status: statusCodes_1.default.UNAUTHORIZED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.clientChangePassword = clientChangePassword;
const validateEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const [client] = yield index_1.default.query(`SELECT * FROM clients WHERE email LIKE '${email}'`);
        if (client.length) {
            res.status(statusCodes_1.default.UNAUTHORIZED).json({
                message: "Cannot create user",
                info: "duplicated",
                status: statusCodes_1.default.UNAUTHORIZED,
            });
        }
        else {
            res.status(statusCodes_1.default.OK);
            res.send({
                message: "Can create user",
                info: "available",
                status: statusCodes_1.default.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.validateEmail = validateEmail;
const validateIdentificationNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identificationNumber } = req.body;
        const [client] = yield index_1.default.query(`SELECT * FROM clients WHERE identificationNumber LIKE '${identificationNumber}'`);
        if (client.length) {
            res.status(statusCodes_1.default.UNAUTHORIZED).json({
                message: "Cannot create user",
                info: "duplicated",
                status: statusCodes_1.default.UNAUTHORIZED,
            });
        }
        else {
            res.status(200);
            res.send({ message: "Can create user", info: "available", status: 200 });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.validateIdentificationNumber = validateIdentificationNumber;
const getClientData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [client] = yield index_1.default.query(`SELECT * FROM clients WHERE id = '${id}'`);
        if (client) {
            return res.status(statusCodes_1.default.OK).json({
                data: client,
                status: statusCodes_1.default.OK,
            });
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
exports.getClientData = getClientData;
const editClientData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { email, name, lastName, identificationType, identificationNumber, phoneAreaCode, phoneNumber, firstLogin, region, } = req.body;
        const [client] = yield index_1.default.query(`UPDATE clients SET email = '${email}', name = '${name}', lastName = '${lastName}', identificationType = '${identificationType}', identificationNumber = '${identificationNumber}',
      phoneAreaCode = '${phoneAreaCode}',
      phoneNumber = '${phoneNumber}',
      firstLogin = '${firstLogin}',
      region = '${region}'
      WHERE id = ${id}`);
        if (client) {
            res.status(statusCodes_1.default.CREATED);
            res.send({
                message: "Profile updated successfully",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.editClientData = editClientData;
const blockAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, action } = req.params;
        const [client] = yield index_1.default.query(`UPDATE clients SET accountBlocked = ${action === "block" ? "1" : "0"}, subscription = ${action === "block" ? "0" : "1"} WHERE id = ${id}`);
        if (client) {
            res.status(statusCodes_1.default.CREATED);
            res.send({
                message: `Account ${action === "block" ? "blocked" : "unblocked"} successfully`,
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.blockAccount = blockAccount;
// Mailing
const registerSuccessEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return sendEmail_1.default([req.body.recipients], "Registro existoso", "registerSuccess", {
        name: req.body.name,
        item: req.body.item,
        email: req.body.recipients[0],
        password: req.body.password,
        loginURL: req.body.loginURL,
    }, res);
});
exports.registerSuccessEmail = registerSuccessEmail;
const restoreClientPasswordEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recipients } = req.body;
        const [client] = yield index_1.default.query(`SELECT * FROM clients WHERE email LIKE '${recipients[0]}'`);
        if (client.length) {
            return sendEmail_1.default(recipients, "Recuperación de contraseña", "restorePassword", {
                name: req.body.name,
                restorePasswordURL: `${req.body.restorePasswordURL}&pass=${client[0].password}&id=${client[0].id}`,
            }, res);
        }
        res.status(statusCodes_1.default.NOT_FOUND);
        res.send({ message: "User does not exist", status: statusCodes_1.default.NOT_FOUND });
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.restoreClientPasswordEmail = restoreClientPasswordEmail;
const updateClientPaymentData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { plan, region, paymentDate, paymentExpireDate } = req.body;
        const [client] = yield index_1.default.query(`UPDATE clients SET plan = '${plan}',
      region = '${region}',
      paymentDate = '${paymentDate}',
      paymentExpireDate = '${paymentExpireDate}'
      WHERE id = ${id}`);
        if (client) {
            res.status(statusCodes_1.default.CREATED);
            res.send({
                message: "Payment data updated successfully",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.updateClientPaymentData = updateClientPaymentData;
const getClientDataForTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page } = req.params;
        const offset = pagination_1.getOffset(10, page);
        const [client] = yield index_1.default.query(`SELECT name, lastName, id, plan, identificationNumber, region, dateCreated FROM clients LIMIT ${offset},10`);
        const [amountOfPages] = yield index_1.default.query(`SELECT COUNT(*) FROM clients`);
        if (client) {
            const rowData = amountOfPages;
            const meta = {
                page,
                totalPages: Math.ceil(rowData[0]["COUNT(*)"] / 10),
            };
            return res.status(statusCodes_1.default.OK).json({
                data: client,
                meta,
                status: statusCodes_1.default.OK,
            });
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
exports.getClientDataForTable = getClientDataForTable;
const accountBlockedNotificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return sendEmail_1.default([req.body.recipients], "Cuenta bloqueada", "accountBlockedNotification", {
        name: req.body.name,
        email: req.body.recipients[0],
        motive: req.body.motive,
        supportURL: req.body.supportURL,
    }, res);
});
exports.accountBlockedNotificationEmail = accountBlockedNotificationEmail;
const accountUnblockedNotificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return sendEmail_1.default([req.body.recipients], "Cuenta desbloqueada", "accountUnblockedNotification", {
        name: req.body.name,
        email: req.body.recipients[0],
        loginURL: req.body.loginURL,
    }, res);
});
exports.accountUnblockedNotificationEmail = accountUnblockedNotificationEmail;
