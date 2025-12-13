import type { VBRecomendation } from "./models.js";

// let VBRecomendationList: VBRecomendation[] = [];
let booksToDisplay: VBRecomendation[] = [];

function setPageTitle(title: string) {
    const pageTitleH2 = document.getElementById('page-title');
    let pageTitle = document.createTextNode(title);
    pageTitleH2?.appendChild(pageTitle);
}

function displayBooks() {
    const booksContainer = document.getElementById('books-contianer') as HTMLElement;

    if (booksToDisplay.length === 0) {
        setPageTitle("No books to display");
    } else {
        setPageTitle(`Displaying ${booksToDisplay.length} books`);
        booksToDisplay.forEach(book => {
            const newBook = document.createElement('article');
            newBook.setAttribute('class', 'book card hide-overflow');
            //book Cover
            const coverImg: HTMLElement = document.createElement('img');
            coverImg.setAttribute('src', book['coverUrl']);
            newBook.appendChild(coverImg);
            const bookInfo = document.createElement('section');
            //Book Title
            const h3: HTMLElement = document.createElement('h3');
            const title = document.createTextNode(`Title: ${book['bookTitle']}`);
            h3.appendChild(title);
            bookInfo.appendChild(h3);
            //Authors
            const authorh4: HTMLElement = document.createElement('h4');
            const author = document.createTextNode(`Author: ${book['author']}`);
            authorh4.appendChild(author);
            bookInfo.appendChild(authorh4);
            //Rec by
            const recommendedByP = document.createElement('p');
            const recommendedBy = document.createTextNode(`Recommended by ${book['whoRecommended']}`);
            recommendedByP.appendChild(recommendedBy);
            bookInfo.appendChild(recommendedByP);
            //Media title and platform
            const medaiAndPlatformP = document.createElement('p');
            let medaiAndPlatformString: string = '';
            if (book['mediaTitle'] && book['recommendedOn']) {
                medaiAndPlatformString = `Source: "${book['mediaTitle']}" - ${book['recommendedOn']}`;
            } else if (book['recommendedOn']) {
                medaiAndPlatformString = ` Source: ${book['recommendedOn']}`;
            } else {
                medaiAndPlatformString = "Source: unknown";
            }
            const medaiAndPlatform = document.createTextNode(medaiAndPlatformString);
            medaiAndPlatformP.appendChild(medaiAndPlatform);
            bookInfo.appendChild(medaiAndPlatformP);
            //First recomended
            if (book['firstRecommended']) {
                const firstRecommendedP = document.createElement('p');
                const firstRecommended = document.createTextNode(`First recommended on ${book['firstRecommended']}`);
                firstRecommendedP.appendChild(firstRecommended);
                bookInfo.appendChild(firstRecommendedP);
            }
            //type
            const bookTypeP = document.createElement('p');
            const bookType = document.createTextNode(book['type']);
            bookTypeP.appendChild(bookType);
            bookInfo.appendChild(bookTypeP);
            newBook.appendChild(bookInfo);
            booksContainer.appendChild(newBook);
        });
    }
}

async function loadList() {
    try {
        let response = await fetch('https://raw.githubusercontent.com/RyanMontville/reading-list/refs/heads/main/data/vlogbrothers_list.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch vlogbrothers_list.json: ${response.status} ${response.statusText}`);
        }

        const data: VBRecomendation[] = await response.json();
        // VBRecomendationList = data;
        booksToDisplay = data;
        displayBooks();
    } catch (error) {
        console.error(error);
    }
}

loadList();