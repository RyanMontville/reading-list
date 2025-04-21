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
    trigger('slideMenu', [
      state('open', style({
        transform: 'translateX(0)',
        visibility: 'visible'
      })),
      state('closed', style({
        transform: 'translateX(100%)',
        visibility: 'hidden'
      })),
      transition('closed => open', [
        style({ transform: 'translateX(100%)', visibility: 'visible' }), // Initial style before animation
        animate('300ms ease-in')
      ]),
      transition('open => closed', [
        animate('300ms ease-out', style({ transform: 'translateX(100%)', visibility: 'hidden' }))
      ])
    ])
  ]
})
export class AppComponent {
  title = 'reading-list';
  isOpen: boolean = false;
}
