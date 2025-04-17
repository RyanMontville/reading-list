import { Component, Input } from '@angular/core';
import { Book } from '../book.model';

@Component({
  selector: 'app-book',
  imports: [],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent {
  @Input() book!: Book;

  formatAuthorsForRoute(author: string) {
    return "/reading-list/author/" + author.replace(" ", "-");
  }

  formatDate(date: string) {
    let dateList = date.split("/")
    let month = dateList[0];
    switch(month) {
      case "01": return `January ${dateList[2]}`;
      case "02": return `February ${dateList[2]}`;
      case "03": return `March ${dateList[2]}`;
      case "04": return `April ${dateList[2]}`;
      case "05": return `May ${dateList[2]}`;
      case "06": return `June ${dateList[2]}`;
      case "07": return `July ${dateList[2]}`;
      case "08": return `August ${dateList[2]}`;
      case "09": return `September ${dateList[2]}`;
      case "10": return `October ${dateList[2]}`;
      case "11": return `November ${dateList[2]}`;
      case "12": return `December ${dateList[2]}`;
      default: return "Error.Couldn't load date.";

    }
  }
}
