import { createyearSelect, createHeader } from "./modules/utils.js";
import { bookDB } from "./booksDatabase.js";
import type { Book, ItemGroupCount } from "./models.js";
import * as d3 from 'd3';
import { createPieChart, createLineGraph } from "./modules/d3Graphics.js";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

const genreColorScale = d3.scaleOrdinal<string>()
    .range(d3.schemeCategory10);

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
        const fictionNonfictionCounts: ItemGroupCount[] = [
            {
                itemKey: "Fiction",
                count: countBooksForTag("Fiction", false),
                color: "#3944bc"
            },
            {
                itemKey: "Nonfiction",
                count: countBooksForTag("Nonfiction", false),
                color: "#ff0000"
            }
        ];
        createPieChartCard('fiction', fictionNonfictionCounts, "Fiction vs Nonfiction");
        const genresCount = groupGenres();
        createPieChartCard('genres', genresCount, "Genres");
        const paceCounts: ItemGroupCount[] = [
            {
                itemKey: "Slow-paced",
                count: countBooksForTag('Slow-paced', false),
                color: "#ff0000"
            },
            {
                itemKey: "Medium-paced",
                count: countBooksForTag('Medium-paced', false),
                color: "#3944bc"
            },
            {
                itemKey: "Fast-paced",
                count: countBooksForTag('Fast-paced', false),
                color: "#008000"
            }
        ];
        createPieChartCard('pace', paceCounts, "Slow-paced vs Medium-paced vs Fast-paced");
        createFrequencyCard();
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
        color: genreColorScale(key)
    }));
    return result;
}

function groupGenres() {
    type GenreCount = { [key: string]: number };
    const genreCountsObject: GenreCount = booksList.reduce((acc: GenreCount, book: Book) => {
        acc[book['mainTag']] = (acc[book['mainTag']] || 0) + 1;
        return acc;
    }, {});

    const genreKeys = Object.keys(genreCountsObject);
    const result: ItemGroupCount[] = genreKeys.map(key => ({
        itemKey: key,
        count: genreCountsObject[key],
        color: genreColorScale(key)
    }));
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

function createPieChartCard(dataName: string, data: ItemGroupCount[], cardTitle: string) {
    const newCard = document.createElement('div');
    newCard.setAttribute('class', 'card');
    newCard.setAttribute('id', `${dataName}-card`);
    const cardHeader = createHeader('h2', cardTitle);
    newCard.appendChild(cardHeader);
    const cardContent = document.createElement('section');
    cardContent.setAttribute('class', 'pie-content');
    const pieChart = document.createElement('section');
    pieChart.setAttribute('id', `${dataName}-pie-chart`);
    pieChart.setAttribute('class', 'pie-chart');
    cardContent.appendChild(pieChart);
    const legend = data.reduce((acc: HTMLElement, currItem: ItemGroupCount) => {
        const itemKeySpan = document.createElement('span');
        const colorDot = document.createElement('span');
        colorDot.style.backgroundColor = currItem['color'];
        colorDot.setAttribute('class', 'key-dot');
        itemKeySpan.appendChild(colorDot);
        const genreKeyText = document.createTextNode(`${currItem['itemKey']}: ${currItem['count']} books`);
        itemKeySpan.appendChild(genreKeyText);
        acc.appendChild(itemKeySpan);
        return acc;
    }, document.createElement('div'));
    legend.setAttribute('class', 'legend');
    cardContent.appendChild(legend);
    newCard.appendChild(cardContent);
    cardsContainer.appendChild(newCard);
    createPieChart(`${dataName}-pie-chart`, data);
}

function createFrequencyCard() {
    //Reading frequency by month (using D3)
    const frequencyCard = document.createElement('article');
    frequencyCard.setAttribute('class', 'card');
    const cardHeader = createHeader("h2", "Book Read Per Month");
    frequencyCard.appendChild(cardHeader);
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
        const lineGraphDiv = document.getElementById('line-graph');
        if (lineGraphDiv) {
            lineGraphDiv.innerHTML = '';
            createLineGraph('line-graph', months);
        }
    });
    frequencyCard.appendChild(yearFilter);
    let currentYearMonths: ItemGroupCount[] = calculateFrequency(currentYear);
    const lineGraph = document.createElement('div');
    lineGraph.setAttribute('id', 'line-graph');
    frequencyCard.appendChild(lineGraph);
    cardsContainer.appendChild(frequencyCard);
    createLineGraph('line-graph', currentYearMonths);
}

//-------------------------------------------------------------------//
startApp();