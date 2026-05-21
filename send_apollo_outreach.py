import smtplib
import time
import re
import html as html_module
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_HOST = "smtp.zoho.com"
SMTP_PORT = 465
FROM_EMAIL = "hello@ozigi.app"
APP_PASSWORD = "QD40Cdjez9b9"

DELAY_BETWEEN_SENDS = 3

ARCH_URL     = "https://blog.ozigi.app/blog/stopping-ai-slop-in-production-banned-lexicon-validator"
DEMO_URL     = "https://ozigi.app/demo"
TUTORIAL_URL = "https://ozigi.app/tutorials?v=getting-started-with-ozigi"
LEXICON_URL  = "https://ozigi.app/docs/the-banned-lexicon"
PERSONA_URL  = "https://ozigi.app/docs/system-personas"

FOUNDER_TEMPLATE = (
    "Founders have to ship content across every channel simultaneously -- X threads, LinkedIn posts, "
    "Discord updates, email newsletters -- and it all has to sound like the same person wrote it. "
    "Ozigi takes your raw notes, a URL, or a PDF and generates a multi-platform content campaign in "
    "your voice. A persona system locks in how you sound; a banned lexicon blocks the words that flag "
    'AI-written content ("synergy", "delve", "leverage"). Content repurposing goes from an afternoon '
    "to a few minutes.\n\n"
    "Worth 5 minutes? -> ozigi.app\n\n"
    "-- Dumebi Okolo, Founder @ Ozigi"
)

RECIPIENTS = [
    {
        "name": "Mona",
        "email": "mona@regpac.com",
        "subject": "AI content that doesn't sound like AI",
        "opener": (
            "RegTech content has to work for two very different readers simultaneously -- "
            "the compliance officer who needs it to be airtight, and the executive who needs to "
            "understand why it matters. Generic AI fails both."
        ),
    },
    {
        "name": "Steven",
        "email": "steven@liveblocks.io",
        "subject": "AI content that doesn't sound like AI",
        "opener": (
            "Building real-time infrastructure means your audience is senior engineers -- "
            "they'll immediately know if a tutorial or announcement was written by someone who "
            "hasn't actually shipped the thing they're documenting."
        ),
    },
    {
        "name": "Peter",
        "email": "peter@rentonand.co",
        "subject": "AI content that doesn't sound like AI",
        "opener": (
            "Running a fintech media operation -- podcasts, newsletters, white papers, webinars -- "
            "means every format has to sound like it came from the same editorial voice, week after week."
        ),
    },
    {
        "name": "Bhairav",
        "email": "bhairav@characterquilt.com",
        "subject": "AI content that doesn't sound like AI",
        "opener": (
            "A product built on capturing buyer voice and pain points -- the irony is that the "
            "content marketing for it still has to sound like a person, not the AI it's built on."
        ),
    },
    {
        "name": "Priyansh",
        "email": "priyansh@fintrexmedia.com",
        "subject": "AI content that doesn't sound like AI",
        "opener": (
            "Running a B2B fintech media company means your editorial credibility is the product -- "
            "the moment your content sounds like everyone else's, the audience has no reason to come back."
        ),
    },
    {
        "name": "Musharof",
        "email": "musharof@pimjo.com",
        "subject": "AI content that doesn't sound like AI",
        "opener": (
            "An open-source product studio means your content has two jobs at once -- reaching "
            "developers who might contribute and companies who might pay. Both audiences can tell "
            "immediately if the writing was generated."
        ),
    },
    {
        "name": "George",
        "email": "georgeliontos@innoviden.com",
        "subject": "AI content that doesn't sound like AI",
        "opener": (
            "Building an AI content product means your own marketing has to prove the category works -- "
            "any trace of generic output in your own copy actively undermines the pitch."
        ),
    },
    {
        "name": "Brian",
        "email": "brian@get-latitude.com",
        "subject": "AI content that doesn't sound like AI",
        "opener": (
            "LinkedIn automation tools live or die on whether the content they produce actually sounds "
            "like the person behind the account -- the moment it sounds templated, the audience disengages."
        ),
    },
    {
        "name": "Richard",
        "email": "rich@cloudtweaks.com",
        "subject": "AI content that doesn't sound like AI",
        "opener": (
            "CloudTweaks has been a cloud computing reference for over a decade -- that reputation "
            "depends on publishing content that sounds like it came from someone who's actually been "
            "inside a cloud migration, not someone summarizing vendor documentation."
        ),
    },
    {
        "name": "Yasa",
        "email": "yasa@xerpihan.id",
        "subject": "AI content that doesn't sound like AI",
        "opener": (
            "Building an AI platform for Southeast Asian markets means most existing tools weren't "
            "designed for your use case -- and the content you ship about it has to reflect that "
            "specificity, not flatten it."
        ),
    },
]


def build_body(opener):
    return f"Hey,\n\n{opener}\n\n{FOUNDER_TEMPLATE}"


def make_plain(body):
    return body.replace(
        "Worth 5 minutes? -> ozigi.app",
        f"Read our architectural breakdown: {ARCH_URL}\n\n"
        f"Try a quick demo: {DEMO_URL},\n\nor\n\n"
        f"Watch a quick tutorial: {TUTORIAL_URL}"
    )


def make_html(body):
    h = html_module.escape(body)
    h = h.replace('\n', '<br>\n')

    h = h.replace(
        'Worth 5 minutes? -&gt; ozigi.app<br>\n<br>\n',
        f'<a href="{ARCH_URL}">Read our architectural breakdown.</a><br>\n<br>\n'
        f'<a href="{DEMO_URL}">Try a quick demo</a>,<br>\n<br>\n'
        'or<br>\n<br>\n'
        f'<a href="{TUTORIAL_URL}">Watch a quick tutorial.</a><br>\n<br>\n'
    )

    h = re.sub(
        r'banned lexicon',
        f'<a href="{LEXICON_URL}">banned lexicon</a>',
        h,
        flags=re.IGNORECASE,
    )

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


def send_email(smtp, r, plain, html):
    msg = MIMEMultipart("alternative")
    msg["Subject"]  = r["subject"]
    msg["From"]     = f"Dumebi Okolo <{FROM_EMAIL}>"
    msg["To"]       = f"{r['name']} <{r['email']}>"
    msg["Reply-To"] = FROM_EMAIL
    msg.attach(MIMEText(plain, "plain", "utf-8"))
    msg.attach(MIMEText(html,  "html",  "utf-8"))
    smtp.sendmail(FROM_EMAIL, r["email"], msg.as_string())


def main():
    total = len(RECIPIENTS)
    print(f"Sending to {total} Apollo contacts.\n")

    sent, failed = [], []

    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as smtp:
        smtp.login(FROM_EMAIL, APP_PASSWORD)
        print("Logged in to Zoho Mail.\n")

        for i, r in enumerate(RECIPIENTS, 1):
            body  = build_body(r["opener"])
            plain = make_plain(body)
            html  = make_html(body)

            try:
                send_email(smtp, r, plain, html)
                print(f"[{i}/{total}] SENT  -> {r['name']} <{r['email']}>")
                sent.append(r["email"])
            except Exception as e:
                print(f"[{i}/{total}] FAIL  -> {r['name']} <{r['email']}>: {e}")
                failed.append((r["email"], str(e)))

            if i < total:
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
