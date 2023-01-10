var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from "../database/index";
import { encrypt, compare } from "../helpers/handleBcrypt";
const clientRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, lastName, email, password, identificationType, identificationNumber, phoneAreaCode, phoneNumber, preferences, accountBlocked, subscription, dateCreated, loginAttempts, } = req.body;
        const passwordHash = yield encrypt(password);
        const [registerClient] = yield pool.query(`INSERT INTO clients (name,
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
        loginAttempts) VALUES ('${name}',
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
        '${loginAttempts}');`);
        if (registerClient) {
            const rowData = registerClient;
            res.status(201).json({
                message: "Client registered successfully",
                clientId: rowData.insertId,
                status: 201,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "An error has occurred while registering the client, please try again.",
            status: 500,
        });
    }
    return {};
});
const clientLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const [client] = yield pool.query(`SELECT * FROM clients WHERE email = '${email}'`);
        if (client.length) {
            const checkPassword = yield compare(password, client[0].password);
            const rowClientData = client;
            const loginAttempts = rowClientData[0].loginAttempts + 1;
            if (checkPassword) {
                yield pool.query(`UPDATE clients SET loginAttempts = '0', accountBlocked='0' WHERE id = ${rowClientData[0].id}`);
                res.status(201).json({ message: "Login successfully", status: 201 });
            }
            else if (client.length && rowClientData[0].accountBlocked === 0) {
                if (loginAttempts === 5) {
                    const [blockAccount] = yield pool.query(`UPDATE clients SET loginAttempts = '${loginAttempts}', accountBlocked='1' WHERE id = ${rowClientData[0].id}`);
                    const rowBlockAccountData = blockAccount;
                    if (rowBlockAccountData.affectedRows === 1) {
                        res.status(401);
                        res.send({
                            message: "Account blocked",
                            status: 401,
                        });
                    }
                }
                else {
                    const [updateLoginAttempts] = yield pool.query(`UPDATE clients SET loginAttempts = '${rowClientData[0].loginAttempts + 1}' WHERE id = ${rowClientData[0].id}`);
                    const rowClientUpdatedData = updateLoginAttempts;
                    res.status(401);
                    res.send({
                        message: "Wrong password or email",
                        status: 401,
                        loginAttempts: rowClientUpdatedData.affectedRows === 1 &&
                            rowClientData[0].loginAttempts + 1,
                    });
                }
            }
            else {
                res.status(401);
                res.send({
                    message: "Account blocked",
                    status: 401,
                });
            }
        }
        else {
            res.status(404);
            res.send({ error: "User not found", status: 404 });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Something went wrong", status: 500 });
    }
    return {};
});
const clientChangePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, newPassword } = req.body;
        const passwordHash = yield encrypt(newPassword);
        const [client] = yield pool.query(`UPDATE clients SET password = '${passwordHash}' WHERE id = ${id}`);
        if (client) {
            res.status(201);
            res.send({ message: "Password updated successfully", status: 201 });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Something went wrong", status: 500 });
    }
    return {};
});
const validateDuplicatedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, identificationNumber } = req.body;
        const [client] = yield pool.query(`SELECT * FROM clients WHERE email LIKE '${email}' OR identificationNumber LIKE '${identificationNumber}'`);
        if (client.length) {
            res.status(401).json({
                message: "Cannot create user",
                info: "duplicated",
                status: 401,
            });
        }
        else {
            res.status(200);
            res.send({ message: "Can create user", info: "available", status: 200 });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Something went wrong", status: 500 });
    }
    return {};
});
export { clientLogin, clientRegister, clientChangePassword, validateDuplicatedUser, };
