import { Book } from "./utils";

const DATA_URL = 'books.json';
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
let booksList: Book[] = [];
let booksToDisplay: Book[] = [];
let years = [2021, 2022, 2023, 2024, 2025];
const filterButtonsSection = document.getElementById('filter-buttons');
const pageTitle: HTMLElement | null = document.getElementById('page-title');
const booksContainer: HTMLElement | null = document.getElementById('books-contianer');

function moreFilters() {
    if (filterButtonsSection) {
        filterButtonsSection.innerHTML = '';
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
        //Create filter by genre/tag
        //Maybe sort by title?
        let comingSoonP = document.createElement('p');
        let comingSoonText = document.createTextNode('More Filters coming soon');
        comingSoonP.appendChild(comingSoonText);
        filterButtonsSection.appendChild(comingSoonP);
        filterButtonsSection.appendChild(filterByYearButton);
    }
}

function addMoreFiltersButton() {
    const moreFiltersButton: HTMLElement = document.createElement('button');
    let moreText = document.createTextNode('More Filters');
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
    if (booksContainer) {
        booksContainer.innerHTML = '';
        booksToDisplay = booksList.filter(book => {
            const dateObj: Date = new Date(book['dateRead']);

            return dateObj.getFullYear() === yearToFilter;
        });
        displayBooks();
    }
    if (pageTitle) {
        const filtered = document.createTextNode(`Displaying ${booksToDisplay.length} books read in ${yearToFilter}`);
        pageTitle.innerHTML = '';
        pageTitle.appendChild(filtered);
    }
}

async function loadBooks() {
    try {
        let response = await fetch(DATA_URL);
        if (!response.ok) {
            //Create error message here
            throw new Error(`Error loading data. Status: ${response.status}`);
        }
        let data = await response.json();
        booksList = data as Book[];
        booksToDisplay = booksList;
        resetToDefault();
        displayBooks();
    } catch (error) {
        //Create error message here
        console.error("Failed to load data: ", error);
    }
}

function displayBooks() {
    if (booksContainer) {
        if (booksToDisplay.length === 0) {
            booksContainer.innerHTML = '';
            let p: HTMLElement = document.createElement('p');
            let noBooks = document.createTextNode('No books found');
            p.appendChild(noBooks);
            booksContainer.appendChild(p);
        } else {
            booksContainer.innerHTML = '';
            booksToDisplay.forEach(book => {
                const newBook: HTMLElement = document.createElement('article');
                //book Cover
                const coverImg: HTMLElement = document.createElement('img');
                coverImg.setAttribute('src', book['cover']);
                newBook.appendChild(coverImg)
                const bookInfo = document.createElement('section');
                //Book Title
                const h3: HTMLElement = document.createElement('h3');
                const title = document.createTextNode(book['book_title']);
                h3.appendChild(title);
                bookInfo.appendChild(h3);
                //Authors
                const authorsh4: HTMLElement = document.createElement('h4');
                const authors = document.createTextNode(book['authors'].join(', '));
                authorsh4.appendChild(authors);
                bookInfo.appendChild(authorsh4);
                //Date Read
                const readP: HTMLElement = document.createElement('p');
                const date: Date = new Date(book['dateRead']);
                const dateRead = document.createTextNode(`Date Read: ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`);
                readP.appendChild(dateRead)
                bookInfo.appendChild(readP);
                newBook.appendChild(bookInfo);
                //Storygraph link
                const storyGraphLink: HTMLElement = document.createElement('a');
                const icon = document.createElement('span');
                icon.setAttribute('class', 'material-symbols-outlined');
                const iconName = document.createTextNode('open_in_new');
                icon.appendChild(iconName);
                storyGraphLink.appendChild(icon);
                storyGraphLink.setAttribute('href', book['moreInfo']);
                storyGraphLink.setAttribute('target', '_blank')
                let linkText = document.createTextNode('View on StoryGraph');
                storyGraphLink.appendChild(linkText);
                bookInfo.appendChild(storyGraphLink);

                //tags
                const tagsList: HTMLElement = document.createElement('ul');
                book['tags'].forEach(tag => {
                    let tagLi: HTMLElement = document.createElement('li');
                    let tagName = document.createTextNode(tag);
                    tagLi.appendChild(tagName);
                    tagsList.appendChild(tagLi);
                    bookInfo.appendChild(tagsList);
                })

                booksContainer.appendChild(newBook);
            });
        }

    }
}

loadBooks();