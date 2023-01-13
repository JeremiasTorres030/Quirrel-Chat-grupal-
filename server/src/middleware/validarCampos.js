"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCampos = void 0;
const express_validator_1 = require("express-validator");
const validarCampos = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }
    else {
        next();
    }
};
exports.validarCampos = validarCampos;
