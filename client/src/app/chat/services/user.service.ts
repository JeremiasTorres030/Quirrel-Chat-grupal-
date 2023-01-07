import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import {
  DataApiAllUsers,
  DataApiUser,
  DataApiUserEdit,
  DataApiUserInvitations,
  User,
  UserEdit,
} from 'src/types';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _socket = io(environment.socket);
  private apiUrl: string = environment.apiUrl;
  public user!: User;

  get socket() {
    return this._socket;
  }

  constructor(private http: HttpClient) {}

  signUp(user: {
    username: string;
    email: string;
    password: string;
    image: string;
  }): Observable<DataApiUser> {
    return this.http.post<DataApiUser>(`${this.apiUrl}user/new`, user).pipe(
      tap((res) => {
        if (res.ok && res.data.token) {
          localStorage.setItem('token', res.data.token);
          this.user = {
            email: res.data.email,
            uid: res.data.uid,
            username: res.data.username,
            groups: res.data.groups,
            invitations: res.data.invitations,
            image: res.data.image,
          };
        }
      })
    );
  }

  login(user: { email: string; password: string }): Observable<DataApiUser> {
    return this.http.post<DataApiUser>(`${this.apiUrl}user/login`, user).pipe(
      tap((res) => {
        if (res.ok && res.data.token) {
          localStorage.setItem('token', res.data.token);
          this.user = {
            email: res.data.email,
            uid: res.data.uid,
            username: res.data.username,
            groups: res.data.groups,
            invitations: res.data.invitations,
            image: res.data.image,
          };
        }
      })
    );
  }

  validateUser(): Observable<boolean> {
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );
    return this.http
      .get<DataApiUser>(`${this.apiUrl}user/token/validate`, { headers })
      .pipe(
        tap((res) => {
          if (res.ok && res.data.token) {
            localStorage.setItem('token', res.data.token);
            this.user = {
              email: res.data.email,
              uid: res.data.uid,
              username: res.data.username,
              groups: res.data.groups,
              invitations: res.data.invitations,
              image: res.data.image,
            };
            this.socket.emit('userID', res.data.uid);
          }
        }),
        map((res) => res.ok),
        catchError(() => of(false))
      );
  }

  editUser(data: UserEdit): Observable<DataApiUserEdit> {
    return this.http.put<DataApiUserEdit>(
      `${this.apiUrl}user/edit/${this.user.uid}`,
      data
    );
  }

  getUserInvitations(): Observable<DataApiUserInvitations> {
    return this.http
      .get<DataApiUserInvitations>(`${this.apiUrl}user/${this.user.uid}`)
      .pipe(
        tap((res) => {
          if (res.ok) {
            this.user.invitations = res.data;
          }
        })
      );
  }

  getAllusers(): Observable<DataApiAllUsers> {
    return this.http.get<DataApiAllUsers>(`${this.apiUrl}user/all`);
  }
}
