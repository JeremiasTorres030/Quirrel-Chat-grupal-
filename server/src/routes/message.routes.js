"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const message_controllers_1 = require("../controllers/message.controllers");
exports.router = (0, express_1.Router)();
exports.router.post('/api/message/new/:gid', message_controllers_1.createNewMessage);
