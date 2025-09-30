import mysql.connector
from mysql.connector import Error

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",             # Your MySQL username
            password="Manusri#874",  # Your MySQL password
            database="parivar_db"
        )
        return connection
    except Error as e:
        print("Database connection error:", e)
        return None
if __name__ == "__main__":
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DATABASE();")
    print("Connected to database:", cursor.fetchone())
    cursor.close()
    conn.close()
