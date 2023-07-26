import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { checkToken } from '@interceptors/token.interceptor';
import { Board } from '@models/board.model';
import { Card } from '@models/card.model';
import { Colors } from '@models/colors.model';
import { List } from '@models/list.model';
import { BehaviorSubject, } from 'rxjs';
import { tap } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  apiUrl = environment.API_URL;
  bufferSpace = 65535;
  // Establecemos una variable global para poder establecer
  // el background para el navbar.
  backgroundColor$ = new BehaviorSubject<Colors>('sky');

  constructor(
    private http: HttpClient,
  ) { }

  createBoard(title: string, backgroundColor: Colors) {
    return this.http.post<Board>(`${this.apiUrl}/api/v1/boards`, {
      title,
      backgroundColor
    }, {
      context: checkToken(),
    })
  }

  getBoard(id: Board['id']) {
    return this.http.get<Board>(`${this.apiUrl}/api/v1/boards/${id}`, { 
      context: checkToken(),
    })
    // .pipe(
    //   tap(board => this.setBackgroundColor(board.backgroundColor))
    // );
  }

  getPosition(cards: Card[], currentIndex: number) {
    //console.log(cards, currentIndex);
    if (cards.length === 1) {
      return this.bufferSpace;
    }
    if (cards.length > 1 && currentIndex ===0) {
      // se coloca 1 por que necesita el primer elemento que estaba arriban
      // antes del desplazamiento, asi que si se hace el desplazamiento y se coloca el de abajo arriba, el que estaba arriba pasa a ser el 1
      const onTopPosition = cards[1].position;
      return onTopPosition / 2;
    }
    const lastIndex = cards.length - 1;
    if (cards.length > 2 && currentIndex > 0 && currentIndex < lastIndex) {
      
      const prevPosition = cards[currentIndex - 1].position;
      const nextPosition = cards[currentIndex + 1].position;
      
      return (prevPosition + nextPosition) / 2;
    }

    if (cards.length > 1 && currentIndex === lastIndex) {
      const onBottomPosition = cards[lastIndex -1].position;
      return onBottomPosition + this.bufferSpace;
    }


    return 0;
  }

  getPositionNewItem(elements: Card[] | List[]) {
    if (elements.length === 0) {
      return this.bufferSpace;
    }
    const lastIndex = elements.length - 1;
    const onBottomPosition = elements[lastIndex].position;
    return onBottomPosition + this.bufferSpace;
  }

  setBackgroundColor(color: Colors) {
    this.backgroundColor$.next(color);
  }

}
