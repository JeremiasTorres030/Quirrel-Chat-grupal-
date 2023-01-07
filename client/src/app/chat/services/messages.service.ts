import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataApiResponse, GroupMessages } from 'src/types';

@Injectable({
  providedIn: 'root',
})
export class MessagesServices {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendMessage(
    message: GroupMessages,
    gid: string
  ): Observable<DataApiResponse> {
    return this.http.post<DataApiResponse>(
      `${this.apiUrl}message/new/${gid}`,
      message
    );
  }
}
