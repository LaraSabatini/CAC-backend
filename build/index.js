import express from "express";
import config from "./config";
const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    next();
});
app.get("/", (_req, res) => {
    res.json({ message: "ok" });
});
app.listen(config.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`APP LISTENING ON http://${config.HOST}:${config.PORT}`);
});
