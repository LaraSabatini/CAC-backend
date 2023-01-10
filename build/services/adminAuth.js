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
const adminRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password, email, accessPermits, loginAttempts, accountBlocked, } = req.body;
        const passwordHash = yield encrypt(password);
        const registerAdmin = yield pool.query(`INSERT INTO admin (userName, email, password, accessPermits, loginAttempts, accountBlocked) VALUES ('${userName}', '${email}', '${passwordHash}', '${accessPermits}', '${loginAttempts}', '${accountBlocked}');`);
        if (registerAdmin) {
            return res
                .status(201)
                .json({ message: "Admin registered successfully", status: 201 });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "An error has occurred while registering the user, please try again.",
            status: 500,
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
                res.status(201).json({ message: "Login successfully", status: 201 });
            }
            else if (admin.length && rowAdminData[0].accountBlocked === 0) {
                if (loginAttempts === 5) {
                    const [blockAccount] = yield pool.query(`UPDATE admin SET loginAttempts = '${loginAttempts}', accountBlocked='1' WHERE id = ${rowAdminData[0].id}`);
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
                    const [updateLoginAttempts] = yield pool.query(`UPDATE admin SET loginAttempts = '${rowAdminData[0].loginAttempts + 1}' WHERE id = ${rowAdminData[0].id}`);
                    const rowAdminUpdatedData = updateLoginAttempts;
                    res.status(401);
                    res.send({
                        message: "Wrong password or email",
                        status: 401,
                        loginAttempts: rowAdminUpdatedData.affectedRows === 1 &&
                            rowAdminData[0].loginAttempts + 1,
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
const adminChangePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, newPassword } = req.body;
        const passwordHash = yield encrypt(newPassword);
        const [admin] = yield pool.query(`UPDATE admin SET password = '${passwordHash}' WHERE id = ${id}`);
        if (admin) {
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
export { adminLogin, adminRegister, adminChangePassword };
