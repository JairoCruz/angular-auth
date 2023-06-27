import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment'; // este es un short y esta definido en el archivo tsconfig.json en la raiz del proyecto
import { switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { ResponseLogin } from '@models/auth.models';
import { User } from '@models/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.API_URL;
  // Este es un estado general para user, para que cualquier componente
  // que lo solicite pueda recuperarlo, evitando esta haciendo peticiones get por cada
  // vez que se solicite.
  user$ = new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  //No funciono como esperaba, user tabla en lugar de utilizar este
  // metodo mejor se subscribe al user$.
  // Este metodo no esta siendo utilizado solo lo dejo por referencia
  getDataUser() {
    return this.user$.getValue();
  }

  // Login nos devuelve el access_token
  // Tipo la respuesta devuelta por el server
  login(email: string, password: string) {
    return this.http.post<ResponseLogin>(`${this.apiUrl}/api/v1/auth/login`, {
      email,
      password
    })
    .pipe(
      tap(response => {
        this.tokenService.saveToken(response.access_token);
      })
    );
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


  recovery(email: string) {
    return this.http.post(`${this.apiUrl}/api/v1/auth/recovery`, {email});
  }

  changePassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/api/v1/auth/change-password`, { token, newPassword });
  }


  getProfile() {
    const token = this.tokenService.getToken();
    return this.http.get<User>(`${this.apiUrl}/api/v1/auth/profile`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      // Con esto al recuperar el profile, se almacena en el user$
      tap(user => {
        this.user$.next(user);
      })
    );
  }

  logout () {
    this.tokenService.removeToken();
  }

}
