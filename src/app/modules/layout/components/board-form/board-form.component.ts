import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Colors } from '@models/colors.model';

import { BoardService } from '@services/board.service';

@Component({
  selector: 'app-board-form',
  templateUrl: './board-form.component.html'
})
export class BoardFormComponent {

  form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required]],
    //backgroundColor: ['', [Validators.required]]
    // Con esto se tipa el tipo de valor que recibira el control de color
    // en el cual no puede ser nulo y si no se elige por default se le asigna uno
    backgroundColor: new FormControl<Colors>('sky', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  constructor(
    private formBuilder: FormBuilder,
    private boardService: BoardService,
    private router: Router
  ) {}




  doSave() {
    if (this.form.valid) {
      const { title, backgroundColor } = this.form.getRawValue();
      //console.log(title, backgroundColor);
      this.boardService.createBoard(title, backgroundColor)
      .subscribe(board => {
        //console.log(board);
        this.router.navigate(['/app/boards', board.id]);
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

}
