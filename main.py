import os
from flask import Flask, render_template, request, redirect
from flask import session, url_for
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import bcrypt

load_dotenv()

app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.secret_key = os.getenv("SECRET_KEY", "dev-secret")
mongo = PyMongo(app)

# -------------------- ROUTES --------------------

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/base")
def base():
    return render_template("base.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/book")
def books():
    return render_template("book.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")

        mongo.db.contacts.insert_one({
            "name": name,
            "email": email,
            "message": message
        })

        return render_template("contact.html",success="Your message has been sent!")
    return render_template("contact.html")


# -------------------- AUTH SYSTEM --------------------

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")

        existing_user = mongo.db.users.find_one({"email": email})
        if existing_user:
            return "Email already registered!"

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        mongo.db.users.insert_one({
            "name": name,
            "email": email,
            "password": hashed_password
        })

        return render_template("login.html", success="Account created successfully!")
    return render_template("create_account.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        user = mongo.db.users.find_one({"email": email})

        if user and bcrypt.checkpw(password.encode("utf-8"), user["password"]):
            session['user'] = user.get('name') or user.get('email')
            session['just_logged_in'] = True
            return redirect(url_for('login'))
        else:
            return render_template("login.html", error="Invalid email or password.")
    success = None
    if session.pop('just_logged_in', None):
        success = "Login successful!"
    return render_template("login.html", success=success)


@app.route("/add_tocart")
def add_to_cart():
    return render_template("add_tocart.html")

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return redirect(url_for('home'))


@app.route('/profile')
def profile():
    if not session.get('user'):
        return redirect(url_for('login'))
    return render_template('profile.html', user=session.get('user'))


@app.route("/anime")
def anime():
    return render_template("anime.html")


@app.route("/story")
def story():
    return render_template("story.html")


@app.route("/spiritual")
def spiritual():
    return render_template("spiritual.html")


@app.route("/self_book")
def self_book():
    return render_template("self_book.html")


@app.route("/other")
def other():
    return render_template("other.html")


# -------------------- RUN APP --------------------

if __name__ == "__main__":
    app.run(debug=True)