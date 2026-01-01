import type { Book, Challenge } from "./models";

const DB_NAME = "MyBookDB";
const STORE_NAME = "books";
const CHALLENGES_STORE_NAME = "challenges";
const METADATA_STORE_NAME = "metadata";
const DB_VERSION = 2;
const CURRENT_DATA_VERSION = 16;

export class BookDatabase {
    private db: IDBDatabase | null = null;

    public async open(): Promise<IDBDatabase> {
        if (this.db) {
            return this.db;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error("Error opening IndexedDB:", request.error);
                reject(request.error);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const oldVersion = event.oldVersion;

                //Schema for Version 1 (books and metadata stores)
                if (oldVersion < 1) {
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        const bookStore = db.createObjectStore(STORE_NAME, { keyPath: "id" });
                        bookStore.createIndex("title", "bookTitle", { unique: false });
                        bookStore.createIndex("authors", "authors", { unique: false, multiEntry: true });
                        bookStore.createIndex("dateRead", "dateRead", { unique: false });
                        console.log(`Object store '${STORE_NAME}' created with indexes.`);
                    }

                    if (!db.objectStoreNames.contains(METADATA_STORE_NAME)) {
                        db.createObjectStore(METADATA_STORE_NAME, { keyPath: "key" });
                        console.log(`Metadata store created.`);
                    }
                }

                //Schema for Version 2 (challenges store)
                if (oldVersion < 2) { // The upgrade path from v1 to v2
                    if (!db.objectStoreNames.contains(CHALLENGES_STORE_NAME)) {
                        const challengesStore = db.createObjectStore(CHALLENGES_STORE_NAME, {
                            keyPath: "id",
                            autoIncrement: true
                        });
                        challengesStore.createIndex("challengeName", "challengeName", { unique: false });
                        challengesStore.createIndex("startDate", "startDate", { unique: false });
                        challengesStore.createIndex("endDate", "endDate", { unique: false });
                        challengesStore.createIndex("goal", "goal", { unique: false });
                        console.log(`New object store '${CHALLENGES_STORE_NAME}' created.`);
                    }
                }
                console.log(`IndexedDB schema update complete. Old version: ${oldVersion}, New version: ${DB_VERSION}`);
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
        });
    }

    private async _getMetadata<T>(key: string): Promise<T | undefined> {
        const db = await this.open();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([METADATA_STORE_NAME], "readonly");
            const store = transaction.objectStore(METADATA_STORE_NAME);

            const request = store.get(key);

            request.onsuccess = () => {
                resolve(request.result ? request.result.value : undefined);
            };
            request.onerror = () => reject(request.error);
        });
    }

    public async initializeData(): Promise<void> {
        try {
            const currentStoredVersion = await this._getMetadata<number>("data_version") || 0;

            if (currentStoredVersion >= CURRENT_DATA_VERSION) {
                console.log(`Data is already up-to-date (v${currentStoredVersion}). Skipping import.`);
                return;
            }

            console.log(`Data version is outdated (v${currentStoredVersion}). Fetching data (v${CURRENT_DATA_VERSION})...`);
            //Fetch Book Data ---
            const bookResponse = await fetch('https://raw.githubusercontent.com/RyanMontville/reading-list/refs/heads/main/data/books.json');
            if (!bookResponse.ok) {
                throw new Error(`Failed to fetch books.json: ${bookResponse.status} ${bookResponse.statusText}`);
            }
            const initialBookData: Book[] = await bookResponse.json();
            initialBookData.forEach(book => {
                if (typeof book.dateRead === 'string') {
                    book.dateRead = new Date(book.dateRead);
                }
            });
            //Fetch Challenge Data ---
            const challengeResponse = await fetch('https://raw.githubusercontent.com/RyanMontville/reading-list/refs/heads/main/data/challenges.json');
            if (!challengeResponse.ok) {
                throw new Error(`Failed to fetch challenges.json: ${challengeResponse.status} ${challengeResponse.statusText}`);
            }
            const initialChallengeData: Challenge[] = await challengeResponse.json();
            const db = await this.open();
            //Start a single transaction for both stores
            const transaction = db.transaction([STORE_NAME, CHALLENGES_STORE_NAME, METADATA_STORE_NAME], "readwrite");
            const bookStore = transaction.objectStore(STORE_NAME);
            const challengeStore = transaction.objectStore(CHALLENGES_STORE_NAME);
            const metadataStore = transaction.objectStore(METADATA_STORE_NAME);
            //Import Books
            let booksProcessed = 0;
            initialBookData.forEach(book => {
                const request = bookStore.put(book);
                request.onsuccess = () => { booksProcessed++; };
                request.onerror = (event) => {
                    console.error(`Error processing book ${book.id}:`, (event.target as IDBRequest).error);
                };
            });
            //Import Challenges
            let challengesProcessed = 0;
            initialChallengeData.forEach(challenge => {
                const request = challengeStore.put(challenge);
                request.onsuccess = () => { challengesProcessed++; };
                request.onerror = (event) => {
                    console.error(`Error processing challenge ${challenge.id}:`, (event.target as IDBRequest).error);
                };
            });
            //Update Metadata version
            metadataStore.put({ key: "data_version", value: CURRENT_DATA_VERSION });
            //Wait for the transaction to complete
            return new Promise((resolve, reject) => {
                transaction.oncomplete = () => {
                    console.log(`Successfully merged ${booksProcessed} books and ${challengesProcessed} challenges.`);
                    console.log(`Updated data version to ${CURRENT_DATA_VERSION}.`);
                    resolve();
                };
                transaction.onerror = (event) => {
                    console.error("Transaction failed during bulk import:", (event.target as IDBTransaction).error);
                    reject((event.target as IDBTransaction).error);
                };
            });
        } catch (error) {
            console.error("Failed to initialize database data:", error);
            throw error;
        }
    }

    public async getAllBooks(): Promise<Book[]> {
        const db = await this.open();
        const books: Book[] = [];

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.openCursor();

            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
                if (cursor) {
                    books.push(cursor.value as Book);
                    cursor.continue();
                } else {
                    resolve(books);
                }
            };

            request.onerror = () => {
                console.error("Error retrieving all books:", request.error);
                reject(request.error);
            };
        });
    }

    public async getAllChallenges(): Promise<Challenge[]> {
        const db = await this.open();
        const challenges: Challenge[] = [];

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([CHALLENGES_STORE_NAME], "readonly");
            const store = transaction.objectStore(CHALLENGES_STORE_NAME);
            const request = store.openCursor();

            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
                if (cursor) {
                    challenges.push(cursor.value as Challenge);
                    cursor.continue();
                } else {
                    resolve(challenges);
                }
            };

            request.onerror = () => {
                console.error("Error retrieving all challenges:", request.error);
                reject(request.error);
            };
        });
    }

    public async getBookById(id: number): Promise<Book | undefined> {
        const db = await this.open();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id); 

            request.onsuccess = () => {
                resolve(request.result as Book | undefined);
            };

            request.onerror = () => {
                console.error(`Error retrieving book with ID ${id}:`, request.error);
                reject(request.error);
            };
        });
    }
}


export const bookDB = new BookDatabase();