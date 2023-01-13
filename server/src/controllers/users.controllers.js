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
exports.editUser = exports.renovarToken = exports.loginUser = exports.deleteUser = exports.createUser = exports.getUserInvitations = exports.getAllUsers = void 0;
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = require("bcryptjs");
const jwtGenerator_1 = require("../helpers/jwtGenerator");
const getAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield user_model_1.user.find();
        if (response !== null) {
            const userData = response.map((user) => {
                return { uid: user.id, username: user.username, image: user.image };
            });
            res.status(200).json({
                ok: true,
                data: userData,
            });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
        });
    }
});
exports.getAllUsers = getAllUsers;
const getUserInvitations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const response = yield user_model_1.user.findById(id);
        if (response !== null) {
            res.status(200).json({
                ok: true,
                data: response === null || response === void 0 ? void 0 : response.invitations,
            });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
        });
    }
});
exports.getUserInvitations = getUserInvitations;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, username, password, image } = req.body;
    if (image === '') {
        image =
            'https://res.cloudinary.com/drifqbdtu/image/upload/v1663803554/Chat/profileImages/userDefaultImage_ci19ss.jpg';
    }
    const checkEmail = yield user_model_1.user.findOne({ email });
    const checkUsername = yield user_model_1.user.findOne({ username });
    if (checkEmail !== null) {
        res.status(400).json({
            ok: false,
            msg: 'El correo ya esta en uso',
        });
        return;
    }
    if (checkUsername !== null) {
        res.status(400).json({
            ok: false,
            msg: 'El nombre de usuario ya esta en uso',
        });
        return;
    }
    try {
        const salt = (0, bcryptjs_1.genSaltSync)(10);
        password = (0, bcryptjs_1.hashSync)(password, salt);
        const response = yield user_model_1.user.create({ email, username, password, image });
        const token = yield (0, jwtGenerator_1.jwtGenerator)(email, response.id);
        if (response !== null && token !== undefined) {
            res.status(200).json({
                ok: true,
                msg: 'Creado con exito',
                data: {
                    id: response === null || response === void 0 ? void 0 : response.id,
                    email,
                    username,
                    image,
                    groups: response === null || response === void 0 ? void 0 : response.groups,
                    token,
                },
            });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
        });
    }
});
exports.createUser = createUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const response = yield user_model_1.user.findByIdAndDelete(id);
        if (response !== null) {
            res.status(200).json({
                ok: true,
                msg: 'El usuario se elimino con exito',
            });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
        });
    }
});
exports.deleteUser = deleteUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const emailValidation = yield user_model_1.user.findOne({ email });
        if (emailValidation === null) {
            res.status(404).json({
                ok: false,
                msg: 'El correo no existe',
            });
            return;
        }
        if ((emailValidation === null || emailValidation === void 0 ? void 0 : emailValidation.password) !== undefined) {
            const passwordValidation = (0, bcryptjs_1.compareSync)(password, emailValidation === null || emailValidation === void 0 ? void 0 : emailValidation.password);
            if (!passwordValidation) {
                res.status(404).json({
                    ok: false,
                    msg: 'La contraseña es incorrecta',
                });
                return;
            }
        }
        const token = yield (0, jwtGenerator_1.jwtGenerator)(email, emailValidation === null || emailValidation === void 0 ? void 0 : emailValidation.id);
        res.status(200).json({
            ok: true,
            data: {
                uid: emailValidation === null || emailValidation === void 0 ? void 0 : emailValidation.id,
                token,
                email,
                image: emailValidation === null || emailValidation === void 0 ? void 0 : emailValidation.image,
                username: emailValidation === null || emailValidation === void 0 ? void 0 : emailValidation.username,
                groups: emailValidation === null || emailValidation === void 0 ? void 0 : emailValidation.groups,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
        });
    }
});
exports.loginUser = loginUser;
const renovarToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, email } = req;
    if (uid !== undefined && email !== undefined) {
        const token = yield (0, jwtGenerator_1.jwtGenerator)(email, uid);
        const userDB = yield user_model_1.user.findById(uid);
        if (userDB !== null) {
            res.json({
                ok: true,
                data: {
                    uid: userDB === null || userDB === void 0 ? void 0 : userDB.id,
                    email,
                    image: userDB === null || userDB === void 0 ? void 0 : userDB.image,
                    username: userDB === null || userDB === void 0 ? void 0 : userDB.username,
                    groups: userDB === null || userDB === void 0 ? void 0 : userDB.groups,
                    invitations: userDB === null || userDB === void 0 ? void 0 : userDB.invitations,
                    token,
                },
            });
        }
    }
});
exports.renovarToken = renovarToken;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const body = req.body;
    if (body.username !== undefined) {
        const usernameFind = yield user_model_1.user.findOne({ username: body.username });
        if (usernameFind !== null) {
            res.status(400).json({
                ok: false,
                msg: 'El nombre de usuario ya esta en uso',
            });
            return;
        }
    }
    const data = {};
    const keys = Object.keys(body);
    const values = Object.values(body);
    keys.forEach((key, index) => {
        if (values[index] === '') {
            return;
        }
        data[key] = values[index];
    });
    try {
        const response = yield user_model_1.user.findByIdAndUpdate(id, data, { new: true });
        if (response !== null) {
            res.status(200).json({
                ok: true,
                data: {
                    image: response === null || response === void 0 ? void 0 : response.image,
                    username: response === null || response === void 0 ? void 0 : response.username,
                },
                msg: 'Editado con exito',
            });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hubo un error en el servidor',
        });
    }
});
exports.editUser = editUser;
