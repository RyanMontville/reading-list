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
  listTitle: string = "books";
  brother: string = "";
  type: string = "";

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.bookService.getVlogbrothers().subscribe((books) => {
      this.books = books;
      this.booksToShow = books;
      this.bookCount = books.length;
    });
  }

  resetBooksList() {
    this.booksToShow = this.books;
    this.brother = '';
    this.type = '';
    this.listTitle = 'books';
    this.bookCount = this.books.length;
  }

  filterList(filterType: string, filterString: string) {
    if (filterType == 'brother') {
      this.brother = filterString;
    } else if (filterType == 'type') {
      this.type = filterString;
    }
    this.booksToShow = this.books;
    if (this.brother == '' && this.type != '') {
      this.filterType();
      this.listTitle = `${this.type} books`;
    } else if (this.brother != '' && this.type == '') {
      this.filterBrother();
      this.listTitle = `books recommended by ${this.brother}`;
    } else if (this.brother != '' && this.type != '') {
      this.filterBrother();
      this.filterType();
      this.listTitle = `${this.type} books recommended by ${this.brother}`;
    }
  }

  filterBrother() {
    const filteredBooks = this.booksToShow.filter(book => book.who_recommended == this.brother);
    this.bookCount = filteredBooks.length;
    this.booksToShow = filteredBooks;
  }

  filterType() {
    const filteredBooks = this.booksToShow.filter(book => book.type == this.type);
    this.bookCount = filteredBooks.length;
    this.booksToShow = filteredBooks;
  }

}
