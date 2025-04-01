import { Component, OnInit } from '@angular/core';
import { Book } from '../book.model';
import { BookService } from '../books.service';
import { BookComponent } from "../book/book.component";

@Component({
  selector: 'app-home',
  imports: [BookComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    books: Book[] = [];
    booksByYear: Book[][] = [];
    years: string[] = ["2021", "2022", "2023", "2024", "2025"];
  
    constructor(private bookService: BookService) {}
  
    ngOnInit(): void {
      this.bookService.getBooks().subscribe((books) => {
        this.books = books;
        this.sortBooksByYear();
      });
    }

    sortBooksByYear() {
      let bookArray: Book[][] = [];
      this.years.forEach((year) => {
        let newYear: Book[] = this.books.filter((book) => this.getYear(book.dateRead) == year);
        bookArray.push(newYear);
      });
      this.booksByYear = bookArray;
    }

    getYear(date: string) {
      let dateList: string[] = date.split("/");
      return dateList[2];
    }
  }
