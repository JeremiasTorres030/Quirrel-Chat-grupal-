import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  AddMemberGroup,
  DataApi,
  DataApiAddMember,
  DataApiEditGroup,
  DataApiGetGroup,
  DataApiMessages,
  DataApiResponse,
  DataApiSendInvitation,
  DataApiUserGroups,
  GroupFields,
} from 'src/types';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) {}

  createGroup(group: GroupFields): Observable<DataApi> {
    return this.http.post<DataApi>(`${this.apiUrl}group/new`, group).pipe(
      tap((res) => {
        if (res.ok) {
          this.addMemberGroup({
            uid: this.userService.user.uid,
            gid: res.data._id,
          }).subscribe();
        }
      })
    );
  }

  getGroupMessages(id: string): Observable<DataApiMessages> {
    return this.http.get<DataApiMessages>(`${this.apiUrl}group/messages/${id}`);
  }

  getAllUserGroups(): Observable<DataApiUserGroups> {
    return this.http.get<DataApiUserGroups>(
      `${this.apiUrl}group/usergroup/${this.userService.user.uid}`
    );
  }

  addMemberGroup(member: AddMemberGroup): Observable<DataApiAddMember> {
    return this.http.post<DataApiAddMember>(
      `${this.apiUrl}group/member/add`,
      member
    );
  }

  sendInvitationGroup(
    member: AddMemberGroup
  ): Observable<DataApiSendInvitation> {
    return this.http.post<DataApiSendInvitation>(
      `${this.apiUrl}group/member/invite`,
      member
    );
  }

  deniedInvitationGroup(member: AddMemberGroup): Observable<DataApiResponse> {
    return this.http.delete<DataApiResponse>(
      `${this.apiUrl}group/member/invite/denied/${member.uid}/${member.gid}`
    );
  }

  getUnicGroup(id: string): Observable<DataApiGetGroup> {
    return this.http.get<DataApiGetGroup>(`${this.apiUrl}group/${id}`);
  }

  exitGroup(uid: string, gid: string): Observable<DataApiResponse> {
    return this.http.delete<DataApiResponse>(
      `${this.apiUrl}group/member/exit/${uid}/${gid}`
    );
  }

  editGroup(gid: string, values: GroupFields): Observable<DataApiEditGroup> {
    return this.http.put<DataApiEditGroup>(
      `${this.apiUrl}group/edit/${gid}`,
      values
    );
  }

  deleteGroup(gid: string): Observable<DataApiResponse> {
    return this.http.delete<DataApiResponse>(
      `${this.apiUrl}group/delete/${gid}`
    );
  }
}
