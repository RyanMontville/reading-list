import { createyearSelect } from "./utils.js";
import { bookDB } from "./booksDatabase.js";
import type { Book, ItemGroupCount } from "./models.js";
// import * as d3 from 'd3';

class BarPercentage {
    constructor (
        public color: string,
        public tag: string
    ) {}
}

interface VsBarCard {
    cardTitle: string;
    pertencages: BarPercentage[];
}

let booksList: Book[] = [];
let years: number[] = [];
let authors: string[] = [];
let tags: string[] = [];

let cardsContainer = document.getElementById('cards-container') as HTMLElement;

async function startApp() {
    try {
        await bookDB.initializeData();
        booksList = await bookDB.getAllBooks();
        loadTags(booksList);
        loadAuthors(booksList);
        loadYears(booksList);
        displayDefaultStats();
        createGenreChart();
    } catch (e) {
        console.error("Critical error during application startup:", e);
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

function calculateFrequency(year: number): ItemGroupCount[] {
    let rangeToCount: Book[] = [];
    type IntermediateCount = { [key: string]: number };
    if (year === 0) {
        rangeToCount = booksList;
    } else {
        rangeToCount = booksList.filter(book => book['dateRead'].getFullYear() === year);
    }
    const monthlyCountsObject: IntermediateCount = rangeToCount.reduce((acc: IntermediateCount, book: Book) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
        const monthKey = book.dateRead.toLocaleDateString('en-US', options);
        acc[monthKey] = (acc[monthKey] || 0) + 1;
        return acc;
    }, {});

    const monthKeys = Object.keys(monthlyCountsObject);
    const result: ItemGroupCount[] = monthKeys.map(key => ({
        itemKey: key,
        count: monthlyCountsObject[key],
    }));
    return result;
}

function createGenreChart() {
    type GenreCount = { [key: string]: number };
    const genreCountsObject: GenreCount = booksList.reduce((acc: GenreCount, book: Book) => {
        acc[book['mainTag']] = (acc[book['mainTag']] || 0) + 1;
        return acc;
    }, {});

    const genreKeys = Object.keys(genreCountsObject);
    const result: ItemGroupCount[] = genreKeys.map(key => ({
        itemKey: key,
        count: genreCountsObject[key],
    }));
    console.log(result);
    const total = result.reduce((acc: number, currentCount: ItemGroupCount) => {
        acc += currentCount['count'];
        return acc;
    }, 0);
    console.log(total);
    return result;
}

function countBooksForTag(tag: string, asPercent: boolean): number {
    let tagCount: number = booksList.filter(book => book.tags.includes(tag)).length;
    if (asPercent) {
        return (tagCount / booksList.length) * 100;
    } else {
        return tagCount;
    }
    
}

function createBarCard(cardContents: VsBarCard) {
    const newCard = document.createElement('article');
    newCard.setAttribute('class', 'card');
    const cardHeader = document.createElement('h2');
    cardHeader.textContent = cardContents['cardTitle'];
    newCard.appendChild(cardHeader);
    const vsBar = cardContents['pertencages'].reduce((acc: HTMLElement, percentage: BarPercentage) => {
        const newPercent = document.createElement('div');
        newPercent.setAttribute('class', percentage['color']);
        newPercent.style.width = `${countBooksForTag(percentage['tag'], true)}%`;
        acc.appendChild(newPercent);
        return acc;
    }, document.createElement('section'));
    vsBar.setAttribute('class', 'vs-bar');
    newCard.appendChild(vsBar);
    return newCard;
}

function displayFrequencyRead(year: number, months: ItemGroupCount[], frequencyCard: HTMLElement) {
    const oldDiv = document.getElementById('frequency-div');
    const frequencyDiv = document.createElement('div');
    frequencyDiv.setAttribute('class', 'card');
    frequencyDiv.setAttribute('id', 'frequency-div');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const monthYearHeader = document.createElement('th');
    monthYearHeader.setAttribute('style', 'width: 20%;');
    if (year === 0) {
        monthYearHeader.textContent = "Month Year";
    } else {
        monthYearHeader.textContent = "Month";
    }
    headerRow.appendChild(monthYearHeader);
    const booksReadHeader = document.createElement('th');
    const booksRead = document.createTextNode("# Book Read");
    booksReadHeader.appendChild(booksRead);
    headerRow.appendChild(booksReadHeader);
    headerRow.appendChild(booksReadHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = months.reduce((acc: HTMLElement, monthCount: ItemGroupCount) => {
        let newRow = document.createElement('tr');
        let monthCell = document.createElement('td');
        if (year === 0) {
            monthCell.textContent = monthCount['itemKey'];
        } else {
            monthCell.textContent = monthCount['itemKey'].split(" ")[0];
        }
        newRow.appendChild(monthCell);
        let bookCountCell = document.createElement('td');
        let bookCount = document.createTextNode("■".repeat(monthCount['count']));
        bookCountCell.appendChild(bookCount);
        newRow.appendChild(bookCountCell);
        acc.appendChild(newRow);
        return acc;
    }, document.createElement('tbody'));
    table.appendChild(tbody);
    frequencyDiv.appendChild(table);
    if (oldDiv) {
        frequencyCard.replaceChild(frequencyDiv, oldDiv);
    } else {
        frequencyCard.appendChild(frequencyDiv);
    }
}

function displayDefaultStats() {
    //Fiction vs nonfiction bar
    const fictionNonfictionContents: VsBarCard = {
        cardTitle: `${countBooksForTag("Fiction", false)} Fiction vs ${countBooksForTag("Nonfiction", false)} Nonfiction`,
        pertencages: [
            new BarPercentage("blue", "Fiction"),
            new BarPercentage("red", "Nonfiction")
        ]
    }
    const slowMediumFastContents: VsBarCard = {
        cardTitle: `${countBooksForTag('Slow-paced', false)} Slow-paced vs ${countBooksForTag('Medium-paced', false)} Medium-paced vs ${countBooksForTag('Fast-paced', false)} Fast-paced`,
        pertencages: [
            new BarPercentage("red", "Slow-paced"),
            new BarPercentage("blue", "Medium-paced"),
            new BarPercentage("green", "Fast-paced")
        ]
    }
    let fictionNonfictionCard = createBarCard(fictionNonfictionContents);
    cardsContainer.appendChild(fictionNonfictionCard);
    let slowMediumFastCard = createBarCard(slowMediumFastContents);
    cardsContainer.appendChild(slowMediumFastCard);
    //Reading frequency by month (using D3)
    const frequencyCard = document.createElement('article');
    frequencyCard.setAttribute('class', 'card');
    const yearsLabel = document.createElement('label');
    yearsLabel.setAttribute('for', 'year-select');
    yearsLabel.textContent = "Filter year: ";
    frequencyCard.appendChild(yearsLabel);
    const yearFilter = createyearSelect(years);
    yearFilter.setAttribute('id', 'year-select');
    yearFilter.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        const yearSelected = target.value;
        let months: ItemGroupCount[] = calculateFrequency(parseInt(yearSelected));
        displayFrequencyRead(parseInt(yearSelected), months, frequencyCard);
    });
    frequencyCard.appendChild(yearFilter);
    let AllMonths: ItemGroupCount[] = calculateFrequency(0);
    displayFrequencyRead(0, AllMonths, frequencyCard);
    cardsContainer.appendChild(frequencyCard);
}

//-------------------------------------------------------------------//
startApp();