from flask import Flask, jsonify
from flask_cors import CORS
import random
import datetime
import subprocess
import sqlite3

app = Flask(__name__)

CORS(app)

def init_db():

    conn = sqlite3.connect("monitoring.db")

    cursor = conn.cursor()


    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        device TEXT,

        ip TEXT,

        old_status TEXT,

        new_status TEXT,

        timestamp TEXT

    )
    """)


    conn.commit()

    conn.close()



def check_ping(ip):

    try:

        result = subprocess.run(
            ["ping", "-n", "1", ip],
            stdout=subprocess.DEVNULL,
            timeout=2
        )

        if result.returncode == 0:
            return "UP"

        else:
            return "DOWN"


    except:

        return "DOWN"



devices = [

{
"name":"Router-KL",
"ip":"10.1.1.1",
"status":"UP",
"cpu":45,
"last_check":""
},

{
"name":"My-Laptop",
"ip":"127.0.0.1",
"status":"UP",
"cpu":20,
"last_check":""
}

]


alerts = []

previous_status = {}



@app.route("/api/devices")
def get_devices():

    for device in devices:

        old_status = previous_status.get(device["name"])

        device["status"] = check_ping(device["ip"])

        device["last_check"] = datetime.datetime.now().strftime("%H:%M:%S")


        if device["status"] == "UP":
            device["cpu"] = random.randint(30,95)

        else:
            device["cpu"] = 0


        # 👇 block baru letak sini
        if old_status is not None:

            if old_status != device["status"]:

                event = {
                    ...
                }

                save_alert(event)


        previous_status[device["name"]] = device["status"]


    return jsonify(devices)

def save_alert(device):

    print("SAVING ALERT:", device)

    conn = sqlite3.connect("monitoring.db")

    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO alerts
    (device, ip, old_status, new_status, timestamp)

    VALUES (?,?,?,?,?)
    """,
    (
        device["name"],
        device["ip"],
        device["old_status"],
        device["new_status"],
        device["last_check"]
    ))

    conn.commit()

    conn.close()

@app.route("/api/alerts")
def get_alerts():

    conn = sqlite3.connect("monitoring.db")

    cursor = conn.cursor()


    cursor.execute(
        """
        SELECT *
        FROM alerts
        ORDER BY id DESC
        """
    )


    rows = cursor.fetchall()


    conn.close()


    alert_list=[]


    for row in rows:

        alert_list.append({

            "id":row[0],

            "device":row[1],

            "ip":row[2],

            "old_status":row[3],

            "new_status":row[4],

            "time":row[5]

        })


    return jsonify(alert_list)

@app.route("/api/time")
def get_time():

    return jsonify({

        "time": datetime.datetime.now().strftime("%H:%M:%S")

    })


    rows = cursor.fetchall()


    conn.close()


    alerts=[]


    for row in rows:

        alerts.append({

            "id":row[0],

            "device":row[1],

            "ip":row[2],

            "old_status":row[3],

            "new_status":row[4],

            "time":row[5]

        })


        return jsonify(result)


init_db()

if __name__ == "__main__":

    app.run(debug=True)

