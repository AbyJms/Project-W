from flask import Flask, render_template

app = Flask(__name__)  # 👈 do NOT rename static_folder

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/role")
def role():
    return render_template("role.html")

@app.route("/auth")
def auth():
    return render_template("auth.html")

@app.route("/household")
def household():
    return render_template("household.html")

@app.route("/collector")
def collector():
    return render_template("collector.html")

if __name__ == "__main__":
    app.run(debug=True)