import hbs from "nodemailer-express-handlebars";
import nodemailer from "nodemailer";
import path from "path";
import config from "../config/index";
import statusCodes from "../config/statusCodes";
const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve("../views/"),
        defaultLayout: false,
    },
    viewPath: path.resolve("./src/views/"),
};
const transportInfo = {
    host: config.MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: config.EMAIL,
        pass: config.MAIL_PASS,
    },
};
const sendEmail = (to, subject, template, context, res) => {
    const transporter = nodemailer.createTransport(transportInfo);
    transporter.use("compile", hbs(handlebarOptions));
    const mailOptions = {
        from: '"Camara federal" <admin@camarafederal.com.ar>',
        to,
        subject,
        template,
        context,
    };
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log("error", error);
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Something went wrong",
                status: statusCodes.INTERNAL_SERVER_ERROR,
            });
        }
        return res.status(statusCodes.CREATED).json({
            message: "Email sent successfully",
            status: statusCodes.CREATED,
        });
    });
};
export default sendEmail;
