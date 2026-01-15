from flask_mysqldb import MySQL

mysql = MySQL()

def init_db(app):
    app.config["MYSQL_HOST"] = "localhost"
    app.config["MYSQL_USER"] = "root"
    app.config["MYSQL_PASSWORD"] = "projectSanguine"
    app.config["MYSQL_DB"] = "waste_management"
    app.config["MYSQL_CURSORCLASS"] = "DictCursor"

    mysql.init_app(app)
