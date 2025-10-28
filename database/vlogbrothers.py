import json
import random
import sqlite3
conn = sqlite3.connect("books.sqlite")
cursor = conn.cursor()

try:
    with open('vlogbrothers_list.json', 'r') as f:
        # Load the JSON data from the file into a Python variable
        data = json.load(f)

except FileNotFoundError:
    print("Error: 'books.json' not found. Please ensure the file exists in the correct directory.")
except json.JSONDecodeError:
    print("Error: Could not decode JSON from 'books.json'. Please check the file's format.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")

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

#book_id, book_title, author_id, who_recommended, media_title, recommended_on, first_recommended, tag_id, cover_url = vlogbrothers_recommendations
def insert_vlogbrother_books():
    for item in data:
        author_id = get_author_id(item['author'])
        if author_id == 0:
                cursor.execute(f"INSERT INTO authors (author_name) VALUES ('{item['author']}')")
                author_id = get_author_id(item['author'])
        tag_id = get_tag_id(item['type'])
        sql = '''
        InSERT INTO vlogbrothers_recommendations 
        (book_title, author_id, who_recommended, media_title, recommended_on, first_recommended, tag_id, cover_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        '''
        cursor.execute(sql, (item['book_title'], author_id, item['who_recommended'], item['media_title'], item['recommended_on'], item['first_recommended'], tag_id, item['cover_url']))
    conn.commit()

def get_random_book():
    book_id = random.randint(1,343)
    sql = f'''
    SELECT book_title, author_name, who_recommended, media_title, recommended_on, first_recommended, tag_name, cover_url
    FROM vlogbrothers_recommendations
    JOIN authors on authors.author_id = vlogbrothers_recommendations.author_id
    JOIN tags on tags.tag_id = vlogbrothers_recommendations.tag_id
    WHERE book_id = {book_id} AND vlogbrothers_recommendations.tag_id = 1
    '''
    cursor.execute(sql)
    random_book = cursor.fetchone()
    book_title, author_name, who_recommended, media_title, recommended_on, first_recommended, tag_name, cover_url = random_book
    print(f"{book_title} by {author_name} ({tag_name})\nRecommended by {who_recommended} on {media_title} - {recommended_on} on {first_recommended}")


get_random_book()

