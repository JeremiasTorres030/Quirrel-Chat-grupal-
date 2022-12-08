import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessagesServices {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendMessage(message: any, gid: string): Observable<any> {
    return this.http.post(`${this.apiUrl}message/new/${gid}`, message);
  }
}
