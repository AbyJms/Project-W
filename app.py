from flask import Flask, render_template, request, jsonify
from db import mysql, init_db
import os

app = Flask(__name__)
init_db(app)

# --------------------
# PAGES
# --------------------

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/role")
def role():
    return render_template("role.html")

@app.route("/auth")
def auth():
    return render_template("auth.html")

@app.route("/collector-auth")
def collector_auth():
    return render_template("collectorAuth.html")

@app.route("/signup")
def signup():
    return render_template("signup.html")

@app.route("/collector")
def collector():
    return render_template("collector.html")

@app.route("/household")
def household():
    return render_template("household.html")

# --------------------
# HOUSEHOLD SIGNUP
# --------------------

@app.post("/api/signup")
def api_signup():
    d = request.json
    cur = mysql.connection.cursor()

    cur.execute(
        "SELECT household_id FROM households WHERE contact_phone=%s",
        (d["phone"],)
    )
    if cur.fetchone():
        cur.close()
        return jsonify({"error": "exists"}), 400

    cur.execute("""
        INSERT INTO households
        (ward_id, household_name, address_line1, city, state,
         contact_phone, password)
        VALUES (1, %s, %s, %s, %s, %s, %s)
    """, (
        d["name"],
        d["location"],
        "Kerala",
        "Kerala",
        d["phone"],
        d["password"]
    ))

    mysql.connection.commit()
    cur.close()
    return jsonify({"ok": True})

# --------------------
# HOUSEHOLD LOGIN
# --------------------

@app.post("/api/login/household")
def login_household():
    d = request.json
    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT household_id FROM households
        WHERE contact_phone=%s AND password=%s
    """, (d["phone"], d["password"]))

    user = cur.fetchone()
    cur.close()

    if not user:
        return jsonify({"error": "invalid"}), 401

    return jsonify({"ok": True})

# --------------------
# COLLECTOR LOGIN
# --------------------

@app.post("/api/login/collector")
def login_collector():
    d = request.json
    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT worker_id FROM workers
        WHERE phone=%s AND password=%s
    """, (d["phone"], d["password"]))

    worker = cur.fetchone()
    cur.close()

    if not worker:
        return jsonify({"error": "invalid"}), 401

    return jsonify({"ok": True})

# --------------------
# DEBUG
# --------------------

@app.get("/debug/db")
def debug_db():
    cur = mysql.connection.cursor()
    cur.execute("SELECT DATABASE() AS db, @@hostname AS host, @@port AS port")
    info = cur.fetchone()
    cur.close()
    return info

# --------------------
# DISTRICTS
# --------------------

@app.get("/api/districts")
def get_districts():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM districts_cities")
    rows = cur.fetchall()
    cur.close()
    return jsonify(rows)

# --------------------
# PICKUP REQUEST (FIXED)
# --------------------

@app.post("/api/pickup-request")
def create_pickup_request():
    data = request.json

    household_id = data.get("household_id")
    notes = data.get("notes")

    if not household_id:
        return jsonify({"error": "Missing household"}), 400

    cur = mysql.connection.cursor()

    cur.execute("""
        INSERT INTO pickup_requests
        (household_id, request_date, status, notes)
        VALUES (%s, CURDATE(), 'requested', %s)
    """, (household_id, notes))

    mysql.connection.commit()
    cur.close()

    return jsonify({"ok": True})

# --------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
