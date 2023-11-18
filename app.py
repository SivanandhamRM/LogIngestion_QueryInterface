from flask import Flask, request, jsonify
import psycopg2
from psycopg2 import sql
from psycopg2.extras import Json
from flask_cors import CORS
import traceback

app = Flask(__name__)

CORS(app)

conn = psycopg2.connect(
    host="localhost", database="logingestor", user="postgres", password="RMSiva@13"
)


@app.route("/")
def hello_world():
    cur = conn.cursor()
    cur.execute("SELECT * FROM log")
    records = cur.fetchall()
    # print(records)
    return "Siva"


@app.route("/ingest", methods=["POST"])
def ingest_logs():
    try:
        received_logs = request.json
        # print('Received logs:', received_logs)

        # Store received logs in the database
        with conn.cursor() as cur:
            # Construct and execute an SQL INSERT query
            query = sql.SQL(
                "INSERT INTO log (level, message, resource_id, timestamp, trace_id, span_id, commit, metadata) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
            )
            cur.execute(
                query,
                (
                    received_logs["level"],
                    received_logs["message"],
                    received_logs["resourceId"],
                    received_logs["timestamp"],
                    received_logs["traceId"],
                    received_logs["spanId"],
                    received_logs["commit"],
                    Json(received_logs["metadata"]),
                ),
            )

        conn.commit()  # Commit the transaction

        return "Logs ingested successfully.", 200

    except Exception as e:
        conn.rollback()  # Rollback in case of an error
        print("Error:", e)
        return "Failed to ingest logs.", 500


@app.route("/query", methods=["POST"])
def query_method():
    try:
        request_args = request.json
        level = request_args.get("level")
        message = request_args.get("message")
        resource_id = request_args.get("resource_id")
        start_date = request_args.get("start_date")
        end_date = request_args.get("end_date")
        trace_id = request_args.get("trace_id")
        span_id = request_args.get("span_id")
        commit = request_args.get("commit")
        metadata = request_args.get("metadata")

        # print('level', level, "message", message, "resource_id", resource_id, f"{start_date=}", f"{end_date=}", f"{trace_id=}", f"{span_id=}, {commit=}, {metadata=}")

        query_string = "SELECT * FROM log"
        filter_string = []
        if level:
            filter_string.append(f"level='{level}'")
        if message:
            filter_string.append(f"message LIKE '%{message}%'")
        if resource_id:
            filter_string.append(f"resource_id ='{resource_id}'")
        if start_date:
            filter_string.append(f"timestamp>='{start_date}'")
        if end_date:
            filter_string.append(f"timestamp<='{end_date}'")
        if trace_id:
            filter_string.append(f"trace_id ='{trace_id}'")
        if span_id:
            filter_string.append(f"span_id ='{span_id}'")
        if commit:
            filter_string.append(f"commit ='{commit}'")
        if metadata:
            filter_string.append(f"metadata->>'parentResourceId' ='{metadata}'")

        if filter_string:
            multiple_filter = " WHERE " + " AND ".join(filter_string)
        else:
            multiple_filter = ""

        final_query = query_string + multiple_filter + " LIMIT 100 OFFSET 0"
        print(final_query)

        with conn.cursor() as cur:
            cur.execute(final_query)
            results = cur.fetchall()
        return results

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(host="localhost", port=3000, debug=True)
