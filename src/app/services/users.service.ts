import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { environment } from '@environments/environment';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiUrl = environment.API_URL;

  constructor(
    private http: HttpClient,
    private tokenSerice: TokenService
  ) { }

  getUsers() {
    const token = this.tokenSerice.getToken();
    // Retorna un array de usuarios
    return this.http.get<User[]>(`${this.apiUrl}/api/v1/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

}
