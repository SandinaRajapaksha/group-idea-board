# Simple Social Media Site (Flask + SQLite)
# This single-file demo shows a minimal social network similar in concept to Facebook.
# Features: user registration, login, posts, likes, comments, profile pages, and feed.
# NOTE: Educational example only.

from flask import Flask, request, redirect, session, render_template_string, g
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = "secret_key_change_me"

DATABASE = "social.db"

# -----------------------------
# Database Utilities
# -----------------------------

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(error):
    db = g.pop('db', None)
    if db is not None:
        db.close()

# -----------------------------
# Database Setup
# -----------------------------

def init_db():
    db = sqlite3.connect(DATABASE)
    c = db.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        bio TEXT
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        content TEXT,
        created_at TEXT
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        user_id INTEGER,
        content TEXT,
        created_at TEXT
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        user_id INTEGER
    )''')

    db.commit()
    db.close()

# -----------------------------
# Helper Functions
# -----------------------------

def current_user():
    if 'user_id' in session:
        db = get_db()
        user = db.execute("SELECT * FROM users WHERE id=?", (session['user_id'],)).fetchone()
        return user
    return None


def require_login():
    if 'user_id' not in session:
        return redirect('/login')

# -----------------------------
# Templates
# -----------------------------

layout = """
<!DOCTYPE html>
<html>
<head>
<title>Mini Social</title>
<style>
body{font-family:Arial;margin:40px;background:#f2f2f2}
.card{background:white;padding:15px;margin-bottom:15px;border-radius:8px}
a{margin-right:10px}
textarea{width:100%;height:60px}
</style>
</head>
<body>
<h2>Mini Social Media</h2>
{% if user %}
<p>Logged in as <b>{{user['username']}}</b></p>
<a href="/">Home</a>
<a href="/profile/{{user['id']}}">Profile</a>
<a href="/logout">Logout</a>
{% else %}
<a href="/login">Login</a>
<a href="/register">Register</a>
{% endif %}
<hr>
{{content}}
</body>
</html>
"""

# -----------------------------
# Home Feed
# -----------------------------

@app.route('/')
def home():
    user = current_user()

    db = get_db()

    posts = db.execute('''
        SELECT posts.*, users.username,
        (SELECT COUNT(*) FROM likes WHERE post_id=posts.id) as like_count
        FROM posts
        JOIN users ON posts.user_id = users.id
        ORDER BY posts.created_at DESC
    ''').fetchall()

    html = """

    {% if user %}

    <div class='card'>
    <form method='post' action='/post'>
    <textarea name='content' placeholder='What is on your mind?'></textarea>
    <br>
    <button>Create Post</button>
    </form>
    </div>

    {% endif %}

    {% for p in posts %}

    <div class='card'>
    <b>{{p['username']}}</b>
    <p>{{p['content']}}</p>
    <small>{{p['created_at']}}</small>

    <p>Likes: {{p['like_count']}}</p>

    {% if user %}
    <a href='/like/{{p['id']}}'>Like</a>
    {% endif %}

    <a href='/post/{{p['id']}}'>Comments</a>

    </div>

    {% endfor %}

    """

    return render_template_string(layout, content=render_template_string(html, posts=posts, user=user), user=user)

# -----------------------------
# Register
# -----------------------------

@app.route('/register', methods=['GET','POST'])
def register():

    if request.method == 'POST':

        username = request.form['username']
        password = request.form['password']

        db = get_db()

        try:
            db.execute("INSERT INTO users(username,password,bio) VALUES(?,?,?)",
                       (username,password,""))
            db.commit()
            return redirect('/login')
        except:
            return "Username already exists"

    html = """

    <div class='card'>

    <h3>Register</h3>

    <form method='post'>

    <input name='username' placeholder='username'><br><br>

    <input name='password' type='password' placeholder='password'><br><br>

    <button>Register</button>

    </form>

    </div>

    """

    return render_template_string(layout, content=html, user=None)

# -----------------------------
# Login
# -----------------------------

@app.route('/login', methods=['GET','POST'])
def login():

    if request.method == 'POST':

        username = request.form['username']
        password = request.form['password']

        db = get_db()

        user = db.execute("SELECT * FROM users WHERE username=? AND password=?",
                          (username,password)).fetchone()

        if user:

            session['user_id'] = user['id']

            return redirect('/')

        else:

            return "Invalid login"

    html = """

    <div class='card'>

    <h3>Login</h3>

    <form method='post'>

    <input name='username'><br><br>

    <input name='password' type='password'><br><br>

    <button>Login</button>

    </form>

    </div>

    """

    return render_template_string(layout, content=html, user=None)

# -----------------------------
# Logout
# -----------------------------

@app.route('/logout')
def logout():

    session.clear()

    return redirect('/')

# -----------------------------
# Create Post
# -----------------------------

@app.route('/post', methods=['POST'])
def create_post():

    if 'user_id' not in session:
        return redirect('/login')

    content = request.form['content']

    db = get_db()

    db.execute("INSERT INTO posts(user_id,content,created_at) VALUES(?,?,?)",
               (session['user_id'],content,str(datetime.now())))

    db.commit()

    return redirect('/')

# -----------------------------
# Like Post
# -----------------------------

@app.route('/like/<int:post_id>')
def like(post_id):

    if 'user_id' not in session:
        return redirect('/login')

    db = get_db()

    existing = db.execute("SELECT * FROM likes WHERE post_id=? AND user_id=?",
                          (post_id,session['user_id'])).fetchone()

    if not existing:

        db.execute("INSERT INTO likes(post_id,user_id) VALUES(?,?)",
                   (post_id,session['user_id']))

        db.commit()

    return redirect('/')

# -----------------------------
# View Post + Comments
# -----------------------------

@app.route('/post/<int:post_id>', methods=['GET','POST'])
def view_post(post_id):

    db = get_db()

    if request.method == 'POST':

        if 'user_id' not in session:
            return redirect('/login')

        content = request.form['content']

        db.execute("INSERT INTO comments(post_id,user_id,content,created_at) VALUES(?,?,?,?)",
                   (post_id,session['user_id'],content,str(datetime.now())))

        db.commit()

    post = db.execute("""
    SELECT posts.*, users.username
    FROM posts
    JOIN users ON users.id = posts.user_id
    WHERE posts.id=?
    """,(post_id,)).fetchone()

    comments = db.execute("""
    SELECT comments.*, users.username
    FROM comments
    JOIN users ON users.id = comments.user_id
    WHERE post_id=?
    ORDER BY created_at ASC
    """,(post_id,)).fetchall()

    html = """

    <div class='card'>

    <b>{{post['username']}}</b>

    <p>{{post['content']}}</p>

    </div>

    <div class='card'>

    <h4>Comments</h4>

    {% for c in comments %}

    <p><b>{{c['username']}}</b>: {{c['content']}}</p>

    {% endfor %}

    </div>

    {% if user %}

    <div class='card'>

    <form method='post'>

    <textarea name='content'></textarea>

    <br>

    <button>Add Comment</button>

    </form>

    </div>

    {% endif %}

    """

    return render_template_string(layout,
                                  content=render_template_string(html,post=post,comments=comments,user=current_user()),
                                  user=current_user())

# -----------------------------
# Profile Page
# -----------------------------

@app.route('/profile/<int:user_id>', methods=['GET','POST'])
def profile(user_id):

    db = get_db()

    user = db.execute("SELECT * FROM users WHERE id=?",(user_id,)).fetchone()

    if request.method == 'POST':

        if 'user_id' not in session:
            return redirect('/login')

        bio = request.form['bio']

        db.execute("UPDATE users SET bio=? WHERE id=?",
                   (bio,user_id))

        db.commit()

    posts = db.execute("SELECT * FROM posts WHERE user_id=? ORDER BY created_at DESC",
                       (user_id,)).fetchall()

    html = """

    <div class='card'>

    <h3>{{user['username']}}</h3>

    <p>{{user['bio']}}</p>

    {% if session_user and session_user['id']==user['id'] %}

    <form method='post'>

    <textarea name='bio' placeholder='Edit bio'></textarea>

    <br>

    <button>Update Bio</button>

    </form>

    {% endif %}

    </div>

    <div class='card'>

    <h3>Posts</h3>

    {% for p in posts %}

    <p>{{p['content']}}</p>

    <hr>

    {% endfor %}

    </div>

    """

    return render_template_string(layout,
                                  content=render_template_string(html,user=user,posts=posts,session_user=current_user()),
                                  user=current_user())

# -----------------------------
# Run App
# -----------------------------

if __name__ == '__main__':

    if not os.path.exists(DATABASE):

        init_db()

    app.run(debug=True)
