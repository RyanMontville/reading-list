export interface Book {
    bookTitle: string;
    authors: string[];
    isbn: number;
    cover: string;
    moreInfo: string;
    dateRead: Date;
    tags: string[];
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

export interface BooksByMonthCount { 
    monthYear: string;
    count: number; 
}

export function fixDate(dateString: string, dateFormat: string) {
    let dateObj: Date = new Date(dateString);
    let dateTimezoneFixed: Date = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * -60000);
    if (dateFormat === 'shortDate') {
        return dateTimezoneFixed.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        });
    } else {
        return dateTimezoneFixed.toLocaleDateString('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
        });
    }
}
