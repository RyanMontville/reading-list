import type { Book } from "../models";

export function createHeader(heading: string, headerText: string) {
    const header = document.createElement(heading);
    header.textContent = headerText;
    return header;
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

export function createIcon(iconName: string) {
    const icon = document.createElement('span');
    icon.setAttribute('class', 'material-symbols-outlined');
    icon.textContent = iconName;
    return icon;
}

export function createLink(linkText: string, linkHref: string, external: boolean, iconText?: string) {
    const newLink = document.createElement('a');
    if (iconText) {
        const icon = createIcon(iconText);
        newLink.appendChild(icon);
    }
    newLink.setAttribute('href', linkHref);
    if (external) {
        newLink.setAttribute('target', '_blank');
    }
    newLink.textContent = linkText;
    return newLink;
}

export function createyearSelect(years: number[]) {
    const yearSelect = years.reduce((acc: HTMLSelectElement, year: number) => {
        const option = document.createElement('option');
        option.textContent = year.toString();
        option.setAttribute('value', year.toString());
        acc.appendChild(option);
        return acc;
    }, document.createElement('select'));
    //Select current year
    yearSelect.options[yearSelect.length - 1].selected = true;
    return yearSelect;
}

export function createBookDiv(book: Book) {
    const newBook = document.createElement('div');
    newBook.setAttribute('class', 'book');
    //book Cover
    const coverImg = document.createElement('img');
    coverImg.setAttribute('src', book['cover']);
    newBook.appendChild(coverImg);
    const bookInfo = document.createElement('section');
    //Book Title
    const titleH3 = document.createElement('h3');
    titleH3.textContent = book['bookTitle'];
    bookInfo.appendChild(titleH3);
    //Authors
    const authorsh4 = book['authors'].reduce((acc: HTMLElement, author: string) => {
        const authorA = document.createElement('a');
        authorA.addEventListener('click', () => window.location.href = `/reading-list/?author=${author}`);
        let authorName = document.createTextNode(author);
        authorA.appendChild(authorName);
        acc.appendChild(authorA);
        return acc;
    }, document.createElement('h4'));
    bookInfo.appendChild(authorsh4);
    //Date Read
    const readP: HTMLElement = document.createElement('p');
    const date: Date = new Date(book['dateRead']);
    readP.textContent = `Date Read: ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    bookInfo.appendChild(readP);
    //tags
    const tagsList = book['tags'].reduce((acc: HTMLElement, tag: string) => {
        const tagLi = document.createElement('li');
        const tagName = document.createTextNode(tag);
        tagLi.addEventListener('click', () => window.location.href = `/reading-list/?tag=${tag}`);
        tagLi.appendChild(tagName);
        acc.appendChild(tagLi);
        return acc;
    }, document.createElement('ul'));
    bookInfo.appendChild(tagsList);
    //Storygraph link
    const storyGraphLink = createLink('View on StoryGraph', book['moreInfo'], true, 'open_in_new');
    bookInfo.appendChild(storyGraphLink);
    newBook.appendChild(bookInfo);
    return newBook
}