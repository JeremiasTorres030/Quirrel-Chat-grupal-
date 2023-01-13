"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verficarToken = void 0;
const env_config_1 = require("../env.config");
const jsonwebtoken_1 = require("jsonwebtoken");
const verficarToken = (req, res, next) => {
    const token = req.header('x-token');
    if (token === undefined || token === '') {
        res.status(400).json({
            ok: false,
            msg: 'El token no ha sido proveido'
        });
        return;
    }
    try {
        const userValidated = (0, jsonwebtoken_1.verify)(token, (0, env_config_1.SECRET_JWT_SEED)());
        req.uid = userValidated.id;
        req.email = userValidated.email;
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: error
        });
    }
    next();
};
exports.verficarToken = verficarToken;
