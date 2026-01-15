from flask import Flask, render_template, request, jsonify
import mysql.connector

app = Flask(__name__)

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="projectSanguine",
        database="waste_management"
    )

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/role")
def role():
    return render_template("role.html")

@app.route("/auth")
def auth():
    return render_template("auth.html")

@app.route("/signup")
def signup():
    return render_template("signup.html")

# ⚠️ app.run MUST BE LAST
if __name__ == "__main__":
    app.run(debug=True)
