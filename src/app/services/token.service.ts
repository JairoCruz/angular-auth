import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
import jwt_decode, { JwtPayload } from "jwt-decode";


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


  // Esta funcion me permite validar que el token aun no ha expirado, para eso se descarga una libreria para decodificar
  // el token y leer la expedicion, luego nos dirigimos authguard o los guardianes para agregar la validacion del token
  // y por ultimo se le agrega a las diferentes rutas de la app el guardian para que 
  // validen el token y una vez expire se le saque de la session. y lo devuelva al login.
  isValidToken() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const decodeToken = jwt_decode<JwtPayload>(token);
    if (decodeToken && decodeToken?.exp) {

      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeToken.exp);
      const today = new Date();
      return tokenDate.getTime() > today.getTime();

    }
    return false;
  }

}
