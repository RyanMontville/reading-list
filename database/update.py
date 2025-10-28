import json
import sqlite3
conn = sqlite3.connect("books.sqlite")
cursor = conn.cursor()
authors_books = [
    {"book_id": 98,
     "author_name": "Dennis E. Taylor"},
     {"book_id": 99,
      "author_name": "Benjamin Stevenson"},
      {"book_id": 100,
       "author_name": "John Scalzi"},
       {"book_id": 101,
       "author_name": "A.J. Hackwith"}
]

def get_author_id(author_name):
    cursor.execute(f"SELECT author_id FROM authors WHERE author_name = '{author_name}'")
    results = cursor.fetchall()
    if len(results) ==0:
        return 0
    else:
        return results[0][0]

for book in authors_books:
    author_id = get_author_id(book['author_name'])
    cursor.execute("UPDATE authors_book SET author_id = ? WHERE book_id = ?", (author_id, book['book_id']))

conn.commit()