"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.MONGO_URI = exports.SECRET_JWT_SEED = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const SECRET_JWT_SEED = () => {
    if (process.env.SECRET_JWT_SEED !== undefined) {
        return process.env.SECRET_JWT_SEED;
    }
    return '';
};
exports.SECRET_JWT_SEED = SECRET_JWT_SEED;
const MONGO_URI = () => {
    if (process.env.MONGO_URI !== undefined) {
        return process.env.MONGO_URI;
    }
    return '';
};
exports.MONGO_URI = MONGO_URI;
const PORT = () => {
    if (process.env.PORT !== undefined) {
        return process.env.PORT;
    }
    return '';
};
exports.PORT = PORT;
