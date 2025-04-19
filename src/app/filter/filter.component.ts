import { Component, OnInit } from '@angular/core';
import { BookService } from '../books.service';
import { Book } from '../book.model';
import { BookComponent } from "../book/book.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-filter',
  imports: [BookComponent, RouterLink],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit {
  books: Book[] = [];
  authors: string[] = [];
  genres: string[] = [];
  selectedGenres: string[] = [];
  years: string[] = [];
  showYears: boolean = false;
  showAuthors: boolean = false;
  showGenres: boolean = false;
  filteredBooks: Book[] = [];
  filter: string | null = null;

  constructor(
    private bookService: BookService,
  ) {}
  
  ngOnInit(): void {
    this.bookService.getBooks().subscribe((books) => {
      this.books = books;
      books.forEach((book) => {
        if (!this.years.includes(this.getYear(book.dateRead))) {
          this.years.push(this.getYear(book.dateRead));
        }
        book.authors.forEach((author) => {
          if (!this.authors.includes(author)) {
            this.authors.push(author);
          }
        });
        book.tags.forEach((tag) => {
          if (!this.genres.includes(tag)) {
            this.genres.push(tag);
          }
        });
      });
      this.authors.sort();
      this.genres.sort();
    });
  }

  showFiterOptions(filter: string) {
    switch(filter) {
      case "year": {
        this.showYears = true;
        this.showGenres = false;
        this.showAuthors = false;
        this.filteredBooks = [];
        this.selectedGenres = [];
        break;
      }
      case "author": {
        this.showYears = false;
        this.showGenres = false;
        this.showAuthors = true;
        this.filteredBooks = [];
        this.selectedGenres = [];
        break;
      }
      case "genre": {
        this.showYears = false;
        this.showGenres = true;
        this.showAuthors = false;
        this.filteredBooks = [];
        this.selectedGenres = [];
        break;
      }
    }
    this.filter = null;
  }

  getYear(date: string) {
    let dateList: string[] = date.split("/");
    return dateList[2];
  }

  formatAuthorForURL(author: string) {
    return author.split(" ").join("_");
  }

  toggleGenre(genre: string) {
    if (this.selectedGenres.includes(genre)) {
      this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
    } else {
      this.selectedGenres.push(genre);
    }
  }

  filterBooks() {
    this.showGenres = false;
    this.filter = "";
    this.selectedGenres.forEach((genre) => {
      this.filter += genre + " ";
    })
    if (this.selectedGenres.length === 0) {
      this.filteredBooks = this.books; // Show all books if no genres are selected.
      return;
    }
    this.filteredBooks = this.books.filter(book => {
      return this.selectedGenres.every(selectedGenre => book.tags.includes(selectedGenre));
    });
  }
}
