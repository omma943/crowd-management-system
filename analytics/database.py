import sqlite3
from datetime import datetime


DATABASE = "crowd_data.db"


def initialize_database():
    """Create the crowd events table if it doesn't exist."""

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS crowd_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            camera_id TEXT NOT NULL,
            gate_id TEXT NOT NULL,
            direction TEXT NOT NULL,
            count INTEGER NOT NULL,
            timestamp TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


def save_event(camera_id, gate_id, direction, count):
    """Save one entry or exit event."""

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    timestamp = datetime.now().isoformat()

    cursor.execute("""
        INSERT INTO crowd_events
        (camera_id, gate_id, direction, count, timestamp)
        VALUES (?, ?, ?, ?, ?)
    """, (
        camera_id,
        gate_id,
        direction,
        count,
        timestamp
    ))

    connection.commit()
    connection.close()


def get_today_counts():
    """Get today's total entry and exit counts."""

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    today = datetime.now().strftime("%Y-%m-%d")

    cursor.execute("""
        SELECT COALESCE(SUM(count), 0)
        FROM crowd_events
        WHERE direction = 'entry'
        AND DATE(timestamp) = ?
    """, (today,))

    entered_today = cursor.fetchone()[0]

    cursor.execute("""
        SELECT COALESCE(SUM(count), 0)
        FROM crowd_events
        WHERE direction = 'exit'
        AND DATE(timestamp) = ?
    """, (today,))

    exited_today = cursor.fetchone()[0]

    connection.close()

    return entered_today, exited_today