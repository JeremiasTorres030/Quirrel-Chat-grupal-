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
exports.jwtGenerator = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const env_config_1 = require("../env.config");
const jwtGenerator = (email, id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => {
        (0, jsonwebtoken_1.sign)({ email, id }, (0, env_config_1.SECRET_JWT_SEED)(), { expiresIn: '24h' }, (err, token) => {
            if (err !== null) {
                console.log(err);
                reject(err);
            }
            resolve(token);
        });
    });
});
exports.jwtGenerator = jwtGenerator;
