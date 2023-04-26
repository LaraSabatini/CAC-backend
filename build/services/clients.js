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
exports.getClientEmail = exports.getClientsEmails = exports.searchClients = exports.filterClients = exports.getCommentsByClient = exports.createComment = exports.getSavedArticles = exports.editSavedArticles = exports.updatePaymentData = void 0;
const index_1 = __importDefault(require("../database/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const updatePaymentData = (id, subscription, plan, paymentDate, paymentExpireDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [client] = yield index_1.default.query(`UPDATE clients SET subscription = '${subscription}', paymentDate = '${paymentDate}',
      paymentExpireDate = '${paymentExpireDate}', plan = '${plan}', accountBlocked = '0'
        WHERE id = ${id}`);
        if (client) {
            return {
                message: "Profile updated successfully",
                status: statusCodes_1.default.CREATED,
            };
        }
        return {
            message: "Client not found",
            status: statusCodes_1.default.NOT_FOUND,
        };
    }
    catch (error) {
        return {
            message: "Something went wrong",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        };
    }
});
exports.updatePaymentData = updatePaymentData;
const editSavedArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { savedArticles } = req.body;
        const [client] = yield index_1.default.query(`UPDATE clients SET savedArticles = '${savedArticles}' WHERE id = ${id}`);
        if (client) {
            res.status(statusCodes_1.default.CREATED);
            res.send({
                message: "Saved articles edited successfully",
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
exports.editSavedArticles = editSavedArticles;
const getSavedArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [articleList] = yield index_1.default.query(`SELECT savedArticles FROM clients WHERE id = ${id}`);
        if (articleList) {
            return res.status(statusCodes_1.default.OK).json({
                data: articleList[0].savedArticles === ""
                    ? "[]"
                    : articleList[0].savedArticles,
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
exports.getSavedArticles = getSavedArticles;
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clientId, comment, author, date, hour } = req.body;
        const createComment = yield index_1.default.query(`INSERT INTO comments (clientId, comment, author, date, hour) VALUES ('${clientId}', '${comment}', '${author}', '${date}', '${hour}');`);
        if (createComment) {
            return res.status(statusCodes_1.default.CREATED).json({
                message: "Comment created successfully",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "An error has occurred while saving the comment, please try again.",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.createComment = createComment;
const getCommentsByClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [comments] = yield index_1.default.query(`SELECT * FROM comments WHERE clientId = ${id} ORDER BY id DESC`);
        if (comments) {
            return res
                .status(statusCodes_1.default.OK)
                .json({ data: comments, status: statusCodes_1.default.OK });
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
exports.getCommentsByClient = getCommentsByClient;
const filterClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { regionIds, planIds } = req.body;
        let clients = [];
        for (let i = 0; i < regionIds.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const [results] = yield index_1.default.query(`SELECT * FROM clients WHERE region LIKE '%${regionIds[i]}%'`);
            clients = [...clients, ...results];
        }
        for (let i = 0; i < planIds.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const [results] = yield index_1.default.query(`SELECT * FROM clients WHERE plan LIKE '%${planIds[i]}%'`);
            clients = [...clients, ...results];
        }
        if (clients) {
            return res.status(statusCodes_1.default.OK).json({
                data: clients,
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
exports.filterClients = filterClients;
const searchClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const { search } = req.body;
        const [clients] = yield index_1.default.query(`SELECT * FROM clients WHERE name LIKE '%${search}%' OR lastName LIKE '%${search}%' OR email LIKE '%${search}%' OR identificationNumber LIKE '%${search}%' OR realEstateRegistration LIKE '%${search}%'`);
        if (clients) {
            return res.status(statusCodes_1.default.OK).json({
                data: clients,
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
exports.searchClients = searchClients;
const getClientsEmails = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [emails] = yield index_1.default.query(`SELECT email FROM clients WHERE subscription = 1`);
        if (emails) {
            return res.status(statusCodes_1.default.OK).json({
                data: emails,
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
exports.getClientsEmails = getClientsEmails;
const getClientEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [email] = yield index_1.default.query(`SELECT email FROM clients WHERE id = '${id}'`);
        if (email) {
            return res.status(statusCodes_1.default.OK).json({
                data: email,
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
exports.getClientEmail = getClientEmail;
