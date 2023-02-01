"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const users_controllers_1 = require("../controllers/users.controllers");
const validarCampos_1 = require("../middleware/validarCampos");
const verificarToken_1 = require("../middleware/verificarToken");
exports.router = (0, express_1.Router)();
// users routes
exports.router.get('/api/user/all', users_controllers_1.getAllUsers);
exports.router.get('/api/user/:id', users_controllers_1.getUserInvitations);
exports.router.post('/api/user/new', [
    (0, express_validator_1.check)('username', 'El nombre de usuario es obligatorio').isString(),
    (0, express_validator_1.check)('password', 'La contraseña es obligatoria').isString(),
    (0, express_validator_1.check)('email', 'El email es obligatorio').isString().isEmail(),
    validarCampos_1.validarCampos,
], users_controllers_1.createUser);
exports.router.post('/api/user/login', [
    (0, express_validator_1.check)('email', 'El email es obligatorio').isString().isEmail(),
    (0, express_validator_1.check)('password', 'La contraseña es obligatoria').isString(),
    validarCampos_1.validarCampos,
], users_controllers_1.loginUser);
exports.router.put('/api/user/edit/:id', users_controllers_1.editUser);
exports.router.delete('/api/user/delete/:id', users_controllers_1.deleteUser);
exports.router.get('/api/user/token/validate', verificarToken_1.verficarToken, users_controllers_1.renovarToken);
