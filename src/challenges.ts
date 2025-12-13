import type { Challenge } from "./models.js";

let booksList: Challenge[] = [];

async function loadData(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error Fetching ${url}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error(error);
  }
}

async function startApp() {
    await loadData('https://raw.githubusercontent.com/RyanMontville/reading-list/refs/heads/main/data/challenges.json')
    .then((data) => {
        booksList = data;
    })
    .catch((error: any) => console.error("Error loading challenges", error));
}

startApp();