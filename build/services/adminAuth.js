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
import statusCodes from "../config/statusCodes";
import sendEmail from "../helpers/sendEmail";
import { encrypt, compare } from "../helpers/handleBcrypt";
const adminRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email, accessPermits, loginAttempts, accountBlocked, firstLogin, } = req.body;
        const passwordHash = yield encrypt(password);
        const registerAdmin = yield pool.query(`INSERT INTO admin (email, password, accessPermits, loginAttempts, accountBlocked, firstLogin) VALUES ('${email}', '${passwordHash}', '${accessPermits}', '${loginAttempts}', '${accountBlocked}', '${firstLogin}');`);
        if (registerAdmin) {
            return res.status(statusCodes.CREATED).json({
                message: "Admin registered successfully",
                status: statusCodes.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while registering the user, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const [admin] = yield pool.query(`SELECT * FROM admin WHERE email = '${email}'`);
        if (admin.length) {
            const rowAdminData = admin;
            const loginAttempts = rowAdminData[0].loginAttempts + 1;
            const checkPassword = yield compare(password, admin[0].password);
            if (checkPassword) {
                yield pool.query(`UPDATE admin SET loginAttempts = '0', accountBlocked='0' WHERE id = ${rowAdminData[0].id}`);
                res.status(statusCodes.CREATED).json({
                    message: "Login successfully",
                    status: statusCodes.CREATED,
                    userId: rowAdminData[0].id,
                    firstLogin: rowAdminData[0].firstLogin,
                });
            }
            else if (admin.length && rowAdminData[0].accountBlocked === 0) {
                if (loginAttempts === 5) {
                    const [blockAccount] = yield pool.query(`UPDATE admin SET loginAttempts = '${loginAttempts}', accountBlocked='1' WHERE id = ${rowAdminData[0].id}`);
                    const rowBlockAccountData = blockAccount;
                    if (rowBlockAccountData.affectedRows === 1) {
                        res.status(statusCodes.UNAUTHORIZED);
                        res.send({
                            message: "Account blocked",
                            status: statusCodes.UNAUTHORIZED,
                        });
                    }
                }
                else {
                    const [updateLoginAttempts] = yield pool.query(`UPDATE admin SET loginAttempts = '${rowAdminData[0].loginAttempts + 1}' WHERE id = ${rowAdminData[0].id}`);
                    const rowAdminUpdatedData = updateLoginAttempts;
                    res.status(statusCodes.UNAUTHORIZED);
                    res.send({
                        message: "Wrong password or email",
                        status: statusCodes.UNAUTHORIZED,
                        loginAttempts: rowAdminUpdatedData.affectedRows === 1 &&
                            rowAdminData[0].loginAttempts + 1,
                    });
                }
            }
            else {
                res.status(statusCodes.UNAUTHORIZED);
                res.send({
                    message: "Account blocked",
                    status: statusCodes.UNAUTHORIZED,
                });
            }
        }
        else {
            const [client] = yield pool.query(`SELECT * FROM clients WHERE email = '${email}'`);
            if (client.length) {
                res.status(statusCodes.NOT_FOUND);
                res.send({ error: "User is client", status: statusCodes.NOT_FOUND });
            }
            else {
                res.status(statusCodes.NOT_FOUND);
                res.send({ error: "User not found", status: statusCodes.NOT_FOUND });
            }
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
const adminChangePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { encrypted } = req.params;
        const { id, password, newPassword } = req.body;
        const [admin] = yield pool.query(`SELECT * FROM admin WHERE id = '${id}'`);
        let checkPassword = false;
        const passwordHash = yield encrypt(newPassword);
        if (encrypted === "true") {
            checkPassword = password === admin[0].password;
        }
        else {
            checkPassword = yield compare(password, admin[0].password);
        }
        if (checkPassword) {
            const [changePassword] = yield pool.query(`UPDATE admin SET password = '${passwordHash}' WHERE id = ${id}`);
            if (changePassword) {
                res.status(statusCodes.CREATED);
                res.send({
                    message: "Password updated successfully",
                    status: statusCodes.CREATED,
                });
            }
            else {
                return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Something went wrong",
                    status: statusCodes.INTERNAL_SERVER_ERROR,
                });
            }
        }
        else {
            return res.status(statusCodes.UNAUTHORIZED).json({
                message: "Wrong password",
                status: statusCodes.UNAUTHORIZED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
const getAdminData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [admin] = yield pool.query(`SELECT * FROM admin WHERE id = '${id}'`);
        if (admin) {
            return res.status(statusCodes.OK).json({
                data: admin,
                status: statusCodes.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred, please try again.",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
const editAdminData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { email, accessPermits, firstLogin } = req.body;
        const [admin] = yield pool.query(`UPDATE admins SET email = '${email}', accessPermits = '${accessPermits}', firstLogin = '${firstLogin}'  WHERE id = ${id}`);
        if (admin) {
            res.status(statusCodes.CREATED);
            res.send({
                message: "Profile updated successfully",
                status: statusCodes.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
// Mailing
const restoreAdminPasswordEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recipients } = req.body;
        const [admin] = yield pool.query(`SELECT * FROM admins WHERE email = '${recipients[0]}'`);
        if (admin.length) {
            return sendEmail(recipients, "Recuperación de contraseña", "restorePassword", {
                name: req.body.name,
                restorePasswordURL: `${req.body.restorePasswordURL}&pass=${admin[0].password}&id=${admin[0].id}`,
            }, res);
        }
        res.status(statusCodes.NOT_FOUND);
        res.send({ message: "User does not exist", status: statusCodes.NOT_FOUND });
    }
    catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            status: statusCodes.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
export { adminLogin, adminRegister, adminChangePassword, getAdminData, editAdminData, restoreAdminPasswordEmail, };
