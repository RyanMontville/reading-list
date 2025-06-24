import { Component, OnInit } from '@angular/core';
import { Book, BookLink } from '../book.model';
import { BookService } from '../books.service';
import { BookComponent } from "../book/book.component";
import { ActivatedRoute, Router, Params } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-home',
  imports: [BookComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          stagger('100ms', animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  books: Book[] = [];
  bookCount: number = 0;
  booksToShow: Book[] = [];
  listTitle: string = "";
  tags: string[] = [];

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.bookService.getBooks().subscribe((books) => {
      this.books = books;
      this.checkForParams();
    });
  }

  checkForParams() {
    let yearParm = this.route.snapshot.queryParamMap.get('year');
    let authorParam = this.route.snapshot.queryParamMap.get('author');
    this.route.queryParamMap.subscribe(params => {
      this.tags = params.getAll('tags');
    });
    if (yearParm) {
      console.log(`Filtering for year ${yearParm}`);
      this.filterBooksByYear(yearParm);
    } else if (authorParam) {
      console.log(`Filtering books for author ${authorParam}`);
      let author = authorParam.split("_").join(" ");
      this.filterBooksByAuthor(author);
    } else if (this.tags.length > 0) {
      this.filterBooksByGenre();
    } else {
      console.log("showing all books");
      this.listTitle = ` read since January 2021`;
      this.bookCount = this.books.length;
      let index = 0;
      const intervalId = setInterval(() => {
        if (index < this.books.length) {
          this.booksToShow.push(this.books[index]);
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 100);
    }
  }

  filterBooksByAuthor(author: string) {
    this.booksToShow = [];
    this.listTitle = `for author ${author}`;
    const filteredBooks = this.books.filter(book => book.authors.includes(author));
    this.bookCount = filteredBooks.length;

    let index = 0;
    const intervalId = setInterval(() => {
      if (index < filteredBooks.length) {
        this.booksToShow.push(filteredBooks[index]);
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 100);
  }

  filterBooksByYear(year: string) {
    this.booksToShow = [];
    this.listTitle = ` read in ${year}`;
    const filteredBooks = this.books.filter(book => this.getYear(book.dateRead) === year);
    this.bookCount = filteredBooks.length;

    let index = 0;
    const intervalId = setInterval(() => {
      if (index < filteredBooks.length) {
        this.booksToShow.push(filteredBooks[index]);
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 100);
  }

  filterBooksByGenre() {
    this.booksToShow = [];
    this.listTitle = ` that have the tags: ${this.tags.join(', ')}`;
    const filteredBooks = this.books.filter(book => {
      // Check if the book has any tags and if the filter tags array is not empty.
      if (!book.tags || this.tags.length === 0) {
        return this.tags.length === 0; // If no filter tags, return all books; if book has no tags, return if no filter tags.
      }
    
      // Use the 'every' method to check if every tag in 'this.tags' is present in 'book.tags'.
      const containsAll = this.tags.every(tag => book.tags.includes(tag));
    
      return containsAll;
    });
    this.bookCount = filteredBooks.length;
    console.log(filteredBooks.length);
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < filteredBooks.length) {
        this.booksToShow.push(filteredBooks[index]);
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 100);
  }

  getYear(date: string) {
    let dateList: string[] = date.split("/");
    return dateList[2];
  }
}