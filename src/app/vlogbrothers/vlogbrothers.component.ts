import { Component, OnInit } from '@angular/core';
import { Vlogbrothers } from '../book.model';
import { BookService } from '../books.service';

@Component({
  selector: 'app-vlogbrothers',
  imports: [],
  templateUrl: './vlogbrothers.component.html',
  styleUrl: './vlogbrothers.component.css'
})
export class VlogbrothersComponent implements OnInit {
  books: Vlogbrothers[] = [];
  bookCount: number = 0;
  booksToShow: Vlogbrothers[] = [];
  listTitle: string = "";

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getVlogbrothers().subscribe((books) => {
      this.books = books;
      this.bookCount = books.length;
    }

    )
  }

}
