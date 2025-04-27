import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "./menu/menu.component";
import { trigger, state, style, transition, animate, useAnimation } from '@angular/animations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('menuAnimation', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      state('out', style({ opacity: 0, transform: 'translateX(100%)' })),
      transition('void => in', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-in')
      ]),
      transition('in => out', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(100%)' }))
      ]),
      transition('void => *', animate('0ms')),
    ]),
  ],
})
export class AppComponent {
  title = 'reading-list';
  isMenuOpen: boolean = false;
  menuState: string = 'out';

  toggleMenu() {
    if (this.isMenuOpen) {
      this.menuState = 'out';
      setTimeout(() => {
        this.isMenuOpen = false;
      }, 300);
    } else {
      this.isMenuOpen = true;
      this.menuState = 'in';
    }
  }
}
