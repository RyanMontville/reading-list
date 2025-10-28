const DATA_URL = 'books.json';
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
let booksList = [];
let booksToDisplay = [];
const filterButtonsSection = document.getElementById('filter-buttons');
const moreFiltersSection = document.getElementById('more-filters-section');
const pageTitle = document.getElementById('page-title');
const booksContainer = document.getElementById('books-contianer');
function moreFilters() {
    if (moreFiltersSection) {
        moreFiltersSection.style.display = 'block';
        moreFiltersSection.innerHTML = '';
        const filterByYearButton = document.createElement('button');
    }
}
function addMoreFiltersButton() {
    const moreFiltersButton = document.createElement('button');
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
    //addMoreFiltersButton();
    if (pageTitle) {
        pageTitle.innerHTML = '';
        const allBooks = document.createTextNode(`Displaying ${booksList.length} books`);
        pageTitle.appendChild(allBooks);
    }
}
function filterForYear(year) {
    if (filterButtonsSection) {
        filterButtonsSection.innerHTML = '';
        const resetButton = document.createElement('button');
        resetButton.setAttribute('type', 'button');
        const resetText = document.createTextNode('Display All Books');
        resetButton.appendChild(resetText);
        resetButton.addEventListener('click', () => {
            booksToDisplay = booksList;
            resetToDefault();
            displayBooks();
        });
        filterButtonsSection.appendChild(resetButton);
        //addMoreFiltersButton();
    }
    if (booksContainer) {
        booksContainer.innerHTML = '';
        booksToDisplay = booksList.filter(book => {
            const dateObj = new Date(book['dateRead']);
            return dateObj.getFullYear() === currentYear;
        });
        displayBooks();
    }
    if (pageTitle) {
        const filtered = document.createTextNode(`Displaying ${booksToDisplay.length} books read in ${currentYear}`);
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
        booksList = data;
        booksToDisplay = booksList;
        resetToDefault();
        displayBooks();
    }
    catch (error) {
        //Create error message here
        console.error("Failed to load data: ", error);
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
                const title = document.createTextNode(book['book_title']);
                h3.appendChild(title);
                bookInfo.appendChild(h3);
                //Authors
                const authorsh4 = document.createElement('h4');
                const authors = document.createTextNode(book['authors'].join(', '));
                authorsh4.appendChild(authors);
                bookInfo.appendChild(authorsh4);
                //Date Read
                const readP = document.createElement('p');
                const date = new Date(book['dateRead']);
                const dateRead = document.createTextNode(`Date Read: ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`);
                readP.appendChild(dateRead);
                bookInfo.appendChild(readP);
                newBook.appendChild(bookInfo);
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
                //tags
                const tagsList = document.createElement('ul');
                book['tags'].forEach(tag => {
                    let tagLi = document.createElement('li');
                    let tagName = document.createTextNode(tag);
                    tagLi.appendChild(tagName);
                    tagsList.appendChild(tagLi);
                    bookInfo.appendChild(tagsList);
                });
                booksContainer.appendChild(newBook);
            });
        }
    }
}
loadBooks();
export {};
