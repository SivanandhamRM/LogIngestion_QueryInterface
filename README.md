# Log Ingestion and Querying System

This project presents a log ingestion and querying system built with Flask and PostgreSQL. The system allows users to ingest logs and perform filtered queries based on various parameters.

---

## How to Run the Project

1. **Clone the Repository:**
   git clone https://github.com/your-username/november-2023-hiring-SivanandhamRM.git

2. **Install Dependencies:**
   pip install -r requirements.txt

3. **Set Up the Database:**

- Ensure you have PostgreSQL installed and running.
- Create a database named `logingestor`.
- Update the connection details in `app.py` to match your database credentials.

4. **Run the Application:**
   python app.py

5. **Access the Application:**
   Open a web browser and go to `http://localhost:3000`.

---

## System Design

The system architecture comprises a Flask application that serves as an interface to interact with a PostgreSQL database. Key components include:

- **Flask Application:** Handles log ingestion, querying, and provides a web interface.
- **PostgreSQL Database:** Stores log data with fields for level, message, resource ID, timestamp, trace ID, span ID, commit, and metadata.

---

## Features Implemented

1. **Log Ingestion Endpoint:**

- URL: `/ingest`
- Accepts JSON data to insert logs into the database.
- Make sure the elements are in the following order: level, message, resource_id, timestamp, trace_id, span_id, commit, metadata
- 1. **Level**: Represents the severity level of the log entry. It includes five possible values: debug, info, warning, error, and critical.
- 2. **Message**: Contains the main content or description related to the log entry. It's a string data type.
- 3. **Resource ID**: Identifies the resource associated with the log entry. It's a string data type.
- 4. **Timestamp**: Captures the time when the log entry was generated. It's stored in datetime data type.
- 5. **Trace ID**: Indicates the trace associated with the log entry. It's a string data type.
- 6. **Span ID**: Represents the span ID associated with the log entry. It's a string data type.
- 7. **Commit**: Refers to the commit related to the log entry. It's a string data type.
- 8. **Metadata**: Contains additional information structured in JSON format. Since metadata is stored as JSON, it provides a semi-structured data storage approach, resembling a NoSQL structure.

2. **Log Querying Endpoint:**

- URL: `/query`
- Allows filtered searches based on log attributes.
- Supports filtering by level, message, resource ID, timestamp, trace ID, span ID, commit, and metadata.

3. **User Interface:**

- HTML, CSS, and JavaScript interface for interacting with log data.
- Allows users to filter logs based on different parameters.

---

## Identified Issues

- **Case-Sensitive Message Filtering:** The current message filter performs a case-sensitive search. Enhancements are needed to enable case-insensitive search.

---

### Repository Structure

- `app.py`: Flask application handling log ingestion and querying.
- `index.html`: HTML file for the user interface.
- `app.js`: JavaScript code to handle user interactions.
- `styles.css`: CSS file for styling the interface.
