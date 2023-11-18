from flask import Flask, request
import psycopg2
from psycopg2 import sql
from psycopg2.extras import Json

app = Flask(__name__)

conn = psycopg2.connect(
    host="localhost",
    database="logingestor",
    user="postgres",
    password="RMSiva@13")


@app.route("/")
def hello_world():
    cur = conn.cursor()
    cur.execute('SELECT * FROM log')
    records = cur.fetchall()
    print(records)
    return "Siva"


@app.route('/ingest', methods=['POST'])
def ingest_logs():
    try:
        received_logs = request.json
        print('Received logs:', received_logs)

        # Store received logs in the database
        with conn.cursor() as cur:
            # Construct and execute an SQL INSERT query
            query = sql.SQL("INSERT INTO log (level, message, resource_id, timestamp, trace_id, span_id, commit, metadata) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)")
            cur.execute(query, (
                received_logs['level'],
                received_logs['message'],
                received_logs['resourceId'],
                received_logs['timestamp'],
                received_logs['traceId'],
                received_logs['spanId'],
                received_logs['commit'],
                Json(received_logs['metadata'])
            ))

        conn.commit()  # Commit the transaction

        return 'Logs ingested successfully.', 200

    except Exception as e:
        conn.rollback()  # Rollback in case of an error
        print("Error:", e)
        return 'Failed to ingest logs.', 500


if __name__ == '__main__':
    app.run(host="localhost", port=3000, debug=True)