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
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cors_1.default({
    origin: ["https://cac-frontend-qa.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
}));
app.use(express_fileupload_1.default());
app.use(express_1.default.static("files"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/users", auth_1.default);
app.use("/pricing", pricing_1.default);
app.use("/articles", articles_1.default);
app.use("/payment", payment_1.default);
app.use("/reCaptcha", validateReCaptcha_1.default);
app.use("/feedback", feedback_1.default);
app.use("/fileManagement", fileManagement_1.default);
app.use("/filters", filters_1.default);
app.use("/support", support_1.default);
app.get("/", (_req, res) => {
    res.json({ message: "ok" });
});

app.listen(config_1.default.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`APP LISTENING ON http://${config_1.default.HOST}:${config_1.default.PORT}`);
});
