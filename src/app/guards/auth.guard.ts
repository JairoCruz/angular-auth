import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { TokenService } from '@services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(
    private tokenService: TokenService,
    private router: Router
  ){  }


  canActivate(): boolean {
    const isValidToken = this.tokenService.isValidRefreshToken();
    console.log('isValideToken from AuthGuard', isValidToken);
    if (!isValidToken) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
  
}
