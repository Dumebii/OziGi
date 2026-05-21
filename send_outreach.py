import smtplib
import time
import re
import html as html_module
import openpyxl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_HOST = "smtp.zoho.com"
SMTP_PORT = 465
FROM_EMAIL = "hello@ozigi.app"
APP_PASSWORD = "QD40Cdjez9b9"

XLSX_PATH = (
    r"C:\Users\PC\AppData\Local\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude"
    r"\local-agent-mode-sessions\f4d05f58-48d8-49da-b2fc-e884f84c7f7c"
    r"\66f23505-6da0-4c9a-bb23-77cde017cad1"
    r"\local_3e20d986-1e4b-48ed-b509-004c68fb96c2\outputs\outreach.xlsx"
)

START_FROM_INDEX = 12  # 0-based; recipient #13 (Colby Fayock) onwards
DELAY_BETWEEN_SENDS = 3  # seconds

ARCH_URL     = "https://blog.ozigi.app/blog/stopping-ai-slop-in-production-banned-lexicon-validator"
DEMO_URL     = "https://ozigi.app/demo"
TUTORIAL_URL = "https://ozigi.app/tutorials?v=getting-started-with-ozigi"
LEXICON_URL  = "https://ozigi.app/docs/the-banned-lexicon"
PERSONA_URL  = "https://ozigi.app/docs/system-personas"


def make_plain(body):
    """Plain-text version: replace CTA with bare URLs."""
    return body.replace(
        "Worth 5 minutes? -> ozigi.app",
        f"Read our architectural breakdown: {ARCH_URL}\n\n"
        f"Try a quick demo: {DEMO_URL},\n\nor\n\n"
        f"Watch a quick tutorial: {TUTORIAL_URL}"
    )


def make_html(body):
    """HTML version: replace CTA and add hyperlinks for key terms."""
    h = html_module.escape(body)
    h = h.replace('\n', '<br>\n')

    # CTA replacement (-> is escaped to -&gt; by html.escape)
    h = h.replace(
        'Worth 5 minutes? -&gt; ozigi.app<br>\n<br>\n',
        f'<a href="{ARCH_URL}">Read our architectural breakdown.</a><br>\n<br>\n'
        f'<a href="{DEMO_URL}">Try a quick demo</a>,<br>\n<br>\n'
        'or<br>\n<br>\n'
        f'<a href="{TUTORIAL_URL}">Watch a quick tutorial.</a><br>\n<br>\n'
    )

    # "banned lexicon" → linked
    h = re.sub(
        r'banned lexicon',
        f'<a href="{LEXICON_URL}">banned lexicon</a>',
        h,
        flags=re.IGNORECASE,
    )

    # "persona" (whole word) → linked
    h = re.sub(
        r'\bpersona\b',
        f'<a href="{PERSONA_URL}">persona</a>',
        h,
        flags=re.IGNORECASE,
    )

    return (
        '<!DOCTYPE html><html><head><meta charset="utf-8"></head>'
        '<body style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#222;">'
        f'{h}'
        '</body></html>'
    )


def load_recipients(path):
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb.active
    rows = list(ws.iter_rows(values_only=True))
    header = rows[0]
    return [
        dict(zip(header, row))
        for row in rows[1:]
        if any(cell is not None for cell in row)
    ]


def send_email(smtp, to_name, to_email, subject, plain, html):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = f"Dumebi Okolo <{FROM_EMAIL}>"
    msg["To"]      = f"{to_name} <{to_email}>"
    msg["Reply-To"] = FROM_EMAIL
    msg.attach(MIMEText(plain, "plain", "utf-8"))
    msg.attach(MIMEText(html,  "html",  "utf-8"))
    smtp.sendmail(FROM_EMAIL, to_email, msg.as_string())


def main():
    recipients = load_recipients(XLSX_PATH)
    batch = recipients[START_FROM_INDEX:]
    total = len(recipients)

    print(f"Total recipients in file : {total}")
    print(f"Skipping first {START_FROM_INDEX} (already sent).")
    first_name = batch[0].get("Name", "?") if batch else "?"
    print(f"Starting from recipient #{START_FROM_INDEX + 1}: {first_name}")
    print(f"Sending to {len(batch)} recipients.\n")

    sent, failed = [], []

    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as smtp:
        smtp.login(FROM_EMAIL, APP_PASSWORD)
        print("Logged in to Zoho Mail.\n")

        for idx, r in enumerate(batch):
            num   = START_FROM_INDEX + idx + 1
            name  = r.get("Name", "")
            email = r.get("Email", "")
            subj  = r.get("Subject Line", "")
            body  = r.get("Email Body", "")

            if not email:
                print(f"[{num}/{total}] SKIP — no email for {name}")
                continue

            try:
                send_email(smtp, name, email, subj, make_plain(body), make_html(body))
                print(f"[{num}/{total}] SENT  -> {name} <{email}>")
                sent.append(email)
            except Exception as e:
                print(f"[{num}/{total}] FAIL  -> {name} <{email}>: {e}")
                failed.append((email, str(e)))

            if idx < len(batch) - 1:
                time.sleep(DELAY_BETWEEN_SENDS)

    print(f"\n--- Done ---")
    print(f"Sent:   {len(sent)}")
    print(f"Failed: {len(failed)}")
    if failed:
        print("\nFailed:")
        for em, err in failed:
            print(f"  {em}: {err}")


if __name__ == "__main__":
    main()
