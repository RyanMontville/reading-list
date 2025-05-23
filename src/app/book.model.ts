export interface Book {
  title: string;
  authors: string[];
  isbn: string;
  cover: string;
  moreInfo: string;
  dateRead: string;
  tags: string[];
}

export interface BookLink {
  year: string;
  books: Book[];
}