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

<<<<<<< HEAD
@app.route("/signup")
def signup():
    return render_template("signup.html")

# ⚠️ app.run MUST BE LAST
if __name__ == "__main__":
    app.run(debug=True)
=======
@app.route("/collector")
def collector():
    return render_template("collector.html")

@app.route("/household")
def household():
    return render_template("household.html")

# ---------- REGISTER ----------
@app.route("/api/register", methods=["POST"])
def register():
    d = request.json
    email = d["email"]
    phone = d["phone"]

    db = get_db()
    cur = db.cursor(dictionary=True)

    # Check if already a worker
    cur.execute("SELECT worker_id FROM workers WHERE email=%s", (email,))
    worker = cur.fetchone()

    if worker:
        cur.close()
        db.close()
        return jsonify({"role": "collector"})

    # Otherwise create household
    cur.execute("""
        INSERT INTO households
        (ward_id, household_name, address_line1, city, state, contact_phone, contact_email)
        VALUES (1, %s, %s, %s, %s, %s, %s)
    """, (
        email.split("@")[0],
        "Not provided",
        "Unknown",
        "Kerala",
        phone,
        email
    ))

    db.commit()
    cur.close()
    db.close()

    return jsonify({"role": "household"})

# ---------- LOGIN ----------
@app.route("/api/login", methods=["POST"])
def login():
    d = request.json
    email = d["email"]

    db = get_db()
    cur = db.cursor(dictionary=True)

    cur.execute("SELECT worker_id FROM workers WHERE email=%s", (email,))
    worker = cur.fetchone()

    if worker:
        cur.close()
        db.close()
        return jsonify({"role": "collector"})

    cur.execute("SELECT household_id FROM households WHERE contact_email=%s", (email,))
    household = cur.fetchone()

    cur.close()
    db.close()

    if household:
        return jsonify({"role": "household"})

    return jsonify({"error": "not_found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
>>>>>>> 2cb52929c6d5f8dd5f5f6c3af1431f9f06b111a3
