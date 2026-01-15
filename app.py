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
# AUTH
# --------------------

@app.post("/api/login/collector")
def login_collector():
    d = request.json
    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT worker_id FROM workers WHERE phone=%s AND password=%s",
        (d["phone"], d["password"])
    )
    row = cur.fetchone()
    cur.close()

    if not row:
        return jsonify({"error": "invalid"}), 401

    return jsonify({"ok": True, "worker_id": row["worker_id"]})

# --------------------
# COLLECTOR REQUESTS (COMPACT CARDS)
# --------------------

@app.get("/api/collector/requests")
def collector_requests():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT
            pr.pickup_request_id,
            pr.notes,
            pr.request_date,
            h.household_name,
            h.contact_phone
        FROM pickup_requests pr
        JOIN households h ON pr.household_id = h.household_id
        WHERE pr.status = 'requested'
        ORDER BY pr.requested_at ASC
    """)
    rows = cur.fetchall()
    cur.close()
    return jsonify(rows)

# --------------------
# MARK AS COLLECTED
# --------------------

@app.post("/api/collector/collect")
def collector_collect():
    d = request.json
    cur = mysql.connection.cursor()

    cur.execute("""
        UPDATE pickup_requests
        SET status='collected',
            collected_at=NOW()
        WHERE pickup_request_id=%s
    """, (d["pickup_request_id"],))

    mysql.connection.commit()
    cur.close()
    return jsonify({"ok": True})

# --------------------
# PAUSE REQUEST
# --------------------

@app.post("/api/collector/pause")
def collector_pause():
    d = request.json
    cur = mysql.connection.cursor()

    cur.execute("""
        UPDATE pickup_requests
        SET status='assigned'
        WHERE pickup_request_id=%s
    """, (d["pickup_request_id"],))

    mysql.connection.commit()
    cur.close()
    return jsonify({"ok": True})

# --------------------
# FLAG / VIOLATION
# --------------------

@app.post("/api/collector/flag")
def collector_flag():
    d = request.json
    cur = mysql.connection.cursor()

    cur.execute("""
        INSERT INTO violations
        (
            household_id,
            worker_id,
            pickup_request_id,
            violation_reason_id,
            severity,
            violation_date,
            description
        )
        SELECT
            pr.household_id,
            %s,
            pr.pickup_request_id,
            %s,
            %s,
            CURDATE(),
            %s
        FROM pickup_requests pr
        WHERE pr.pickup_request_id = %s
    """, (
        d["worker_id"],          # TEMP (can be session later)
        d["reason_id"],
        d["severity"],
        d["description"],
        d["pickup_request_id"]
    ))

    mysql.connection.commit()
    cur.close()
    return jsonify({"ok": True})

# --------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
