"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("../config/index"));
const statusCodes_1 = __importDefault(require("../config/statusCodes"));
const handlebarOptions = {
    viewEngine: {
        partialsDir: path_1.default.resolve("../views/"),
        defaultLayout: false,
    },
    viewPath: path_1.default.resolve("./src/views/"),
};
const transportInfo = {
    host: index_1.default.MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: index_1.default.EMAIL,
        pass: index_1.default.MAIL_PASS,
    },
};
const sendEmail = (to, subject, template, context, res) => {
    const transporter = nodemailer_1.default.createTransport(transportInfo);
    transporter.use("compile", nodemailer_express_handlebars_1.default(handlebarOptions));
    const mailOptions = {
        from: '"Camara federal" <info@vonceescalada.com>',
        to,
        subject,
        template,
        context,
    };
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            return res.status(statusCodes_1.default.CREATED).json({
                message: "Something went wrong",
                status: statusCodes_1.default.INTERNAL_SERVER_ERROR,
            });
        }
        return res.status(statusCodes_1.default.CREATED).json({
            message: "Email sent successfully",
            status: statusCodes_1.default.CREATED,
        });
    });
};
exports.default = sendEmail;
