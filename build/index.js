"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config"));
const auth_1 = __importDefault(require("./routes/auth"));
const pricing_1 = __importDefault(require("./routes/pricing"));
const articles_1 = __importDefault(require("./routes/articles"));
const payment_1 = __importDefault(require("./routes/payment"));
const validateReCaptcha_1 = __importDefault(require("./routes/validateReCaptcha"));
const feedback_1 = __importDefault(require("./routes/feedback"));
const fileManagement_1 = __importDefault(require("./routes/fileManagement"));
const filters_1 = __importDefault(require("./routes/filters"));
const support_1 = __importDefault(require("./routes/support"));
const mercadoPago_1 = __importDefault(require("./routes/mercadoPago"));
const clients_1 = __importDefault(require("./routes/clients"));
const trainings_1 = __importDefault(require("./routes/trainings"));
const advisories_1 = __importDefault(require("./routes/advisories"));
const admins_1 = __importDefault(require("./routes/admins"));
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cors_1.default({
    origin: [
        "https://cac-frontend-qa.vercel.app",
        "http://localhost:3000",
        "https://cac-frontend-git-feat-update-payment-larasabatini.vercel.app",
        "https://camarafederal.com.ar/",
        "http://camarafederal.com.ar/",
    ],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
}));
app.use(express_fileupload_1.default());
app.use(express_1.default.static("files"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/plataforma/api/users", auth_1.default);
app.use("/plataforma/api/pricing", pricing_1.default);
app.use("/plataforma/api/articles", articles_1.default);
app.use("/plataforma/api/payment", payment_1.default);
app.use("/plataforma/api/reCaptcha", validateReCaptcha_1.default);
app.use("/plataforma/api/feedback", feedback_1.default);
app.use("/plataforma/api/fileManagement", fileManagement_1.default);
app.use("/plataforma/api/filters", filters_1.default);
app.use("/plataforma/api/support", support_1.default);
app.use("/plataforma/api/mercadoPago", mercadoPago_1.default);
app.use("/plataforma/api/clients", clients_1.default);
app.use("/plataforma/api/trainings", trainings_1.default);
app.use("/plataforma/api/advisories", advisories_1.default);
app.use("/plataforma/api/admins", admins_1.default);
app.get("/plataforma/api", (_req, res) => {
    res.json({ message: "ok" });
});
app.listen(config_1.default.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`APP LISTENING ON http://${config_1.default.HOST}:${config_1.default.PORT}`);
});
