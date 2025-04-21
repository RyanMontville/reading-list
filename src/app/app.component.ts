import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "./menu/menu.component";
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('cardAnimation', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      state('out', style({ opacity: 0, transform: 'translateX(100%)' })),
      transition('void => in', [ // Animate in from the left
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('300ms ease-in')
      ]),
      transition('in => out', [
        animate('300ms ease-out')
      ]),
      transition('void => *', animate('0ms')),
    ]),
  ],
})
export class AppComponent {
  title = 'reading-list';
  showMenu: boolean = false;
}
