import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContextToken,
  HttpContext,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { TokenService } from '@services/token.service';

const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN, true);
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
   // Sele agrega un contexto, para verificar si hay un token valido, de lo contrario sigue normalmente
   if (request.context.get(CHECK_TOKEN)) {
    return this.addToken(request, next);
   }
   return next.handle(request);
    
  }

  // Esto lo que hace es que si hay un token, se clona el headers, y se le agrega el token,
  // para evitar en que cada solicitud que se haga que se requiera de un token se le deba estar colacando en la peticion
  // el interceptor agarra las peticiones y las incluye
  private addToken(request: HttpRequest<unknown>, next: HttpHandler) {
    const accessToken = this.tokenService.getToken();
    if (accessToken) {
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
      });
      return next.handle(authRequest);
    }
    // Se devuelve el request original sin haberlo modificado,
    // en caso no haya un accessToken.
    return next.handle(request);
  }

}
