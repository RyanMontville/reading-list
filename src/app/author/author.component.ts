import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../books.service';
import { Book } from '../book.model';
import { BookComponent } from "../book/book.component";

@Component({
  selector: 'app-author',
  imports: [BookComponent],
  templateUrl: './author.component.html',
  styleUrl: './author.component.css'
})
export class AuthorComponent implements OnInit {
  author: string = "";
  books: Book[] = [];
  bookCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let authorString = params.get('author');
      if (authorString) {
        this.author = authorString.replace("-", " ");
      } else {
        this.author = "";
      }
      this.loadBooks();
    });
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe((books) => {
      this.books = books;
      books.forEach((book) => {
        if (book.authors.includes(this.author)) {
          this.bookCount += 1;
        }
      })
    });
  }
}
