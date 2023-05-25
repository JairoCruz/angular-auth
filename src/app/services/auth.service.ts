import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment'; // este es un short y esta definido en el archivo tsconfig.json en la raiz del proyecto
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.API_URL;

  constructor(
    private http: HttpClient
  ) { }


  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/api/v1/auth/login`, {
      email,
      password
    });
  }


  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/api/v1/auth/register`, {
      name, 
      email,
      password
    });
  }

  // Este me permite registrarme y una vez registrado me logue. sin necesidad
  // de pasar por la pagina de login
  registerAndLogin(name: string, email: string, password: string) {
    return this.register(name, email, password)
                .pipe(
                  switchMap(() => this.login(email, password))
                );
  }

  isAvailable(email: string) {
    return this.http.post<{isAvailable: boolean}>(`${this.apiUrl}/api/v1/auth/is-available`, {
      email
    });
  }

}
