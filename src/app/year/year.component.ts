import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../books.service';
import { Book } from '../book.model';
import { BookComponent } from "../book/book.component";

@Component({
  selector: 'app-year',
  imports: [BookComponent],
  templateUrl: './year.component.html',
  styleUrl: './year.component.css'
})
export class YearComponent implements OnInit {
  year: number | null = null;
  books: Book[] = [];
  booksForYear: Book[] = [];

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const yearString = params.get('year');
      this.year = yearString ? parseInt(yearString, 10) : null;
      this.bookService.getBooks().subscribe((books) => {
        this.books = books;
        this.filterBooksForYear();
      });
    });
  }

  filterBooksForYear() {
    if (this.year) {
      this.booksForYear = this.books.filter((book) => this.getYear(book.dateRead) == this.year);
    } else {
      this.booksForYear = this.books;
    }
  }

  getYear(date: string) {
    let dateList: string[] = date.split("/");
    return +dateList[2];
  }
}