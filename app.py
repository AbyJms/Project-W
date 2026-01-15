from flask import Flask, request, jsonify, send_from_directory
import mysql.connector

app = Flask(__name__, static_folder="static")

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="projectSanguine",
    database="projectw"
)

@app.route("/")
def home():
    return send_from_directory(".", "index.html")

@app.route("/role")
def role():
    return send_from_directory(".", "role.html")

@app.route("/auth")
def auth():
    return send_from_directory(".", "auth.html")

@app.route("/static/<path:p>")
def static_files(p):
    return send_from_directory("static", p)

@app.route("/api/login", methods=["POST"])
def login():
    d = request.json
    cur = db.cursor(dictionary=True)

    cur.execute(
        "SELECT * FROM users WHERE email=%s AND password=%s AND role=%s",
        (d["email"], d["password"], d["role"])
    )

    u = cur.fetchone()
    cur.close()

    if not u:
        return jsonify({"ok": False}), 401

    return jsonify({"ok": True, "role": u["role"]})

if __name__ == "__main__":
    app.run(debug=True)
