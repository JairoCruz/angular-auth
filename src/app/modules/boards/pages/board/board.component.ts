import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Dialog } from '@angular/cdk/dialog';
import { TodoDialogComponent } from '@boards/components/todo-dialog/todo-dialog.component';

import { ToDo, Column } from '@models/todo.model';
import { BoardService } from '@services/board.service';
import { Board } from '@models/board.model';
import { Card } from '@models/card.model';
import { CardsService } from '@services/cards.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styles: [
    `
      .cdk-drop-list-dragging .cdk-drag {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      .cdk-drag-animating {
        transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class BoardComponent implements OnInit {

  board: Board | null = null;

 /* 
 // Esto era para ejemplo codigo quemado, se comenta para agregar
 // el servicio en la recuperacion de los boards
 columns: Column[] = [
    {
      title: 'ToDo',
      todos: [
        {
          id: '1',
          title: 'Make dishes',
        },
        {
          id: '2',
          title: 'Buy a unicorn',
        },
      ],
    },
    {
      title: 'Doing',
      todos: [
        {
          id: '3',
          title: 'Watch Angular Path in Platzi',
        },
      ],
    },
    {
      title: 'Done',
      todos: [
        {
          id: '4',
          title: 'Play video games',
        },
      ],
    },
  ]; */

  todos: ToDo[] = [];
  doing: ToDo[] = [];
  done: ToDo[] = [];

  constructor(
    private dialog: Dialog,
    private route: ActivatedRoute,
    private boardService: BoardService,
    private cardService: CardsService
    ) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      // Este parametro viene de boards-routing.module.ts
      const id = params.get('id');
      if (id) {
        this.getBoard(id);
      }
    });
  }

  drop(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const position = this.boardService.getPosition(event.container.data, event.currentIndex);
    //console.log(rta);
    const card = event.container.data[event.currentIndex];
    this.updateCard(card, position);
  }

  addColumn() {
    // Se comenta ya que el uso de este metodo no se necesita mas.
   /*  this.columns.push({
      title: 'New Column',
      todos: [],
    }); */
  }

  openDialog(card: Card) {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      minWidth: '300px',
      maxWidth: '50%',
      data: {
        card: card,
      },
    });
    dialogRef.closed.subscribe((output) => {
      console.log(output);
    });
  }

  private getBoard(id: string) {
    this.boardService.getBoard(id)
      .subscribe(board => {

        this.board = board;
        console.log("datos", this.board);
      });
  }

  private updateCard(card: Card, position: number) {
    this.cardService.update(card.id, { position })
      .subscribe(cardUpdate => {
        console.log(cardUpdate);
      });
  }


}
