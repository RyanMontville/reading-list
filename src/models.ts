export interface Book {
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