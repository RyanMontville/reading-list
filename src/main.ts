import { Book } from "./utils.js";
import { bookDB } from "./booksDatabase.js";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
let booksList: Book[] = [];
let booksToDisplay: Book[] = [];
let years: number[] = [];
let authors: string[] = [];
let tags: string[] = [];
const filterButtonsSection = document.getElementById('filter-buttons');
const pageTitle: HTMLElement | null = document.getElementById('page-title');
const main = document.querySelector('main') as HTMLElement;

function moreFilters() {
    if (filterButtonsSection) {
        filterButtonsSection.innerHTML = '';
        //Filter by year
        const filterByYearButton = document.createElement('button');
        const filterByYear = document.createTextNode('Filter by Year');
        filterByYearButton.appendChild(filterByYear);
        filterByYearButton.setAttribute('type', 'button');
        filterByYearButton.addEventListener('click', () => {
            filterButtonsSection.innerHTML = '';
            years.forEach(year => {
                let yearButton = document.createElement('button');
                yearButton.setAttribute('type', 'button');
                let yearText = document.createTextNode(`${year}`);
                yearButton.appendChild(yearText);
                yearButton.addEventListener('click', () => filterForYear(year));
                filterButtonsSection.appendChild(yearButton);
            });
        });
        //Create filter by author
        const filterByAuthorButton = document.createElement('button');
        const filterByAuthor = document.createTextNode('Filter by Author');
        filterByAuthorButton.appendChild(filterByAuthor);
        filterByAuthorButton.setAttribute('type', 'button');
        filterByAuthorButton.addEventListener('click', () => {
            filterButtonsSection.innerHTML = '';
            authors.forEach(author => {
                let authorButton = document.createElement('button');
                authorButton.setAttribute('type', 'button');
                let authorText = document.createTextNode(author);
                authorButton.appendChild(authorText);
                authorButton.addEventListener('click', () => filterForAuthor(author));
                filterButtonsSection.appendChild(authorButton);
            });

        });
        //Create filter by genre/tag
        const filterByTagButton = document.createElement('button');
        const filterByTag = document.createTextNode('Filter by Tag');
        filterByTagButton.appendChild(filterByTag);
        filterByTagButton.setAttribute('type', 'button');
        filterByTagButton.addEventListener('click', () => {
            filterButtonsSection.innerHTML = '';
            tags.forEach(tag => {
                let tagButton = document.createElement('button');
                tagButton.setAttribute('type', 'button');
                let tagText = document.createTextNode(tag);
                tagButton.appendChild(tagText);
                tagButton.addEventListener('click', () => filterForTag(tag));
                filterButtonsSection.appendChild(tagButton);
            });
        })
        //Maybe sort by title?
        filterButtonsSection.appendChild(filterByAuthorButton);
        filterButtonsSection.appendChild(filterByTagButton);
        filterButtonsSection.appendChild(filterByYearButton);
    }
}

function addMoreFiltersButton() {
    const moreFiltersButton: HTMLElement = document.createElement('button');
    const filterIcon = document.createElement('span');
    filterIcon.setAttribute('class', 'material-symbols-outlined');
    const filterIconName = document.createTextNode('filter_list');
    filterIcon.appendChild(filterIconName);
    moreFiltersButton.appendChild(filterIcon);
    let moreText = document.createTextNode(' Filters');
    moreFiltersButton.appendChild(moreText);
    moreFiltersButton.setAttribute('id', 'more-filters');
    moreFiltersButton.setAttribute('type', 'button');
    moreFiltersButton.addEventListener('click', () => {
        moreFilters();
    });
    if (filterButtonsSection) {
        filterButtonsSection.appendChild(moreFiltersButton);
    }

}

function addResetButton() {
    const resetButton = document.createElement('button');
    resetButton.setAttribute('type', 'button');
    const resetText = document.createTextNode('Display All Books');
    resetButton.appendChild(resetText);
    resetButton.addEventListener('click', () => {
        booksToDisplay = booksList;
        resetToDefault();
        displayBooks();
    });
    if (filterButtonsSection) {
        filterButtonsSection.appendChild(resetButton);
    }
}

function resetToDefault() {
    if (filterButtonsSection) {
        filterButtonsSection.innerHTML = '';
        const filterByYearButton = document.createElement('button');
        filterByYearButton.setAttribute('type', 'button')
        const filterByYear = document.createTextNode(`Filter for ${currentYear} books`);
        filterByYearButton.addEventListener('click', () => {
            filterForYear(currentYear);
        });
        filterByYearButton.appendChild(filterByYear);
        filterButtonsSection.appendChild(filterByYearButton);
    }
    addMoreFiltersButton();
    if (pageTitle) {
        pageTitle.innerHTML = '';
        const allBooks = document.createTextNode(`Displaying ${booksList.length} books`);
        pageTitle.appendChild(allBooks);
    }
}

function filterForYear(year: number) {
    if (filterButtonsSection) {
        filterButtonsSection.innerHTML = '';
        addResetButton();
        addMoreFiltersButton();
    }
    const yearToFilter = new Date(year, 0, 1).getFullYear();
    booksToDisplay = booksList.filter(book => {
        const dateObj: Date = new Date(book['dateRead']);
        return dateObj.getFullYear() === yearToFilter;
    });
    displayBooks();
    if (pageTitle) {
        const filtered = document.createTextNode(`Displaying ${booksToDisplay.length} books read in ${yearToFilter}`);
        pageTitle.innerHTML = '';
        pageTitle.appendChild(filtered);
    }
}

function filterForAuthor(author: string) {
    if (filterButtonsSection) {
        filterButtonsSection.innerHTML = '';
        addResetButton();
        addMoreFiltersButton();
    }
    booksToDisplay = booksList.filter(book => book.authors.includes(author));
    displayBooks();
    if (pageTitle) {
        const filtered = document.createTextNode(`Displaying ${booksToDisplay.length} books by ${author}`);
        pageTitle.innerHTML = '';
        pageTitle.appendChild(filtered);
    }
}

function filterForTag(tag: string) {
    if (filterButtonsSection) {
        filterButtonsSection.innerHTML = '';
        addResetButton();
        addMoreFiltersButton();
    }
    booksToDisplay = booksList.filter(book => book.tags.includes(tag));
    displayBooks();
    if (pageTitle) {
        const filtered = document.createTextNode(`Displaying ${booksToDisplay.length} books matching ${tag}`);
        pageTitle.innerHTML = '';
        pageTitle.appendChild(filtered);
    }
}

function loadAuthors(bokList: Book[]) {
    bokList.forEach((book: Book) => {
        book.authors.forEach(author => {
            if (!authors.includes(author)) {
                authors.push(author);
            }
        })
    });
    authors.sort((a, b) => {
        const lastNameA = a.split(" ").pop() ?? "";
        const lastNameB = b.split(" ").pop() ?? "";
        return lastNameA.localeCompare(lastNameB);
    })
}

function loadTags(bokList: Book[]) {
    bokList.forEach((book: Book) => {
        book.tags.forEach(tag => {
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        });
    });
    tags.sort();
}

function loadYears(bokList: Book[]) {
    bokList.forEach((book: Book) => {
        let year = new Date(book['dateRead']).getFullYear();
        if (!years.includes(year)) {
            years.push(year);
        }
    });
    years.sort();
}

async function startApp() {
    try {
        await bookDB.initializeData();
        booksList = await bookDB.getAllBooks();
        booksToDisplay = booksList;
        loadTags(booksList);
        loadAuthors(booksList);
        loadYears(booksList);
        resetToDefault();
        displayBooks();
        console.log("Application loaded with books:", booksList);

    } catch (e) {
        console.error("Critical error during application startup:", e);
    }
}


function displayBooks() {
    let booksContainer: HTMLElement | null = document.getElementById('books-contianer');
    if (booksContainer) booksContainer.remove();

    if (booksToDisplay.length === 0) {
        let booksContainer = document.createElement('div');
        let p: HTMLElement = document.createElement('p');
        let noBooks = document.createTextNode('No books found');
        p.appendChild(noBooks);
        booksContainer.appendChild(p);
    } else {
        // booksContainer.innerHTML = '';
        booksContainer = booksToDisplay.reduce((acc: HTMLElement, currentBook: Book) => {
            const newBook: HTMLElement = document.createElement('article');
            //book Cover
            const coverImg: HTMLElement = document.createElement('img');
            coverImg.setAttribute('src', currentBook['cover']);
            newBook.appendChild(coverImg);
            const bookInfo = document.createElement('section');
            //Book Title
            const h3: HTMLElement = document.createElement('h3');
            const title = document.createTextNode(currentBook['bookTitle']);
            h3.appendChild(title);
            bookInfo.appendChild(h3);
            //Authors
            const authorsh4: HTMLElement = document.createElement('h4');
            currentBook['authors'].forEach(author => {
                const authorA = document.createElement('a');

                authorA.addEventListener('click', () => filterForAuthor(author));
                let authorName = document.createTextNode(author);
                authorA.appendChild(authorName);
                authorsh4.appendChild(authorA);
            });
            bookInfo.appendChild(authorsh4);
            //Date Read
            const readP: HTMLElement = document.createElement('p');
            const date: Date = new Date(currentBook['dateRead']);
            const dateRead = document.createTextNode(`Date Read: ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`);
            readP.appendChild(dateRead)
            bookInfo.appendChild(readP);
            //tags
            const tagsList: HTMLElement = document.createElement('ul');
            currentBook['tags'].forEach(tag => {
                let tagLi: HTMLElement = document.createElement('li');
                let tagName = document.createTextNode(tag);
                tagLi.addEventListener('click', () => filterForTag(tag))
                tagLi.appendChild(tagName);
                tagsList.appendChild(tagLi);
            });
            bookInfo.appendChild(tagsList);
            //Storygraph link
            const storyGraphLink: HTMLElement = document.createElement('a');
            const icon = document.createElement('span');
            icon.setAttribute('class', 'material-symbols-outlined');
            const iconName = document.createTextNode('open_in_new');
            icon.appendChild(iconName);
            storyGraphLink.appendChild(icon);
            storyGraphLink.setAttribute('href', currentBook['moreInfo']);
            storyGraphLink.setAttribute('target', '_blank')
            let linkText = document.createTextNode('View on StoryGraph');
            storyGraphLink.appendChild(linkText);
            bookInfo.appendChild(storyGraphLink);
            newBook.appendChild(bookInfo);
            acc.appendChild(newBook);
            return acc;
        }, document.createElement('div'));
        booksContainer.setAttribute('id', 'books-contianer');
        main.appendChild(booksContainer);
    }
}

startApp();