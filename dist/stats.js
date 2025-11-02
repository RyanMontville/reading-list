import { bookDB } from "./booksDatabase.js";
// import * as d3 from 'd3';
let booksList = [];
let booksToDisplay = [];
let years = [];
let authors = [];
let tags = [];
let mainElement = document.querySelector('main');
async function startApp() {
    try {
        await bookDB.initializeData();
        booksList = await bookDB.getAllBooks();
        booksToDisplay = booksList;
        loadTags(booksList);
        loadAuthors(booksList);
        loadYears(booksList);
        displayDefaultStats();
    }
    catch (e) {
        console.error("Critical error during application startup:", e);
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
function calculateFrequency(year) {
    let rangeToCount = [];
    if (year === 0) {
        rangeToCount = booksList;
    }
    else {
        rangeToCount = booksList.filter(book => book['dateRead'].getFullYear() === year);
    }
    const monthlyCountsObject = rangeToCount.reduce((acc, book) => {
        const options = { year: 'numeric', month: 'long' };
        const monthKey = book.dateRead.toLocaleDateString('en-US', options);
        acc[monthKey] = (acc[monthKey] || 0) + 1;
        return acc;
    }, {});
    const monthKeys = Object.keys(monthlyCountsObject);
    const result = monthKeys.map(key => ({
        monthYear: key,
        count: monthlyCountsObject[key],
    }));
    return result;
}
function countBooksForTag(tag, asPercent) {
    let tagCount = booksList.filter(book => book.tags.includes(tag)).length;
    if (asPercent) {
        return (tagCount / booksList.length) * 100;
    }
    else {
        return tagCount;
    }
}
function displayDefaultStats() {
    let cardsContainer = document.getElementById('cards-container');
    //Fiction vs nonfiction bar
    let fictionNonfictionCard = document.createElement('article');
    fictionNonfictionCard.setAttribute('class', 'card');
    let fictionNonfictionHeaderH2 = document.createElement('h2');
    let fictionNonfictionHeader = document.createTextNode(`${countBooksForTag("Fiction", false)} Fiction vs ${countBooksForTag("Nonfiction", false)} Nonfiction`);
    fictionNonfictionHeaderH2.appendChild(fictionNonfictionHeader);
    fictionNonfictionCard.appendChild(fictionNonfictionHeaderH2);
    let fictionVsBar = document.createElement('section');
    fictionVsBar.setAttribute('class', 'vs-bar');
    let fictionBarPercent = document.createElement('div');
    fictionBarPercent.setAttribute('class', 'blue');
    fictionBarPercent.style.width = `${countBooksForTag("Fiction", true)}%`;
    fictionVsBar.appendChild(fictionBarPercent);
    let nonfictionBarPercent = document.createElement('div');
    nonfictionBarPercent.setAttribute('class', 'red');
    nonfictionBarPercent.style.width = `${countBooksForTag("Nonfiction", true)}%`;
    fictionVsBar.appendChild(nonfictionBarPercent);
    fictionNonfictionCard.appendChild(fictionVsBar);
    cardsContainer.appendChild(fictionNonfictionCard);
    //Fast/Medium/Slow pace
    let slowMediumFastCard = document.createElement('article');
    slowMediumFastCard.setAttribute('class', 'card');
    let slowMediumFastH2 = document.createElement('h2');
    let slowMediumFastHeader = document.createTextNode(`${countBooksForTag('Slow-paced', false)} Slow-paced vs ${countBooksForTag('Medium-paced', false)} Medium-paced vs ${countBooksForTag('Fast-paced', false)} Fast-paced`);
    slowMediumFastH2.appendChild(slowMediumFastHeader);
    slowMediumFastCard.appendChild(slowMediumFastH2);
    cardsContainer.appendChild(slowMediumFastCard);
    let paceVsBar = document.createElement('section');
    paceVsBar.setAttribute('class', 'vs-bar');
    let slowPaced = document.createElement('div');
    slowPaced.setAttribute('class', 'red');
    slowPaced.style.width = `${countBooksForTag('Slow-paced', true)}%`;
    paceVsBar.appendChild(slowPaced);
    let mediumPaced = document.createElement('div');
    mediumPaced.setAttribute('class', 'blue');
    mediumPaced.style.width = `${countBooksForTag('Medium-paced', true)}%`;
    paceVsBar.appendChild(mediumPaced);
    let fastPaced = document.createElement('div');
    fastPaced.setAttribute('class', 'green');
    fastPaced.style.width = `${countBooksForTag('Fast-paced', true)}%`;
    paceVsBar.appendChild(fastPaced);
    slowMediumFastCard.appendChild(paceVsBar);
    //Reading frequency by month (using D3)
    let AllMonths = calculateFrequency(0);
    let frequencyCard = document.createElement('article');
    frequencyCard.setAttribute('class', 'card');
    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');
    let monthYearHeader = document.createElement('th');
    monthYearHeader.setAttribute('style', 'width: 20%;');
    let monthYear = document.createTextNode('Month Year');
    monthYearHeader.appendChild(monthYear);
    headerRow.appendChild(monthYearHeader);
    let booksReadHeader = document.createElement('th');
    let booksRead = document.createTextNode("# Book Read");
    booksReadHeader.appendChild(booksRead);
    headerRow.appendChild(booksReadHeader);
    headerRow.appendChild(booksReadHeader);
    table.appendChild(headerRow);
    let tbody = document.createElement('tbody');
    table.appendChild(tbody);
    AllMonths.forEach(monthCount => {
        let newRow = document.createElement('tr');
        let monthCell = document.createElement('td');
        let month = document.createTextNode(monthCount['monthYear']);
        monthCell.appendChild(month);
        newRow.appendChild(monthCell);
        let bookCountCell = document.createElement('td');
        let bookCount = document.createTextNode("■".repeat(monthCount['count']));
        bookCountCell.appendChild(bookCount);
        newRow.appendChild(bookCountCell);
        tbody.appendChild(newRow);
    });
    frequencyCard.appendChild(table);
    cardsContainer.appendChild(frequencyCard);
}
//-------------------------------------------------------------------//
startApp();
//comment
