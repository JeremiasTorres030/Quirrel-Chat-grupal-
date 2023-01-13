"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.group = exports.user = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    uid: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
});
const groupSchema = new mongoose_1.default.Schema({
    groupname: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        required: true,
    },
    messages: [messageSchema],
    members: { type: Array },
});
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    groups: { type: Array },
    invitations: { type: Array },
});
exports.user = mongoose_1.default.model('user', userSchema);
exports.group = mongoose_1.default.model('group', groupSchema);
