import { Component, } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBell,
  faInfoCircle,
  faClose,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import { Colors, NAVBAR_BACKGROUNDS } from '@models/colors.model';

import { AuthService } from '@services/auth.service';
import { BoardService } from '@services/board.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  faBell = faBell;
  faInfoCircle = faInfoCircle;
  faClose = faClose;
  faAngleDown = faAngleDown;

  isOpenOverlayAvatar = false;
  isOpenOverlayBoards = false;
  isOpenOverlayCreateBoard = false;


  user$ = this.authService.user$;
  navBarBackgroundColor: Colors = 'sky';
  navBarColors = NAVBAR_BACKGROUNDS;

  constructor(
    private authService: AuthService,
    private router: Router,
    private boardService: BoardService,
  ) {
    // Aca nos subcribimos para recibir el color
    // y utilizarlo para cambiar el background del navbar
    this.boardService.backgroundColor$.subscribe(color => {
      this.navBarBackgroundColor = color;
    });
  }


  logout() {
    // Una vez se limpie la session se le redigira a login
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  close(event: boolean) {
    this.isOpenOverlayCreateBoard = event;
  }

  get colors() {
    const classes = this.navBarColors[this.navBarBackgroundColor];
    return classes ? classes : {};
  }

}
