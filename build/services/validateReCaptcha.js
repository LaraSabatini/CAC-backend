var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import config from "../config";
const validateReCaptcha = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    yield axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${config.RECAPTCHA_PRIVATE_KEY}&response=${token}`);
    if (res.status(200)) {
        res.status(201).json({ message: "Passed validation", status: 201 });
    }
    else {
        res.status(401).json({ message: "Not passed validation", status: 401 });
    }
    return {};
});
export default validateReCaptcha;
