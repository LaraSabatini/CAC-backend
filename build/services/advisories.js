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
exports.getAdvisoryById = exports.getAllAdvisoriesByMonth = exports.getAdvisoriesByMonthAndAdmin = exports.editPublicEvent = exports.deletePublicEvent = exports.getAdvisoriesByMonth = exports.signUpToEvent = exports.getEvents = exports.requestAdvisoryChange = exports.createEvent = exports.changeAdvisoryStatus = exports.requestAdvisory = void 0;
const index_1 = __importDefault(require("../database/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const sendEmail_1 = __importDefault(require("../helpers/sendEmail"));
const getAdminInfo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const [admin] = yield index_1.default.query(`SELECT email, userName FROM admin WHERE id = '${id}'`);
    return admin[0];
});
const getClientInfo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const [client] = yield index_1.default.query(`SELECT name, lastName, email FROM clients WHERE id = '${id}'`);
    return client[0];
});
const requestAdvisory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId, clientId, date, hour, month, brief, eventURL, status } = req.body;
        const client = yield getClientInfo(clientId);
        const request = yield index_1.default.query(`INSERT INTO advisories (adminId, clientId, clientName, date, hour, month, brief, eventURL, status) VALUES ('${adminId}', '${clientId}', '${client.name} ${client.lastName}', '${date}', '${hour}', '${month}', '${brief}', '${eventURL}', '${status}');`);
        if (request) {
            const admin = yield getAdminInfo(adminId);
            return sendEmail_1.default([admin.email], "Solicitud de asesoria", "requestAdvisory", {
                clientName: `${client.name} ${client.lastName}`,
                adminName: `${admin.userName}`,
                dateData: {
                    day: date,
                    hour,
                    brief,
                },
                confirmURL: "url de software confirmacion con queries",
            }, res);
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Internal error",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.requestAdvisory = requestAdvisory;
const getAdvisoriesByMonth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { month, id, type } = req.params;
        const [request] = type === "client"
            ? yield index_1.default.query(`SELECT * FROM advisories WHERE month = '${month}' AND clientId = '${id}';`)
            : yield index_1.default.query(`SELECT * FROM advisories WHERE month = '${month}' AND adminId = '${id}';`);
        if (request) {
            return res.status(statusCodes_1.default.CREATED).json({
                data: request,
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Internal error",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.getAdvisoriesByMonth = getAdvisoriesByMonth;
const requestAdvisoryChange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from } = req.params;
        const { id, adminId, clientId, date, hour, month, eventURL, status } = req.body;
        const [advisory] = yield index_1.default.query(`UPDATE advisories SET date = '${date}', hour = '${hour}', month = '${month}', eventURL = '${eventURL}', status = '${status}' WHERE id = ${id}`);
        if (advisory) {
            const admin = yield getAdminInfo(adminId);
            const client = yield getClientInfo(clientId);
            return sendEmail_1.default(from === "client" ? [admin.email] : [client.email], "Solicitud de modificacion de asesoria", "requestAdvisoryChange", {
                clientName: from === "client"
                    ? `${client.name} ${client.lastName}`
                    : `${admin.userName}`,
                adminName: from === "client"
                    ? `${admin.userName}`
                    : `${client.name} ${client.lastName}`,
                dateData: {
                    day: date,
                    hour,
                },
                confirmURL: from === "client" ? "para admin" : "para cliente",
            }, res);
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Internal error",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.requestAdvisoryChange = requestAdvisoryChange;
const changeAdvisoryStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from } = req.params;
        const { id, status, adminId, clientId, googleCalendarEvent } = req.body;
        const [advisory] = yield index_1.default.query(`UPDATE advisories SET status = '${status}', eventURL = '${googleCalendarEvent}' WHERE id = ${id}`);
        if (advisory) {
            const admin = yield getAdminInfo(adminId);
            const client = yield getClientInfo(clientId);
            return sendEmail_1.default(from === "client" ? [admin.email] : [client.email], status === "confirmed"
                ? "La solicitud de asesoria ha sido confirmada"
                : "La asesoria ha sido cancelada", "changeAdvisoryStatus", {
                clientName: from === "client"
                    ? `${client.name} ${client.lastName}`
                    : `${admin.userName}`,
                adminName: from === "client"
                    ? `${admin.userName}`
                    : `${client.name} ${client.lastName}`,
                message: {
                    title: status === "confirmed"
                        ? "La asesoria ha sido confirmada"
                        : "La asesoria ha sido cancelada",
                    description: status === "confirmed"
                        ? "tu cita de asesoria ha sido confirmada."
                        : "tu cita de asesoria ha sido cancelada.",
                },
                butttonURL: status === "confirmed"
                    ? {
                        text: "Ver evento en Google Calendar",
                        url: googleCalendarEvent,
                    }
                    : {
                        text: "ir al soft",
                        url: "http://localhost:3000/advisories",
                    },
            }, res);
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Internal error",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.changeAdvisoryStatus = changeAdvisoryStatus;
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, date, hour, month, eventURL, attendant, createdBy, } = req.body;
        const request = yield index_1.default.query(`INSERT INTO publicEvents (title, description, date, hour, month, eventURL, attendant, createdBy) VALUES ('${title}', '${description}', '${date}', '${hour}', '${month}', '${eventURL}', '${attendant}', '${createdBy}');`);
        if (request) {
            return res.status(statusCodes_1.default.CREATED).json({
                message: "success",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Internal error",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.createEvent = createEvent;
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { month } = req.params;
        const [events] = yield index_1.default.query(`SELECT * FROM publicEvents WHERE month LIKE '${month}'`);
        if (events) {
            return res.status(statusCodes_1.default.OK).json({
                data: events,
                status: statusCodes_1.default.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Internal error",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.getEvents = getEvents;
const signUpToEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, clientIds } = req.body;
        const [event] = yield index_1.default.query(`UPDATE publicEvents SET attendant = '${clientIds}' WHERE id = ${id}`);
        if (event) {
            return res.status(statusCodes_1.default.CREATED).json({
                data: "success",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Internal error",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.signUpToEvent = signUpToEvent;
const deletePublicEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [event] = yield index_1.default.query(`DELETE FROM publicEvents WHERE id= '${id}'`);
        if (event) {
            res.status(statusCodes_1.default.OK);
            res.send({
                message: "Event deleted successfully",
                status: statusCodes_1.default.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Internal error",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.deletePublicEvent = deletePublicEvent;
const editPublicEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, description, title, date, hour, month } = req.body;
        const [event] = yield index_1.default.query(`UPDATE publicEvents SET title = '${title}', description = '${description}', date = '${date}', hour = '${hour}', month = '${month}' WHERE id= '${id}'`);
        if (event) {
            res.status(statusCodes_1.default.CREATED);
            res.send({
                message: "Event edited successfully",
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Internal error",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.editPublicEvent = editPublicEvent;
const getAdvisoriesByMonthAndAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { month, adminId } = req.params;
        const [request] = yield index_1.default.query(`SELECT * FROM advisories WHERE month = '${month}' AND adminId = '${adminId}';`);
        if (request) {
            return res.status(statusCodes_1.default.OK).json({
                data: request,
                status: statusCodes_1.default.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Internal error",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.getAdvisoriesByMonthAndAdmin = getAdvisoriesByMonthAndAdmin;
const getAllAdvisoriesByMonth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { month } = req.params;
        const [request] = yield index_1.default.query(`SELECT * FROM advisories WHERE month = '${month}';`);
        if (request) {
            return res.status(statusCodes_1.default.CREATED).json({
                data: request,
                status: statusCodes_1.default.CREATED,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Internal error",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.getAllAdvisoriesByMonth = getAllAdvisoriesByMonth;
const getAdvisoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [request] = yield index_1.default.query(`SELECT * FROM advisories WHERE id = '${id}';`);
        if (request) {
            return res.status(statusCodes_1.default.OK).json({
                data: request,
                status: statusCodes_1.default.OK,
            });
        }
    }
    catch (error) {
        return res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Internal error",
            status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
        });
    }
    return {};
});
exports.getAdvisoryById = getAdvisoryById;
