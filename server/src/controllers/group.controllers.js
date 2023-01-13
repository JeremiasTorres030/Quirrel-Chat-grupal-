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
exports.editGroup = exports.exitGroup = exports.deleteInvitationGroup = exports.inviteMemberGroup = exports.getMessagesGroup = exports.allUserGroup = exports.addMemberGroup = exports.deleteGroup = exports.createGroup = exports.getUnicGroup = exports.getAllGroups = void 0;
const user_model_1 = require("../models/user.model");
const getAllGroups = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield user_model_1.group.find();
        if (response !== null) {
            res.status(200).json({
                ok: true,
                data: response,
            });
            return;
        }
        res.status(404).json({
            ok: false,
            msg: 'No se encontro ningun grupo',
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
exports.getAllGroups = getAllGroups;
const getUnicGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const response = yield user_model_1.group.findById(id);
        if (response !== null) {
            const membersData = yield Promise.all(response.members.map((users) => __awaiter(void 0, void 0, void 0, function* () {
                const userData = yield user_model_1.user.findById(users.uid);
                return {
                    username: userData === null || userData === void 0 ? void 0 : userData.username,
                    uid: userData === null || userData === void 0 ? void 0 : userData.id,
                    image: userData === null || userData === void 0 ? void 0 : userData.image,
                    rol: users.rol,
                };
            })));
            res.status(200).json({
                ok: true,
                groupData: response,
                membersData,
            });
            return;
        }
        res.status(404).json({
            ok: false,
            msg: 'No se econtro ningun grupo',
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
exports.getUnicGroup = getUnicGroup;
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { groupname, image } = req.body;
    if (image === '') {
        image =
            'https://res.cloudinary.com/drifqbdtu/image/upload/v1663803197/Chat/groupImages/GroupImageDefault_bkwkek.jpg';
    }
    try {
        const response = yield user_model_1.group.create({ groupname, image });
        if (response !== null) {
            res.status(200).json({
                ok: true,
                data: response,
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
exports.createGroup = createGroup;
const deleteGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { gid } = req.params;
    try {
        const deleteGroup = yield user_model_1.group.findByIdAndDelete(gid);
        if (deleteGroup !== null) {
            deleteGroup.members.forEach(({ uid }) => __awaiter(void 0, void 0, void 0, function* () {
                const findUsers = yield user_model_1.user.findById(uid);
                if (findUsers !== null) {
                    findUsers.groups = findUsers === null || findUsers === void 0 ? void 0 : findUsers.groups.filter((group) => group !== gid);
                    yield user_model_1.user.findByIdAndUpdate(findUsers.id, {
                        groups: findUsers.groups,
                    });
                }
            }));
            res.status(200).json({
                ok: true,
                msg: 'Grupo eliminado',
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
exports.deleteGroup = deleteGroup;
const addMemberGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, gid } = req.body;
    try {
        const findGroup = yield user_model_1.group.findById(gid);
        const findUser = yield user_model_1.user.findById(uid);
        if (findGroup !== null && findUser !== null) {
            if (findGroup.members.length === 0) {
                findGroup.members.push({ uid, rol: 'admin' });
            }
            else {
                findGroup.members.push({ uid, rol: 'miembro' });
            }
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            findGroup.messages.push({
                uid: findUser === null || findUser === void 0 ? void 0 : findUser.id,
                message: `${findUser === null || findUser === void 0 ? void 0 : findUser.username} se ha unido al grupo`,
                type: 'member',
            });
            findUser.groups.push(gid);
            findUser.invitations = findUser.invitations.filter((inv) => inv.groupID !== gid);
            yield user_model_1.group.findByIdAndUpdate(gid, { members: findGroup === null || findGroup === void 0 ? void 0 : findGroup.members, messages: findGroup === null || findGroup === void 0 ? void 0 : findGroup.messages }, { new: true });
            yield user_model_1.user.findByIdAndUpdate(uid, { groups: findUser === null || findUser === void 0 ? void 0 : findUser.groups, invitations: findUser === null || findUser === void 0 ? void 0 : findUser.invitations }, { new: true });
            res.status(200).json({
                ok: true,
                msg: 'Usuario agregado con exito',
                data: { gid },
            });
            return;
        }
        res.status(404).json({
            ok: false,
            msg: 'El grupo no se econtro',
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
exports.addMemberGroup = addMemberGroup;
const allUserGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    try {
        const response = yield user_model_1.user.findById(id);
        if (response !== null) {
            const groupData = yield Promise.all((_a = response === null || response === void 0 ? void 0 : response.groups) === null || _a === void 0 ? void 0 : _a.map((groupID) => __awaiter(void 0, void 0, void 0, function* () {
                const groupResponse = yield user_model_1.group.findById(groupID);
                if (groupResponse !== null) {
                    return {
                        image: groupResponse === null || groupResponse === void 0 ? void 0 : groupResponse.image,
                        _id: groupResponse === null || groupResponse === void 0 ? void 0 : groupResponse.id,
                        groupname: groupResponse === null || groupResponse === void 0 ? void 0 : groupResponse.groupname,
                        members: groupResponse === null || groupResponse === void 0 ? void 0 : groupResponse.members,
                    };
                }
                return null;
            })));
            if (groupData.length !== 0) {
                res.status(200).json({
                    ok: true,
                    groupData: groupData.filter((group) => {
                        return group !== null;
                    }),
                });
                return;
            }
            res.status(200).json({
                ok: true,
                groupData: [],
            });
            return;
        }
        res.status(404).json({
            ok: false,
            msg: 'El usuario proveido no existe',
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
exports.allUserGroup = allUserGroup;
const getMessagesGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const response = yield user_model_1.group.findById(id);
        if (response !== null) {
            res.status(200).json({
                ok: true,
                messages: response.messages,
            });
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
exports.getMessagesGroup = getMessagesGroup;
const inviteMemberGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { gid, uid, inviteid } = req.body;
    try {
        const response = yield user_model_1.user.findById(inviteid);
        const userHost = yield user_model_1.user.findById(uid);
        const groupInvitation = yield user_model_1.group.findById(gid);
        if (response !== null && userHost !== null && groupInvitation !== null) {
            if (groupInvitation.members.find((user) => {
                return user.uid === inviteid;
            }) !== undefined) {
                res.status(400).json({
                    ok: false,
                    msg: 'El usuario ya esta en el grupo',
                });
                return;
            }
            response.invitations.push({
                groupID: gid,
                username: userHost === null || userHost === void 0 ? void 0 : userHost.username,
                groupName: groupInvitation === null || groupInvitation === void 0 ? void 0 : groupInvitation.groupname,
            });
            yield user_model_1.user.findByIdAndUpdate(inviteid, { invitations: response === null || response === void 0 ? void 0 : response.invitations }, { new: true });
            res.status(200).json({
                ok: true,
                msg: 'Invitacion enviada',
                data: {
                    gid,
                    user: userHost === null || userHost === void 0 ? void 0 : userHost.username,
                    groupname: groupInvitation === null || groupInvitation === void 0 ? void 0 : groupInvitation.groupname,
                    userInvited: inviteid,
                },
            });
            return;
        }
        res.status(404).json({
            ok: false,
            msg: 'Parece que algunos de los elementos no existen',
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
exports.inviteMemberGroup = inviteMemberGroup;
const deleteInvitationGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, gid } = req.params;
    try {
        const response = yield user_model_1.user.findById(uid);
        if (response !== null) {
            response.invitations = response.invitations.filter((inv) => inv.groupID !== gid);
            yield user_model_1.user.findByIdAndUpdate(uid, { invitations: response.invitations });
            res.status(200).json({
                ok: true,
                msg: 'Invitacion rechazada con exito',
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
exports.deleteInvitationGroup = deleteInvitationGroup;
const exitGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, gid } = req.params;
    try {
        const findUser = yield user_model_1.user.findById(uid);
        const findGroup = yield user_model_1.group.findById(gid);
        if (findUser !== null && findGroup !== null) {
            findUser.groups = findUser === null || findUser === void 0 ? void 0 : findUser.groups.filter((groups) => groups !== gid);
            findGroup.members = findGroup === null || findGroup === void 0 ? void 0 : findGroup.members.filter((members) => members.uid !== uid);
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            findGroup.messages.push({
                message: `${findUser.username} ha salido del grupo`,
                type: 'member',
                uid: findUser.id,
            });
            yield user_model_1.user.findByIdAndUpdate(uid, { groups: findUser === null || findUser === void 0 ? void 0 : findUser.groups });
            yield user_model_1.group.findByIdAndUpdate(gid, {
                members: findGroup === null || findGroup === void 0 ? void 0 : findGroup.members,
                messages: findGroup.messages,
            });
            res.status(200).json({
                ok: true,
                msg: 'El usuario salio con exito',
            });
            return;
        }
        res.status(404).json({
            ok: false,
            msg: 'El usuario o el grupo es inexistente',
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
exports.exitGroup = exitGroup;
const editGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { gid } = req.params;
    const body = req.body;
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
        const response = yield user_model_1.group.findByIdAndUpdate(gid, data, { new: true });
        if (response !== null) {
            res.status(200).json({
                ok: true,
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
exports.editGroup = editGroup;
