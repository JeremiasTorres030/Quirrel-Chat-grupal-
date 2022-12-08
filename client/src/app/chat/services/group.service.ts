import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) {}

  createGroup(group: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}group/new`, group).pipe(
      tap((res) => {
        if (res.ok) {
          this.addMemberGroup({
            uid: this.userService.user.id,
            gid: res.data._id,
          }).subscribe();
        }
      })
    );
  }

  getGroupMessages(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}group/messages/${id}`);
  }

  getAllUserGroups(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}group/usergroup/${this.userService.user.id}`
    );
  }

  addMemberGroup(member: any): Observable<any> {
    return this.http.post(`${this.apiUrl}group/member/add`, member);
  }

  sendInvitationGroup(member: any): Observable<any> {
    return this.http.post(`${this.apiUrl}group/member/invite`, member);
  }

  deniedInvitationGroup(member: any): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}group/member/invite/denied/${member.uid}/${member.gid}`
    );
  }

  getUnicGroup(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}group/${id}`);
  }

  exitGroup(uid: string, gid: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}group/member/exit/${uid}/${gid}`);
  }

  editGroup(gid: string, values: any): Observable<any> {
    return this.http.put(`${this.apiUrl}group/edit/${gid}`, values);
  }
}
