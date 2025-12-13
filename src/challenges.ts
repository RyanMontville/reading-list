import type { Book, BookPair, Challenge } from "./models.js";
import { createHeader, createBookDiv } from "./modules/utils.js";
import { bookDB } from "./booksDatabase.js";

let challenges: Challenge[] = [];

const mainElem = document.querySelector('main') as HTMLElement;

async function displayChallenges() {
  const challengesContainer = document.createElement('div');
  const challengeCardPromises = challenges.map(async (currentChallenge: Challenge) => {
    const challengeCard = document.createElement('article');
    challengeCard.setAttribute('class', 'card with-padding');
    const cardHeader = document.createElement('section');
    cardHeader.setAttribute('class', 'card-header');
    const cardHeaderInfo = document.createElement('div');
    const headerH2 = createHeader("h2", currentChallenge['challengeName']);
    cardHeaderInfo.appendChild(headerH2);
    if (currentChallenge['startDate']) {
      const timeframe = createHeader("h3", `${currentChallenge['startDate']} - ${currentChallenge['endDate']}`);
      cardHeaderInfo.appendChild(timeframe);
    }
    const goal = createHeader("h3", `Completed ${currentChallenge['books'].length} out of ${currentChallenge['goal']} books`);
    cardHeaderInfo.appendChild(goal);
    const description = currentChallenge['challengeDescription'].replace(/(\\r\\n|\\n|\\r|[\r\n])/g, '<br>');
    const descriptionP = document.createElement('p');
    descriptionP.innerHTML = description;
    cardHeaderInfo.appendChild(descriptionP);
    cardHeader.appendChild(cardHeaderInfo);
    const toggleBooks = document.createElement('button');
    toggleBooks.setAttribute('type', 'button');
    toggleBooks.setAttribute('class', 'material-symbols-outlined');
    toggleBooks.textContent = 'expand_all';
    cardHeader.appendChild(toggleBooks);
    challengeCard.appendChild(cardHeader);
    const bookPairs: BookPair[] = currentChallenge['books'];
    const sectionElement = document.createElement('section');
    const bookDivPromises = bookPairs.map(async (bookPair: BookPair) => {
      const currentBook: Book | undefined = await bookDB.getBookById(bookPair['bookId']);
      if (currentBook) {
        const bookDiv = document.createElement('div');
        bookDiv.setAttribute('class', 'challenge-book')
        const challengeIndex = createHeader("h2", bookPair['index']);
        bookDiv.appendChild(challengeIndex);
        const bookArticle = createBookDiv(currentBook);
        bookDiv.appendChild(bookArticle);
        return bookDiv;
      }
      return null;
    });
    const bookDivs = await Promise.all(bookDivPromises);
    bookDivs
      .filter(div => div !== null)
      .forEach(div => {
        sectionElement.appendChild(div as HTMLElement);
      });
    const booksForChallenge = sectionElement;
    booksForChallenge.setAttribute('class', 'hide challenge-books');
    challengeCard.appendChild(booksForChallenge);
    toggleBooks.addEventListener('click', () => {
      booksForChallenge.classList.toggle('hide')
      if (toggleBooks.textContent === 'expand_all') {
        toggleBooks.textContent = 'collapse_all';
      } else {
        toggleBooks.textContent = 'expand_all';
      }
    });
    return challengeCard;
  });
  const allChallengeCards = await Promise.all(challengeCardPromises);
  allChallengeCards.forEach(card => {
    challengesContainer.appendChild(card);
  });
  mainElem.appendChild(challengesContainer);
}

async function startApp() {
  await bookDB.initializeData();
  challenges = await bookDB.getAllChallenges();
  await displayChallenges();
}

startApp();