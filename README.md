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
  1. level, message, resource_id, trace_id, span_id, commit - **string** datatype
  2. timestamp - **DateTime** datatype
  3. metadata - **json** datatype. Since metadata is stored as JSON, it provides a semi-structured data storage approach, resembling a NoSQL structure.

2. **Log Querying Endpoint:**

- URL: `/query`
- Allows filtered searches based on log attributes.
- Supports filtering by level, message, resource ID, timestamp, trace ID, span ID, commit, and metadata.

3. **User Interface:**

- HTML, CSS, and JavaScript interface for interacting with log data.
- Allows users to filter logs based on different parameters.

4. **Scalability and Database Optimization**

### Efficient Handling of High Log Volumes

This application is architected to effectively manage substantial volumes of logs, ensuring scalability to accommodate increasing data demands. Leveraging PostgreSQL's robust features, the system implements indexing and sharding methodologies to optimize performance, particularly under heavy workloads.

### Indexing for Faster Data Retrieval

To expedite data retrieval, strategic indexing is applied to specific fields within the PostgreSQL database. Notably, indexing is employed on fields such as `traceid`, `spanid`, and `commit`. These indexing strategies significantly enhance query performance when retrieving logs based on these indexed fields.

#### Example of Indexing Syntax for the `level` Field in the `log` Table:

```sql
CREATE INDEX idx_level ON log (level);

---

## Identified Issues

- **Case-Sensitive Message Filtering:** The current message filter performs a case-sensitive search. Enhancements are needed to enable case-insensitive search.

---

### Repository Structure

- `app.py`: Flask application handling log ingestion and querying.
- `index.html`: HTML file for the user interface.
- `app.js`: JavaScript code to handle user interactions.
- `styles.css`: CSS file for styling the interface.
```
