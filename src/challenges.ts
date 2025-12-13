import type { Book, Challenge } from "./models.js";
import { loadData, createHeader } from "./utils.js";

let challenges: Challenge[] = [];

const mainElem = document.querySelector('main') as HTMLElement;



function displayChallenges() {
  const challengesContainer = challenges.reduce((acc: HTMLElement, currentChallenge: Challenge) => {
    const challengeCard = document.createElement('article');
    challengeCard.setAttribute('class', 'card');
    const cardHeader = createHeader("h2", currentChallenge['challengeName']);
    challengeCard.appendChild(cardHeader);
    if (currentChallenge['startDate']) {
      const timeframe = createHeader("h3", `${currentChallenge['startDate']} - ${currentChallenge['endDate']}`);
      challengeCard.appendChild(timeframe)
    }
    const goal = createHeader("h3", `Goal: ${currentChallenge['goal']} books`);
    challengeCard.appendChild(goal);
    const description = currentChallenge['challengeDescription'].replace(/(\\r\\n|\\n|\\r|[\r\n])/g, '<br>');
    const descriptionP = document.createElement('p');
    descriptionP.innerHTML = description;
    challengeCard.appendChild(descriptionP);
    const booksForChallenge = currentChallenge['books'].reduce((acc: HTMLElement, book: Book) => {
      const newBook = document.createElement('div');
      const bookTitle = createHeader("h3", book['bookTitle']);
      newBook.appendChild(bookTitle);
      acc.appendChild(newBook);
      return acc;
    }, document.createElement('section'));
    booksForChallenge.setAttribute('class', 'hide');
    challengeCard.appendChild(booksForChallenge);
    challengeCard.addEventListener('click', () => booksForChallenge.classList.toggle('hide'));
    acc.appendChild(challengeCard);
    return acc;
  }, document.createElement('div'));
  mainElem.appendChild(challengesContainer);
}

async function startApp() {
  await loadData('https://raw.githubusercontent.com/RyanMontville/reading-list/refs/heads/main/data/challenges.json')
    .then((data) => {
      challenges = data;
    })
    .catch((error: any) => console.error("Error loading challenges", error));
  displayChallenges();
}

startApp();