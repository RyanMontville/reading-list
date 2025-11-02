import sqlite3

def create_database_and_tables(db_name):
    conn = None  # Initialize connection to None
    try:
        conn = sqlite3.connect(db_name)
        cursor = conn.cursor()

        print(f"Successfully connected to database: {db_name}")

        # book_id, book_title, isbn, cover_url, more_info, date_read = books
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS books (
            book_id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_title TEXT NOT NULL,
            isbn INTEGER NOT NULL,
            cover_url TEXT NOT NULL,
            more_info TEXT NOT NULL,
            date_read TEXT NOT NULL
        );
        """
        cursor.execute(create_table_sql)
        conn.commit()
        print("Table 'books' created or already exists successfully.")

        # author_id, author_name = authors
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS authors (
            author_id INTEGER PRIMARY KEY AUTOINCREMENT,
            author_name TEXT NOT NULL
        );
        """
        cursor.execute(create_table_sql)
        conn.commit()
        print("Table 'authors' created or already exists successfully.")

        # tag_id, tag_name = tags
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS tags (
            tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
            tag_name TEXT NOT NULL
        );
        """
        cursor.execute(create_table_sql)
        conn.commit()
        print("Table 'tags' created or already exists successfully.")

        # author_id, book_id = authors_book
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS authors_book (
            author_id INTEGER NOT NULL,
            book_id INTEGER NOT NULL,
            FOREIGN KEY (author_id) REFERENCES authors (author_id),
            FOREIGN KEY (book_id) REFERENCES books (book_id)
        );
        """
        cursor.execute(create_table_sql)
        conn.commit()
        print("Table 'authors_book' created or already exists successfully.")

        # tag_id, book_id = tags_book
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS tags_book (
            tag_id INTEGER NOT NULL,
            book_id INTEGER NOT NULL,
            FOREIGN KEY (tag_id) REFERENCES tags (tag_id),
            FOREIGN KEY (book_id) REFERENCES books (book_id)
        );
        """
        cursor.execute(create_table_sql)
        conn.commit()
        print("Table 'tags_book' created or already exists successfully.")

        # book_id, book_title, author_id, who_recommended, media_title, recommended_on, first_recommended, tag_id, cover_url = vlogbrothers_recommendations
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS vlogbrothers_recommendations (
            book_id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_title TEXT NOT NULL,
            author_id INTEGER NOT NULL,
            who_recommended TEXT NOT NULL,
            media_title TEXT,
            recommended_on TEXT,
            first_recommended TEXT,
            tag_id INTEGER NOT NULL,
            cover_url TEXT NOT NULL,
            FOREIGN KEY (author_id) REFERENCES authors (author_id),
            FOREIGN KEY (tag_id) REFERENCES tags (tag_id)
        );
        """
        cursor.execute(create_table_sql)
        conn.commit()
        print("Table 'vlogbrothers_recommendations' created or already exists successfully.")

        create_table_sql = """
        CREATE TABLE IF NOT EXISTS years (
            book_iyear_id INTEGER PRIMARY KEY AUTOINCREMENT,
            year INTEGER NOT NULL
        );
        """
        cursor.execute(create_table_sql)
        conn.commit()
        print("Table 'years' created or already exists successfully.")
        
#-----------------------------------------------------------------------------------------
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
    finally:
        # Ensure the connection is closed even if an error occurs.
        if conn:
            conn.close()
            print("Database connection closed.")



if __name__ == "__main__":
    create_database_and_tables("database/books.sqlite")