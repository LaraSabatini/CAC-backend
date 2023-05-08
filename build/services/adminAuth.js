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
exports.registerAdminSuccessEmail = exports.restoreAdminPasswordEmail = exports.editAdminData = exports.getAdminData = exports.adminChangePassword = exports.adminRegister = exports.adminLogin = void 0;
const index_1 = __importDefault(require("../database/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const sendEmail_1 = __importDefault(require("../helpers/sendEmail"));
const handleBcrypt_1 = require("../helpers/handleBcrypt");
const adminRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email, userName, accessPermits, loginAttempts, accountBlocked, firstLogin, } = req.body;
        const passwordHash = yield handleBcrypt_1.encrypt(password);
        const registerAdmin = yield index_1.default.query(`INSERT INTO admin (email, password, userName, accessPermits, loginAttempts, accountBlocked, firstLogin) VALUES ('${email}','${passwordHash}', '${userName}', '${accessPermits}', '${loginAttempts}', '${accountBlocked}', '${firstLogin}');`);
        if (registerAdmin) {
            return res.status(statusCodes_1.default.CREATED).json({
                message: "Admin registered successfully",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while registering the user, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.adminRegister = adminRegister;
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const [admin] = yield index_1.default.query(`SELECT * FROM admin WHERE email = '${email}'`);
        if (admin.length) {
            const rowAdminData = admin;
            const loginAttempts = rowAdminData[0].loginAttempts + 1;
            const checkPassword = yield handleBcrypt_1.compare(password, admin[0].password);
            if (checkPassword) {
                yield index_1.default.query(`UPDATE admin SET loginAttempts = '0', accountBlocked='0' WHERE id = ${rowAdminData[0].id}`);
                res.status(statusCodes_1.default.CREATED).json({
                    message: "Login successfully",
                    status: statusCodes_1.default.CREATED,
                    userId: rowAdminData[0].id,
                    firstLogin: rowAdminData[0].firstLogin,
                });
            }
            else if (admin.length && rowAdminData[0].accountBlocked === 0) {
                if (loginAttempts === 5) {
                    const [blockAccount] = yield index_1.default.query(`UPDATE admin SET loginAttempts = '${loginAttempts}', accountBlocked='1' WHERE id = ${rowAdminData[0].id}`);
                    const rowBlockAccountData = blockAccount;
                    if (rowBlockAccountData.affectedRows === 1) {
                        res.status(statusCodes_1.default.CREATED);
                        res.send({
                            message: "Account blocked",
                            status: statusCodes_1.default.UNAUTHORIZED,
                        });
                    }
                }
                else {
                    const [updateLoginAttempts] = yield index_1.default.query(`UPDATE admin SET loginAttempts = '${rowAdminData[0].loginAttempts + 1}' WHERE id = ${rowAdminData[0].id}`);
                    const rowAdminUpdatedData = updateLoginAttempts;
                    res.status(statusCodes_1.default.CREATED);
                    res.send({
                        message: "Wrong password or email",
                        status: statusCodes_1.default.UNAUTHORIZED,
                        loginAttempts: rowAdminUpdatedData.affectedRows === 1 &&
                            rowAdminData[0].loginAttempts + 1,
                    });
                }
            }
            else {
                res.status(statusCodes_1.default.CREATED);
                res.send({
                    message: "Account blocked",
                    status: statusCodes_1.default.UNAUTHORIZED,
                });
            }
        }
        else {
            const [client] = yield index_1.default.query(`SELECT * FROM clients WHERE email = '${email}'`);
            if (client.length) {
                res.status(statusCodes_1.default.OK);
                res.send({ error: "User is client", status: statusCodes_1.default.NOT_FOUND });
            }
            else {
                res.status(statusCodes_1.default.OK);
                res.send({ error: "User not found", status: statusCodes_1.default.NOT_FOUND });
            }
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.OK).json({
            message: "Something went wrong",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.adminLogin = adminLogin;
const adminChangePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { encrypted } = req.params;
        const { id, password, newPassword } = req.body;
        const [admin] = yield index_1.default.query(`SELECT * FROM admin WHERE id = '${id}'`);
        let checkPassword = false;
        const passwordHash = yield handleBcrypt_1.encrypt(newPassword);
        if (encrypted === "true") {
            checkPassword = password === admin[0].password;
        }
        else {
            checkPassword = yield handleBcrypt_1.compare(password, admin[0].password);
        }
        if (checkPassword) {
            const [changePassword] = yield index_1.default.query(`UPDATE admin SET password = '${passwordHash}', firstLogin = '0' WHERE id = ${id}`);
            if (changePassword) {
                res.status(statusCodes_1.default.CREATED);
                res.send({
                    message: "Password updated successfully",
                    status: statusCodes_1.default.CREATED,
                });
            }
            else {
                return res.status(statusCodes_1.default.CREATED).json({
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
        return res.status(statusCodes_1.default.CREATED).json({
            message: "Something went wrong",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.adminChangePassword = adminChangePassword;
const getAdminData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [admin] = yield index_1.default.query(`SELECT * FROM admin WHERE id = '${id}'`);
        if (admin) {
            return res.status(statusCodes_1.default.OK).json({
                data: admin,
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
exports.getAdminData = getAdminData;
const editAdminData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { email, accessPermits, firstLogin } = req.body;
        const [admin] = yield index_1.default.query(`UPDATE admins SET email = '${email}', accessPermits = '${accessPermits}', firstLogin = '${firstLogin}'  WHERE id = ${id}`);
        if (admin) {
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
exports.editAdminData = editAdminData;
// Mailing
const restoreAdminPasswordEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recipients } = req.body;
        const [admin] = yield index_1.default.query(`SELECT * FROM admin WHERE email = '${recipients[0]}'`);
        if (admin.length) {
            return sendEmail_1.default(recipients, "Recuperación de contraseña", "restorePassword", {
                name: req.body.name,
                restorePasswordURL: `${req.body.restorePasswordURL}&pass=${admin[0].password}&id=${admin[0].id}`,
            }, res);
        }
        res.status(statusCodes_1.default.NOT_FOUND);
        res.send({ message: "User does not exist", status: statusCodes_1.default.NOT_FOUND });
    }
    catch (error) {
        return res.status(statusCodes_1.default.OK).json({
            message: "Something went wrong",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
            hola: error,
        });
    }
    return {};
});
exports.restoreAdminPasswordEmail = restoreAdminPasswordEmail;
const registerAdminSuccessEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return sendEmail_1.default([req.body.recipients], "Registro existoso", "registerAdminSuccess", {
        name: req.body.name,
        email: req.body.recipients[0],
        password: req.body.password,
        loginURL: req.body.loginURL,
    }, res);
});
exports.registerAdminSuccessEmail = registerAdminSuccessEmail;
