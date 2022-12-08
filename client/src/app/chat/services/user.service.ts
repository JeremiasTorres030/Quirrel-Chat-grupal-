import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _socket = io('http://localhost:3000/');
  private apiUrl: string = environment.apiUrl;
  public user!: {
    id: string;
    email: string;
    username: string;
    groups: Array<string>;
    invitations: Array<string>;
    image: string;
  };

  get socket() {
    return this._socket;
  }

  constructor(private http: HttpClient) {}

  signUp(user: {
    username: string;
    email: string;
    password: string;
    image: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}user/new`, user).pipe(
      tap((res: any) => {
        if (res.ok) {
          localStorage.setItem('token', res.data.token);

          this.user = {
            email: res.data.email,
            id: res.data.id,
            username: res.data.username,
            groups: res.data.groups,
            invitations: res.data.invitations,
            image: res.data.image,
          };
        }
      })
    );
  }

  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}user/login`, user).pipe(
      tap((res: any) => {
        if (res.ok) {
          localStorage.setItem('token', res.data.token);

          this.user = {
            email: res.data.email,
            id: res.data.id,
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

    return this.http.get(`${this.apiUrl}user/token/validate`, { headers }).pipe(
      tap((res: any) => {
        if (res.ok) {
          localStorage.setItem('token', res.data.token);
          this.user = {
            email: res.data.email,
            id: res.data.id,
            username: res.data.username,
            groups: res.data.groups,
            invitations: res.data.invitations,
            image: res.data.image,
          };
          this.socket.emit('userID', res.data.id);
        }
      }),
      map((res: any) => res.ok),
      catchError(() => of(false))
    );
  }

  editUser(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}user/edit/${this.user.id}`, data);
  }

  getAllusers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}user/all`);
  }
}
