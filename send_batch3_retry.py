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

DELAY_BETWEEN_SENDS = 5  # slightly longer delay after rate limit hit

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
        "name": "Gregg",
        "email": "gregg@runalloy.com",
        "opener": (
            "Building an AI automation platform means your content has to navigate a market where "
            "every competitor is making the same promises -- the ones that break through make them "
            "in a voice that sounds like they actually know what integration pain feels like."
        ),
    },
    {
        "name": "Adrian",
        "email": "adrian.schmid@beyondnations.tech",
        "opener": (
            "A company called Beyond Nations is making a statement about scope from day one -- "
            "the content you ship has to live up to that ambition without collapsing into "
            "the same global-expansion buzzwords everyone else uses."
        ),
    },
    {
        "name": "Swayam",
        "email": "swayam@wedigistudio.com",
        "opener": (
            "Running a digital studio means your own content is always a live pitch for what "
            "you can build -- generic AI writing is the fastest way to undermine the "
            "craftsmanship argument you're making with every client deliverable."
        ),
    },
    {
        "name": "Tamseel",
        "email": "tamseel@pluc.tv",
        "opener": (
            "Pluc.TV is building for creators who already know what authentic content looks like -- "
            "your own marketing has to meet that bar or the audience notices immediately."
        ),
    },
    {
        "name": "Kyle",
        "email": "kmack@middesk.com",
        "opener": (
            "Business verification is one of those categories where content has to be technically "
            "credible and accessible to compliance teams simultaneously -- that dual audience "
            "is hard to write for without flattening one or the other."
        ),
    },
    {
        "name": "Eric",
        "email": "eric@usebrace.com",
        "opener": (
            "Building a consumer health product means your content has to earn trust in a space "
            "where everyone is making the same wellness promises -- the brands that cut through "
            "are the ones with a specific, human point of view."
        ),
    },
]

SUBJECT = "AI content that doesn't sound like AI"


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
        h, flags=re.IGNORECASE,
    )

    h = re.sub(
        r'\bpersona\b',
        f'<a href="{PERSONA_URL}">persona</a>',
        h, flags=re.IGNORECASE,
    )

    return (
        '<!DOCTYPE html><html><head><meta charset="utf-8"></head>'
        '<body style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#222;">'
        f'{h}'
        '</body></html>'
    )


def send_email(smtp, r, plain, html):
    msg = MIMEMultipart("alternative")
    msg["Subject"]   = SUBJECT
    msg["From"]      = f"Dumebi Okolo <{FROM_EMAIL}>"
    msg["To"]        = f"{r['name']} <{r['email']}>"
    msg["Reply-To"]  = FROM_EMAIL
    msg.attach(MIMEText(plain, "plain", "utf-8"))
    msg.attach(MIMEText(html,  "html",  "utf-8"))
    smtp.sendmail(FROM_EMAIL, r["email"], msg.as_string())


def main():
    total = len(RECIPIENTS)
    print(f"Retrying {total} failed recipients.\n")

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
