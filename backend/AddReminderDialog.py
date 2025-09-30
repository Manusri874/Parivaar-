from flask import Blueprint, request, jsonify
from db import get_db_connection
import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
from apscheduler.triggers.cron import CronTrigger
import traceback

# ---------------- BLUEPRINT ---------------- #
reminders_bp = Blueprint("reminders_bp", __name__)

# ---------------- LOAD ENV VARIABLES ---------------- #
load_dotenv()
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

# ---------------- APSCHEDULER ---------------- #
scheduler = BackgroundScheduler()
scheduler.start()

# ---------------- FUNCTION: SEND EMAIL ---------------- #
def send_email(to_email, subject, body):
    try:
        if not to_email:
            print("⚠️ Skipping email: No recipient address provided")
            return

        msg = MIMEMultipart()
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"✅ Email sent to {to_email}")
    except Exception as e:
        print(f"❌ Email sending failed to {to_email}: {e}")
        traceback.print_exc()

# ---------------- FETCH EMAILS FROM DB ---------------- #
def get_emails_for_family_member(family_member_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT fm.email AS family_email, u.email AS user_email
            FROM family_members fm
            JOIN users u ON fm.user_id = u.id
            WHERE fm.id = %s
            """,
            (family_member_id,),
        )
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result["family_email"], result["user_email"] if result else (None, None)
    except Exception as e:
        print(f"❌ Failed fetching emails for family_member_id {family_member_id}: {e}")
        return None, None

# ---------------- SCHEDULE REMINDER ---------------- #
def schedule_reminder(reminder_id, family_member_id, title, notes,
                      start_date, end_date, reminder_time, frequency,
                      day_of_week=None, day_of_month=None):
    try:
        now = datetime.datetime.now()

        # Ensure reminder_time is datetime.time
        if isinstance(reminder_time, datetime.timedelta):
            total_seconds = int(reminder_time.total_seconds())
            hours = total_seconds // 3600
            minutes = (total_seconds % 3600) // 60
            seconds = total_seconds % 60
            reminder_time = datetime.time(hour=hours, minute=minutes, second=seconds)
        elif isinstance(reminder_time, str):
            reminder_time = datetime.time.fromisoformat(reminder_time)
        elif not isinstance(reminder_time, datetime.time):
            raise ValueError("Invalid reminder_time type")

        # Fetch recipient emails
        member_email, user_email = get_emails_for_family_member(family_member_id)

        def job_action():
            if member_email:
                send_email(
                    member_email,
                    f"Reminder: {title}",
                    f"Hello! You have a reminder for {title}.\nNotes: {notes or 'None'}",
                )
            if user_email:
                send_email(
                    user_email,
                    f"Reminder Notification: {title}",
                    f"Reminder for your family member: {title}.\nNotes: {notes or 'None'}",
                )

        if frequency.lower() == "once":
            reminder_datetime = datetime.datetime.combine(start_date, reminder_time)
            if reminder_datetime < now:
                print(f"⚠️ Reminder {reminder_id} time {reminder_datetime} is in the past. Skipping.")
                return
            scheduler.add_job(
                job_action,
                DateTrigger(run_date=reminder_datetime),
                id=f"reminder_{reminder_id}",
                replace_existing=True
            )

        elif frequency.lower() == "daily":
            scheduler.add_job(
                job_action,
                CronTrigger(hour=reminder_time.hour, minute=reminder_time.minute),
                id=f"reminder_{reminder_id}",
                replace_existing=True
            )

        elif frequency.lower() == "weekly":
            if day_of_week is None:
                day_of_week = start_date.weekday()  # default from start_date
            scheduler.add_job(
                job_action,
                CronTrigger(day_of_week=day_of_week, hour=reminder_time.hour, minute=reminder_time.minute),
                id=f"reminder_{reminder_id}",
                replace_existing=True
            )

        elif frequency.lower() == "monthly":
            if day_of_month is None:
                day_of_month = start_date.day  # default from start_date
            scheduler.add_job(
                job_action,
                CronTrigger(day=day_of_month, hour=reminder_time.hour, minute=reminder_time.minute),
                id=f"reminder_{reminder_id}",
                replace_existing=True
            )

        print(f"✅ Scheduled {frequency} reminder {reminder_id} ({title}) at {reminder_time}")

    except Exception as e:
        print(f"❌ Failed to schedule reminder {reminder_id}: {e}")
        traceback.print_exc()

# ---------------- LOAD AND SCHEDULE EXISTING REMINDERS ---------------- #
def load_and_schedule_reminders():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM reminders WHERE is_active = 1")
        reminders = cursor.fetchall()
        cursor.close()
        conn.close()

        for r in reminders:
            try:
                start_date = datetime.date.fromisoformat(str(r["start_date"]))
                end_date = datetime.date.fromisoformat(str(r["end_date"])) if r["end_date"] else None
                reminder_time = r["reminder_time"]

                schedule_reminder(
                    r["id"],
                    r["family_member_id"],
                    r["title"],
                    r.get("notes"),
                    start_date,
                    end_date,
                    reminder_time,
                    r["frequency"],
                    r.get("day_of_week"),
                    r.get("day_of_month"),
                )
            except Exception as e:
                print(f"❌ Skipping reminder {r['id']}: {e}")
                traceback.print_exc()

    except Exception as e:
        print(f"❌ Error loading reminders: {e}")
        traceback.print_exc()

# Initialize scheduler with existing reminders
load_and_schedule_reminders()

# ---------------- SERIALIZATION HELPERS ---------------- #
def serialize(obj):
    if isinstance(obj, (datetime.date, datetime.datetime)):
        return obj.isoformat()
    elif isinstance(obj, datetime.timedelta):
        return str(obj)
    return obj

def serialize_reminder(reminder: dict) -> dict:
    return {k: serialize(v) for k, v in reminder.items()}

# ---------------- POST: Add Reminder ---------------- #
@reminders_bp.route("/reminders", methods=["POST", "OPTIONS"])
def add_reminder():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight OK"}), 200

    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid request body"}), 400

        family_member_id = data.get("family_member_id")
        title = data.get("title")
        reminder_type = data.get("reminder_type")
        start_date_str = data.get("start_date")
        reminder_time_str = data.get("reminder_time")
        notes = data.get("notes")
        frequency = data.get("frequency", "Once")
        end_date_str = data.get("end_date")
        day_of_week = data.get("day_of_week")
        day_of_month = data.get("day_of_month")
        dosage = data.get("dosage")

        if not (family_member_id and title and reminder_type and start_date_str and reminder_time_str):
            return jsonify({"error": "Missing required fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO reminders
            (family_member_id, title, reminder_type, start_date, end_date, reminder_time,
             frequency, dosage, notes, day_of_week, day_of_month, is_active, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 1, NOW())
            """,
            (
                family_member_id,
                title,
                reminder_type,
                start_date_str,
                end_date_str,
                reminder_time_str,
                frequency,
                dosage,
                notes,
                day_of_week,
                day_of_month,
            ),
        )
        reminder_id = cursor.lastrowid
        conn.commit()
        cursor.close()
        conn.close()

        # Schedule immediately
        start_date = datetime.date.fromisoformat(start_date_str)
        end_date = datetime.date.fromisoformat(end_date_str) if end_date_str else None
        schedule_reminder(
            reminder_id,
            family_member_id,
            title,
            notes,
            start_date,
            end_date,
            reminder_time_str,
            frequency,
            day_of_week,
            day_of_month,
        )

        return jsonify({"message": "Reminder added and scheduled successfully"}), 201

    except Exception as e:
        print("❌ Add reminder error:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ---------------- GET: List Reminders for Member ---------------- #
@reminders_bp.route("/family-members/<int:member_id>/reminders", methods=["GET", "OPTIONS"])
def list_reminders(member_id):
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight OK"}), 200

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT id, title, reminder_type, start_date, end_date, reminder_time,
                   frequency, dosage, notes, day_of_week, day_of_month, created_at, is_active
            FROM reminders
            WHERE family_member_id = %s
            ORDER BY start_date ASC, reminder_time ASC
            """,
            (member_id,),
        )
        reminders = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify([serialize_reminder(r) for r in reminders]), 200

    except Exception as e:
        print("❌ List reminders error:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
