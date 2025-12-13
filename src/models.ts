export interface Book {
    id: number;
    bookTitle: string;
    authors: string[];
    isbn: number;
    cover: string;
    moreInfo: string;
    dateRead: Date;
    tags: string[];
    mainTag: string;
}

export interface VBRecomendation {
    bookID: number;
    bookTitle: string;
    author: string;
    whoRecommended: string;
    mediaTitle?: string;
    recommendedOn?: string;
    firstRecommended?: Date;
    type: string;
    coverUrl: string;
}

export interface ItemGroupCount {
    itemKey: string;
    count: number;
    color: string;
}

export interface BookPair {
    index: string;
    bookId: number;
}

export interface Challenge {
    id: number,
    challengeName: string,
    challengeDescription: string,
    startDate: string | null,
    endDate: string | null,
    goal: number,
    books: BookPair[]
}