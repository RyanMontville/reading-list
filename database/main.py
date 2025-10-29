import json
import sqlite3
conn = sqlite3.connect("database/books.sqlite")
cursor = conn.cursor()

# book_id, book_title, isbn, cover_url, more_info, date_read = books
# author_id, author_name = authors
# tag_id, tag_name = tags
# author_id, book_id = authors_book
# tag_id, book_id = tags_book

# def insert_books():
#     book_id = 1


#     try:
#         with open('books.json', 'r') as f:
#             # Load the JSON data from the file into a Python variable
#             data = json.load(f)

#     except FileNotFoundError:
#         print("Error: 'books.json' not found. Please ensure the file exists in the correct directory.")
#     except json.JSONDecodeError:
#         print("Error: Could not decode JSON from 'books.json'. Please check the file's format.")
#     except Exception as e:
#         print(f"An unexpected error occurred: {e}")

#     for book in data:
#         book_title = book['title']
#         book_authors = book['authors']
#         book_isbn = book['isbn']
#         book_cover = book['cover']
#         more_info = book['moreInfo']
#         date_read = book['dateRead']
#         book_tags = book['tags']
#         # book_id = get_book_id(book['title'])
#         for author in book_authors:
#             author_id = get_author_id(author)
#             sql = "INSERT INTO authors_book (author_id, book_id) VALUES (?, ?)"
#             cursor.execute(sql, (author_id, book_id))
#         for tag in book_tags:
#             tag_id = get_tag_id(tag)
#             sql = "INSERT INTO tags_book (tag_id, book_id) VALUES (?, ?)"
#             cursor.execute(sql, (tag_id, book_id))
#         print(f"inserted tags and authors for book #{book_id}: {book_title}")
#         book_id += 1

def get_tag_id(tag_name):
    cursor.execute(f"SELECT tag_id FROM tags WHERE tag_name = '{tag_name}'")
    results = cursor.fetchall()
    if len(results) == 0:
        return 0
    else:
        return results[0][0]

def get_author_id(author_name):
    cursor.execute(f"SELECT author_id FROM authors WHERE author_name = '{author_name}'")
    results = cursor.fetchall()
    if len(results) ==0:
        return 0
    else:
        return results[0][0]

def get_next_id():
    cursor.execute("SELECT book_id FROM books ORDER BY book_id DESC LIMIT 1")
    result = cursor.fetchone()
    return result[0] + 1

def get_years():
    cursor.execute("SELECT year FROM years")
    rows = cursor.fetchall()
    years = []
    for row in rows:
        years.append(row[0])
    return years

# book_id, book_title, isbn, cover_url, more_info, date_read = books
# author_id, author_name = authors
# tag_id, tag_name = tags
# author_id, book_id = authors_book
# tag_id, book_id = tags_book
def add_new_book():
    book_id = get_next_id()
    book_title = input("book Title: ")
    book_authors_string = input("Book Authors (seperate authors with /): ")
    book_authors = book_authors_string.split("/")
    book_isbn = input("Book ISBN: ").replace("-", "")
    book_cover = input("Book Cover URL: ")
    more_info = input("Storygraph URL: ")
    date_read = input("Date Read: ")
    year_read = int(date_read.split("/")[2])
    all_years = get_years()
    if year_read not in all_years:
        cursor.execute(f"INSERT INTO years (year) VALUES ({year_read})")
        conn.commit()
    book_tags_string = input("book tags (seperate with /): ")
    book_tags = book_tags_string.split("/")

    sql = 'INSERT INTO books (book_title, isbn, cover_url, more_info, date_read) VALUES (?, ?, ?, ?, ?)'
    cursor.execute(sql, (book_title, book_isbn, book_cover, more_info, date_read))

    for author in book_authors:
        author_id = get_author_id(author)
        if author_id == 0:
            cursor.execute(f"INSERT INTO authors (author_name) VALUES ('{author}')")
            author_id = get_author_id(author)
        cursor.execute("INSERT INTO authors_book (author_id, book_id) VALUES (?, ?)", (author_id, book_id))

    for tag in book_tags:
        tag_id = get_tag_id(tag)
        if tag_id == 0:
            cursor.execute(f"INSERT INTO tags (tag_name) VALUES ('{tag}')")
            tag_id = get_tag_id(tag)
        cursor.execute("INSERT INTO tags_book (tag_id, book_id) VALUES (?, ?)", (tag_id, book_id))
    conn.commit()

def get_authors_for_book_id(book_id):
    sql = f'''
    SELECT author_name 
    FROM authors_book 
    JOIN authors on authors.author_id = authors_book.author_id
    WHERE book_id = {book_id}
    '''
    cursor.execute(sql)
    rows = cursor.fetchall()
    authors = []
    for row in rows:
        authors.append(row[0])
    return authors

def get_tags_for_book_id(book_id):
    sql = f'''
    SELECT tag_name 
    FROM tags_book 
    JOIN tags ON tags.tag_id = tags_book.tag_id
    WHERE book_id = {book_id}
    '''
    cursor.execute(sql)
    rows = cursor.fetchall()
    tags = []
    for row in rows:
        tags.append(row[0])
    return tags

def generate_json_file():
    book_list = []
    cursor.execute("SELECT * FROM BOOKS ORDER BY book_id ASC")
    books = cursor.fetchall()
    json_book_id = 1

    for book_id, book_title, isbn, cover_url, more_info, date_read in books:
        authors = get_authors_for_book_id(book_id)
        tags = get_tags_for_book_id(book_id)
        new_book_object = {
            "id": json_book_id,
            "bookTitle": book_title,
            "authors": authors,
            "isbn": isbn,
            "cover": cover_url,
            "moreInfo": more_info,
            "dateRead": date_read,
            "tags": tags
        }
        book_list.append(new_book_object)
        json_book_id += 1
    with open("books.json", 'w') as f:
        json.dump(book_list, f, ensure_ascii=False, indent=4)

# add_new_book()
generate_json_file()
