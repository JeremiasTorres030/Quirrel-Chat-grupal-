"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const db_1 = require("./database/db");
const users_routes_1 = require("./routes/users.routes");
const group_routes_1 = require("./routes/group.routes");
const message_routes_1 = require("./routes/message.routes");
const path_1 = require("path");
const env_config_1 = require("./env.config");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
exports.server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(exports.server, {
    cors: { origin: 'https://chat-production-fd71.up.railway.app/' },
});
let usersConnected = [];
io.on('connection', (client) => {
    client.on('userID', (userID) => {
        if (usersConnected.find((user) => user.userID === userID) === undefined) {
            usersConnected.push({ userID, socketID: client.id });
        }
    });
    client.on('chat message', (uid) => {
        uid.forEach((uid) => {
            const user = usersConnected.find((user) => user.userID === uid);
            if (user !== undefined) {
                io.to(user.socketID).emit('chat message');
            }
        });
    });
    client.on('invitation', (data) => {
        const user = usersConnected.find((user) => user.userID === data.userInvited);
        if (user !== undefined) {
            io.to(user.socketID).emit('invitationClient', data);
        }
    });
    client.on('updateGroup', (uid) => {
        uid.forEach((uid) => {
            const user = usersConnected.find((user) => user.userID === uid);
            if (user !== undefined) {
                io.to(user.socketID).emit('updateGroup');
            }
        });
    });
    client.on('editGroup', (uid) => {
        uid.forEach((uid) => {
            const user = usersConnected.find((user) => user.userID === uid);
            if (user !== undefined) {
                io.to(user.socketID).emit('editGroup');
            }
        });
    });
    client.on('deleteGroup', (uid) => {
        uid.forEach((uid) => {
            const user = usersConnected.find((user) => user.userID === uid);
            if (user !== undefined) {
                io.to(user.socketID).emit('deleteGroup');
            }
        });
    });
    client.on('disconnect', () => {
        usersConnected = usersConnected.filter((user) => user.socketID !== client.id);
    });
});
void (0, db_1.connectDB)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(users_routes_1.router);
app.use(group_routes_1.router);
app.use(message_routes_1.router);
app.use(express_1.default.static((0, path_1.join)(__dirname, '../../client/build')));
app.get('*', (_req, res) => {
    res.sendFile((0, path_1.join)(__dirname, '../../client/build/index.html'));
});
exports.server.listen((0, env_config_1.PORT)(), () => {
    console.log('El servidor esta corriendo en el puerto 3000');
});
