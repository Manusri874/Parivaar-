import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

def send_test_email():
    try:
        msg = MIMEMultipart()
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = EMAIL_ADDRESS   # send to yourself
        msg["Subject"] = "✅ Test Email from Parivar+"
        body = "Hello! This is a test email to confirm your SMTP configuration works."
        msg.attach(MIMEText(body, "plain"))

        print(f"📧 Connecting to {SMTP_SERVER}:{SMTP_PORT} ...")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        print("🔑 Logging in ...")
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        print("📨 Sending email ...")
        server.send_message(msg)
        server.quit()

        print(f"✅ Test email sent successfully to {EMAIL_ADDRESS}")

    except Exception as e:
        print(f"❌ Failed to send email: {e}")

if __name__ == "__main__":
    send_test_email()
