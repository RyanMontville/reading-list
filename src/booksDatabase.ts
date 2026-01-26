import { openDB, type IDBPDatabase } from 'idb';
import type { Book, Challenge } from "./models";

const DB_NAME = "MyBookDB";
const STORE_NAME = "books";
const CHALLENGES_STORE_NAME = "challenges";
const METADATA_STORE_NAME = "metadata";
const DB_VERSION = 2;
const CURRENT_DATA_VERSION = 18;

export class BookDatabase {
    /**
     * We use a promise to ensure the DB is only opened once.
     * The upgrade callback handles schema changes incrementally.
     */
    private dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade(db: IDBPDatabase, oldVersion: number, _newVersion: number | null, _transaction: any) {
            // Version 1: Initial Setup
            if (oldVersion < 1) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const bookStore = db.createObjectStore(STORE_NAME, { keyPath: "id" });
                    bookStore.createIndex("title", "bookTitle", { unique: false });
                    bookStore.createIndex("authors", "authors", { unique: false, multiEntry: true });
                    bookStore.createIndex("dateRead", "dateRead", { unique: false });
                }

                if (!db.objectStoreNames.contains(METADATA_STORE_NAME)) {
                    db.createObjectStore(METADATA_STORE_NAME, { keyPath: "key" });
                }
            }

            // Version 2: Add Challenges
            if (oldVersion < 2) {
                if (!db.objectStoreNames.contains(CHALLENGES_STORE_NAME)) {
                    const challengesStore = db.createObjectStore(CHALLENGES_STORE_NAME, {
                        keyPath: "id",
                        autoIncrement: true
                    });
                    challengesStore.createIndex("challengeName", "challengeName", { unique: false });
                    challengesStore.createIndex("startDate", "startDate", { unique: false });
                    challengesStore.createIndex("endDate", "endDate", { unique: false });
                    challengesStore.createIndex("goal", "goal", { unique: false });
                }
            }
        },
    });

    /**
     * Checks current data version and fetches updates from GitHub if necessary.
     */
    public async initializeData(): Promise<void> {
        try {
            const db = await this.dbPromise;

            // Get the current stored data version from metadata
            const meta = await db.get(METADATA_STORE_NAME, "data_version");
            const currentStoredVersion = meta?.value || 0;

            if (currentStoredVersion >= CURRENT_DATA_VERSION) {
                console.log(`Data is already up-to-date (v${currentStoredVersion}).`);
                return;
            }

            console.log(`Fetching updated data (v${CURRENT_DATA_VERSION})...`);

            // Parallel fetch for performance
            const [bookResponse, challengeResponse] = await Promise.all([
                fetch('https://raw.githubusercontent.com/RyanMontville/reading-list/refs/heads/main/data/books.json'),
                fetch('https://raw.githubusercontent.com/RyanMontville/reading-list/refs/heads/main/data/challenges.json')
            ]);

            if (!bookResponse.ok || !challengeResponse.ok) {
                throw new Error("Failed to fetch initial data from GitHub.");
            }

            const initialBookData: Book[] = await bookResponse.json();
            const initialChallengeData: Challenge[] = await challengeResponse.json();

            // Start a single transaction for all operations
            const tx = db.transaction([STORE_NAME, CHALLENGES_STORE_NAME, METADATA_STORE_NAME], "readwrite");

            const now = new Date().toLocaleString();
            await tx.objectStore(METADATA_STORE_NAME).put({ key: "data_version", value: CURRENT_DATA_VERSION });
            await tx.objectStore(METADATA_STORE_NAME).put({ key: "last_updated", value: now });

            // Import Books (converting date strings to Date objects)
            for (const book of initialBookData) {
                if (typeof book.dateRead === 'string') {
                    book.dateRead = new Date(book.dateRead);
                }
                await tx.objectStore(STORE_NAME).put(book);
            }

            // Import Challenges
            for (const challenge of initialChallengeData) {
                await tx.objectStore(CHALLENGES_STORE_NAME).put(challenge);
            }

            // Update Metadata
            await tx.objectStore(METADATA_STORE_NAME).put({ key: "data_version", value: CURRENT_DATA_VERSION });

            // Ensure transaction completes
            await tx.done;
            console.log(`Database initialized: ${initialBookData.length} books, ${initialChallengeData.length} challenges.`);

        } catch (error) {
            console.error("Failed to initialize database data:", error);
            throw error;
        }
    }

    public async getAllBooks(): Promise<Book[]> {
        const db = await this.dbPromise;
        return db.getAll(STORE_NAME);
    }

    public async getAllChallenges(): Promise<Challenge[]> {
        const db = await this.dbPromise;
        return db.getAll(CHALLENGES_STORE_NAME);
    }

    public async getBookById(id: number): Promise<Book | undefined> {
        const db = await this.dbPromise;
        return db.get(STORE_NAME, id);
    }

    public async getVersions() {
        const db = await this.dbPromise;
        const [versionMeta, updatedMeta] = await Promise.all([
            db.get(METADATA_STORE_NAME, "data_version"),
            db.get(METADATA_STORE_NAME, "last_updated")
        ]);

        return {
            appDataVersion: CURRENT_DATA_VERSION,
            storedDataVersion: versionMeta?.value || 0,
            dbVersion: DB_VERSION,
            lastUpdated: updatedMeta?.value || "Never"
        };
    }
}

export const bookDB = new BookDatabase();