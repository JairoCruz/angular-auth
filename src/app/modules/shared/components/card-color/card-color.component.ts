import { Component, Input } from '@angular/core';
import { COLORS, Colors } from '@models/colors.model';

@Component({
  selector: 'app-card-color',
  templateUrl: './card-color.component.html'
})
export class CardColorComponent {
 
  // En base a color que ya tiene tailwind
  @Input() color: Colors = 'sky';
 
  mapColors = COLORS

  constructor() {

  }

 

  get colors() {
    const classes = this.mapColors[this.color];
    return classes ? classes : {};
  }

}
