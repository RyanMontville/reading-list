import { Component, OnInit } from '@angular/core';
import { Book, BookLink } from '../book.model';
import { BookService } from '../books.service';
import { BookComponent } from "../book/book.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [BookComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    books: Book[] = [];
    booksByYear: BookLink[] = [];
    years: string[] = ["2021", "2022", "2023", "2024", "2025"];
    year: number = 0;
    showAll: boolean = true;
    showYear: boolean = false;
    showFiltered: boolean = false;
    filteredTitle: string = "";
    booksForYear: Book[] = [];
    filteredBooks: Book[] = [];
  
    constructor(
      private bookService: BookService,
      private route: ActivatedRoute,
      private router: Router
    ) {}
  
    ngOnInit(): void {
      this.bookService.getBooks().subscribe((books) => {
        this.books = books;
        this.sortBooksByYear();
        this.checkForParams();
      });
    }

    sortBooksByYear() {
      let bookArray: BookLink[] = [];
      this.years.forEach((year) => {
        let booksForYear: Book[] = this.books.filter((book) => this.getYear(book.dateRead) == year);
        let newLink: BookLink = {year: year, books: booksForYear};
        bookArray.push(newLink);
      });
      this.booksByYear = bookArray;
    }

    checkForParams() {
      let yearParm = this.route.snapshot.queryParamMap.get('year');
      if (yearParm) {
        this.year = this.years.indexOf(yearParm);
        this.showYear = true;
        this.showAll = false;
      } else {
        console.log("did not find year");
      }
      let authorParam = this.route.snapshot.queryParamMap.get('author');
      if (authorParam) {
        let author = authorParam.split("_").join(" ");
        this.filterBooksByAuthor(author);
      } else {
        console.log("did not find author");
      }
    }

    filterBooksByAuthor(author: string) {
      this.filteredBooks = [];
      let authorBooks: Book[] = [];
      this.books.forEach((book) => {
        if (book.authors.includes(author)) {
          authorBooks.push(book);
        }
      });
      this.filteredBooks = authorBooks;
      this.showAll = false;
      this.showFiltered = true;
      this.filteredTitle = `${author} [${this.filteredBooks.length} books]`;
    }

    getYear(date: string) {
      let dateList: string[] = date.split("/");
      return dateList[2];
    }
  }