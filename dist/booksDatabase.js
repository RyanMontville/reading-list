const DB_NAME = "MyBookDB";
const STORE_NAME = "books";
const METADATA_STORE_NAME = "metadata";
const DB_VERSION = 1;
const CURRENT_DATA_VERSION = 5;
export class BookDatabase {
    constructor() {
        this.db = null;
    }
    async open() {
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
                const db = event.target.result;
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
                console.log(`IndexedDB schema update complete.`);
            };
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
        });
    }
    async _getMetadata(key) {
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
    async _setMetadata(key, value) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([METADATA_STORE_NAME], "readwrite");
            const store = transaction.objectStore(METADATA_STORE_NAME);
            const request = store.put({ key: key, value: value });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
    async initializeData() {
        try {
            const currentStoredVersion = await this._getMetadata("data_version") || 0;
            if (currentStoredVersion >= CURRENT_DATA_VERSION) {
                console.log(`Data is already up-to-date (v${currentStoredVersion}). Skipping import.`);
                return;
            }
            console.log(`Data version is outdated (v${currentStoredVersion}). Fetching books from books.json (v${CURRENT_DATA_VERSION})...`);
            const response = await fetch('./books.json');
            if (!response.ok) {
                throw new Error(`Failed to fetch books.json: ${response.status} ${response.statusText}`);
            }
            const initialBookData = await response.json();
            initialBookData.forEach(book => {
                if (typeof book.dateRead === 'string') {
                    book.dateRead = new Date(book.dateRead);
                }
            });
            const db = await this.open();
            const transaction = db.transaction([STORE_NAME, METADATA_STORE_NAME], "readwrite");
            const bookStore = transaction.objectStore(STORE_NAME);
            const metadataStore = transaction.objectStore(METADATA_STORE_NAME);
            initialBookData.forEach(book => {
                bookStore.put(book).onerror = (event) => {
                    console.error(`Error processing book ${book.isbn}:`, event.target.error);
                };
            });
            metadataStore.put({ key: "data_version", value: CURRENT_DATA_VERSION });
            return new Promise((resolve, reject) => {
                transaction.oncomplete = () => {
                    console.log(`Successfully merged ${initialBookData.length} books and updated data version to ${CURRENT_DATA_VERSION}.`);
                    resolve();
                };
                transaction.onerror = (event) => {
                    console.error("Transaction failed during bulk import:", event.target.error);
                    reject(event.target.error);
                };
            });
        }
        catch (error) {
            console.error("Failed to initialize database data:", error);
            throw error;
        }
    }
    async getAllBooks() {
        const db = await this.open();
        const books = [];
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.openCursor();
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    books.push(cursor.value);
                    cursor.continue();
                }
                else {
                    resolve(books);
                }
            };
            request.onerror = () => {
                console.error("Error retrieving all books:", request.error);
                reject(request.error);
            };
        });
    }
}
export const bookDB = new BookDatabase();
