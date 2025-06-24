import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, Vlogbrothers } from './book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private booksUrl = 'https://raw.githubusercontent.com/RyanMontville/reading-list/refs/heads/main/books.json';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.booksUrl);
  }

  getVlogbrothers(): Observable<Vlogbrothers[]> {
    return this.http.get<Vlogbrothers[]>("https://raw.githubusercontent.com/RyanMontville/reading-list/refs/heads/main/vlogbrothers_list.json");
  }
}