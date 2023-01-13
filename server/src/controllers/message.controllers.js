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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewMessage = void 0;
const user_model_1 = require("../models/user.model");
const createNewMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { gid } = req.params;
    const { uid, message, type } = req.body;
    try {
        const response = yield user_model_1.group.findById(gid);
        if (response !== null) {
            response === null || response === void 0 ? void 0 : response.messages.push({ uid: uid, message, type });
            yield user_model_1.group.findByIdAndUpdate(gid, { messages: response.messages });
            res.status(200).json({
                ok: true,
                msg: 'Mensaje enviado con exito',
            });
            return;
        }
        res.status(404).json({
            ok: false,
            msg: 'El grupo no existe',
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error en el servidor',
        });
    }
});
exports.createNewMessage = createNewMessage;
