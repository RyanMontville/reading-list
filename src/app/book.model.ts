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

export interface Vlogbrothers {
  book_id: number;
  book_title: string;
  author: string;
  who_recommended: string;
  media_title: string;
  recommended_on: string;
  first_recommended: string;
  type: string;
  cover_url: string;
}