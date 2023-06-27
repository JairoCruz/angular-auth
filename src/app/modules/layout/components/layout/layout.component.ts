import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) {}


  ngOnInit(): void {
    // En este lugar es el lugar optimo para hacer la peticion 
    // del profile una sola vez, y luego este disponible por medio de la reactividad
    this.authService.getProfile()
    .subscribe();
  }
}
