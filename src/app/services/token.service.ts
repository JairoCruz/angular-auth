import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  // Notar que jwt tiene su propio tiempo de expiracion, aca en saveCookie, se le
  // establece la expiracion propiamente a la cookie.
  saveToken(token: string) {
    setCookie('token-trello', token, { expires: 365, path: '/'});
  }

  getToken() {
    const token = getCookie('token-trello');
    return token;
  }

  removeToken() {
    removeCookie('token-trello');
  }

}
