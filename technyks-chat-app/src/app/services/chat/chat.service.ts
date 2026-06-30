import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  
  url = environment.serverUrl;
  private http = inject(HttpClient);
  async sendMessage(message: string): Promise<string> {
    try{
     const {reply} = await firstValueFrom(this.http.post<{reply: string}>(this.url + 'chat', { message }));
      return reply;
    }catch(error){
      throw error;
}
}
}