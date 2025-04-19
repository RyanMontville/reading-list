import { Component, OnInit } from '@angular/core';
import { Book } from '../book.model';
import { BookService } from '../books.service';

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit {
  books: Book[] = [];
  tags: Map<string, number> = new Map<string, number>();
  fiction: number = 0
  nonfiction: number = 0;
  slowPaced: number = 0;
  mediumPaced: number = 0;
  fastPaced: number = 0;
  largestTag: number = 0;
  NumberBooksRead: number = 0;

  constructor(
    private bookService: BookService,
  ) { }
  ngOnInit(): void {
    this.bookService.getBooks().subscribe((books) => {
      this.books = books;
      this.NumberBooksRead = books.length;
      this.generateStats(books);
    });
  }

  getTagList(books: Book[]) {
    let tagsTemp = new Map<string, number>();
    books.forEach((book) => {
      if (!book.tags.includes('Slow-paced') && !book.tags.includes('Medium-paced') && !book.tags.includes('Fast-paced')) {
        console.log(book.title);
      }
      book.tags.forEach((tag) => {
        if (tagsTemp.has(tag)) {
          const count = tagsTemp.get(tag); // count will be number | undefined
          if (count !== undefined) {
            tagsTemp.set(tag, count + 1);
          }
        } else {
          tagsTemp.set(tag, 1);
        }
      });
    });
    let fiction = tagsTemp.get('Fiction');
    if (fiction !== undefined) {
      this.fiction = fiction;
      tagsTemp.delete('Fiction');
    }
    let nonFiction = tagsTemp.get('Nonfiction');
    if (nonFiction) {
      this.nonfiction = nonFiction;
      tagsTemp.delete('Nonfiction');
    }
    let slow = tagsTemp.get('Slow-paced');
    if (slow) {
      this.slowPaced = slow;
      tagsTemp.delete('Slow-paced');
    }
    let medium = tagsTemp.get('Medium-paced');
    if (medium) {
      this.mediumPaced = medium;
      tagsTemp.delete('Medium-paced');
    }
    let fast = tagsTemp.get('Fast-paced');
    if (fast) {
      this.fastPaced = fast;
      tagsTemp.delete('Fast-paced');
    }
    const mapEntries = Array.from(tagsTemp.entries());
    mapEntries.sort(([, valueA], [, valueB]) => {
      if (valueB > valueA) {
        return 1;
      } else if (valueB < valueA) {
        return -1;
      } else {
        return 0;
      }
    });
    const sortedMap = new Map<string, number>(mapEntries);
    this.tags = sortedMap;
    let iterator = sortedMap.entries();
    let largest = iterator.next();
    if (!largest.done) {
      this.largestTag = largest.value[1];
    }
  }

  generateStats(books: Book[]) {
    this.getTagList(books);
  }

  getPercentage(count: number): number {
    return (count / this.largestTag) * 100;
  }
  getSpecialPercentage(stat: string): number {
    switch(stat){
      case 'fiction': return (this.fiction / this.NumberBooksRead) * 100;
      case 'nonfiction': return (this.nonfiction / this.NumberBooksRead) * 100;
      case 'slow': return (this.slowPaced / this.NumberBooksRead) * 100;
      case 'medium': return (this.mediumPaced / this.NumberBooksRead) * 100;
      case 'fast': return (this.fastPaced / this.NumberBooksRead) * 100;
      default: return 0;
    }
  }

  getBarWidth(count: number): number {
    return (this.getPercentage(count) / 100) * 500;
  }
}
