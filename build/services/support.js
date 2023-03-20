var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import sendEmail from "../helpers/sendEmail";
const unblockRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return sendEmail([req.body.recipients], "Solicitud de desbloqueo de cuenta", "unblockAccountRequest", {
        name: req.body.name,
        clientName: req.body.clientName,
        unblockURL: req.body.unblockURL,
    }, res);
});
// eslint-disable-next-line import/prefer-default-export
export { unblockRequest };
