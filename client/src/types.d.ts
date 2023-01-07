export interface GroupMessages {
  image?: string;
  username?: string;
  userID: string;
  message: string;
  type: string;
}

export interface GroupMembers {
  uid: string;
  rol: string;
  username?: string;
  image?: string;
}

export interface User {
  uid: string;
  email: string;
  username: string;
  groups: Array<string>;
  invitations: Array<Invivtations>;
  image: string;
  token?: string;
}

export interface InvitationData {
  user: string;
  groupname: string;
  gid: string;
  userInvited: string;
}

export interface Groups {
  groupname: string;
  image: string;
  members: Array<GroupMembers>;
  messages: Array<GroupMessages>;
  _id: string;
}

export interface Invivtations {
  groupID: string;
  username: string;
  groupName: string;
}

export interface GroupFields {
  groupname?: string;
  image?: string;
}

export interface AddMemberGroup {
  inviteid?: string;
  gid: string;
  uid: string;
}

export interface DataApi {
  ok: boolean;
  data: Groups;
}

export interface DataApiMessages {
  ok: boolean;
  messages: Array<GroupMessages>;
}

export interface DataApiUserGroups {
  ok: boolean;
  groupData: Array<Groups>;
}

export interface DataApiAddMember {
  ok: boolean;
  msg: string;
  data: { gid: string };
}

export interface DataApiSendInvitation {
  ok: boolean;
  msg: string;
  data: InvitationData;
}

export interface DataApiResponse {
  ok: boolean;
  msg: string;
}

export interface DataApiGetGroup {
  ok: boolean;
  groupData: Groups;
  membersData: Array<GroupMembers>;
}

export interface DataApiEditGroup {
  ok: boolean;
  data: GroupFields;
  msg: string;
}

export interface DataApiUser {
  ok: boolean;
  msg: string;
  data: User;
}

export interface UserEdit {
  image: string;
  username: string;
}

export interface DataApiUserEdit {
  ok: boolean;
  msg: string;
  data: UserEdit;
}

export interface DataApiUserInvitations {
  ok: boolean;
  data: Array<Invivtations>;
}

export interface DataApiAllUsers {
  ok: boolean;
  data: Array<{ uid: string; username: string; image: string; rol: string }>;
}

export interface GroupMembersMessages extends GroupMembers {
  message: string;
  type: string;
}
