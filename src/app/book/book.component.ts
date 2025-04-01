import { Component, Input } from '@angular/core';
import { Book } from '../book.model';

@Component({
  selector: 'app-book',
  imports: [],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent {
  @Input() book!: Book;

  formatAuthorsForRoute(author: string) {
    return "/author/" + author.replace(" ", "-");
  }
}
