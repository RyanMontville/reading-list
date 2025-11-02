import { bookDB } from "./booksDatabase.js";
const DATA_URL = 'books.json';
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
let booksList = [];
let booksToDisplay = [];
let years = [];
let authors = [];
let tags = [];
const filterButtonsSection = document.getElementById('filter-buttons');
const pageTitle = document.getElementById('page-title');
const booksContainer = document.getElementById('books-contianer');
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
        });
        //Maybe sort by title?
        filterButtonsSection.appendChild(filterByAuthorButton);
        filterButtonsSection.appendChild(filterByTagButton);
        filterButtonsSection.appendChild(filterByYearButton);
    }
}
function addMoreFiltersButton() {
    const moreFiltersButton = document.createElement('button');
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
        filterByYearButton.setAttribute('type', 'button');
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
function filterForYear(year) {
    if (filterButtonsSection) {
        filterButtonsSection.innerHTML = '';
        addResetButton();
        addMoreFiltersButton();
    }
    const yearToFilter = new Date(year, 0, 1).getFullYear();
    if (booksContainer) {
        booksContainer.innerHTML = '';
        booksToDisplay = booksList.filter(book => {
            const dateObj = new Date(book['dateRead']);
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
function filterForAuthor(author) {
    if (filterButtonsSection) {
        filterButtonsSection.innerHTML = '';
        addResetButton();
        addMoreFiltersButton();
    }
    if (booksContainer) {
        booksContainer.innerHTML = '';
        booksToDisplay = booksList.filter(book => book.authors.includes(author));
    }
    displayBooks();
    if (pageTitle) {
        const filtered = document.createTextNode(`Displaying ${booksToDisplay.length} books by ${author}`);
        pageTitle.innerHTML = '';
        pageTitle.appendChild(filtered);
    }
}
function filterForTag(tag) {
    if (filterButtonsSection) {
        filterButtonsSection.innerHTML = '';
        addResetButton();
        addMoreFiltersButton();
    }
    if (booksContainer) {
        booksContainer.innerHTML = '';
        booksToDisplay = booksList.filter(book => book.tags.includes(tag));
    }
    displayBooks();
    if (pageTitle) {
        const filtered = document.createTextNode(`Displaying ${booksToDisplay.length} books matching ${tag}`);
        pageTitle.innerHTML = '';
        pageTitle.appendChild(filtered);
    }
}
function loadAuthors(bokList) {
    bokList.forEach((book) => {
        book.authors.forEach(author => {
            if (!authors.includes(author)) {
                authors.push(author);
            }
        });
    });
    authors.sort((a, b) => {
        const lastNameA = a.split(" ").pop() ?? "";
        const lastNameB = b.split(" ").pop() ?? "";
        return lastNameA.localeCompare(lastNameB);
    });
}
function loadTags(bokList) {
    bokList.forEach((book) => {
        book.tags.forEach(tag => {
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        });
    });
    tags.sort();
}
function loadYears(bokList) {
    bokList.forEach((book) => {
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
    }
    catch (e) {
        console.error("Critical error during application startup:", e);
    }
}
function displayBooks() {
    if (booksContainer) {
        if (booksToDisplay.length === 0) {
            booksContainer.innerHTML = '';
            let p = document.createElement('p');
            let noBooks = document.createTextNode('No books found');
            p.appendChild(noBooks);
            booksContainer.appendChild(p);
        }
        else {
            booksContainer.innerHTML = '';
            booksToDisplay.forEach(book => {
                const newBook = document.createElement('article');
                //book Cover
                const coverImg = document.createElement('img');
                coverImg.setAttribute('src', book['cover']);
                newBook.appendChild(coverImg);
                const bookInfo = document.createElement('section');
                //Book Title
                const h3 = document.createElement('h3');
                const title = document.createTextNode(book['bookTitle']);
                h3.appendChild(title);
                bookInfo.appendChild(h3);
                //Authors
                const authorsh4 = document.createElement('h4');
                book['authors'].forEach(author => {
                    const authorA = document.createElement('a');
                    authorA.addEventListener('click', () => filterForAuthor(author));
                    let authorName = document.createTextNode(author);
                    authorA.appendChild(authorName);
                    authorsh4.appendChild(authorA);
                });
                bookInfo.appendChild(authorsh4);
                //Date Read
                const readP = document.createElement('p');
                const date = new Date(book['dateRead']);
                const dateRead = document.createTextNode(`Date Read: ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`);
                readP.appendChild(dateRead);
                bookInfo.appendChild(readP);
                //tags
                const tagsList = document.createElement('ul');
                book['tags'].forEach(tag => {
                    let tagLi = document.createElement('li');
                    let tagName = document.createTextNode(tag);
                    tagLi.appendChild(tagName);
                    tagsList.appendChild(tagLi);
                    bookInfo.appendChild(tagsList);
                });
                //Storygraph link
                const storyGraphLink = document.createElement('a');
                const icon = document.createElement('span');
                icon.setAttribute('class', 'material-symbols-outlined');
                const iconName = document.createTextNode('open_in_new');
                icon.appendChild(iconName);
                storyGraphLink.appendChild(icon);
                storyGraphLink.setAttribute('href', book['moreInfo']);
                storyGraphLink.setAttribute('target', '_blank');
                let linkText = document.createTextNode('View on StoryGraph');
                storyGraphLink.appendChild(linkText);
                bookInfo.appendChild(storyGraphLink);
                newBook.appendChild(bookInfo);
                booksContainer.appendChild(newBook);
            });
        }
    }
}
startApp();
