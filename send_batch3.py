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
        "name": "Josiah",
        "email": "josiah@movabletype.ai",
        "opener": (
            "Movable Type as a name signals a thesis about content and publishing from the start -- "
            "the writing you ship about your AI has to be as intentional as the product itself."
        ),
    },
    {
        "name": "Fab",
        "email": "fab@99ravens.ai",
        "opener": (
            "Building under the SALT umbrella means operating at the intersection of enterprise "
            "credibility and startup speed -- your content has to hold up in both rooms."
        ),
    },
    {
        "name": "Tatenda",
        "email": "tatenda@imalipay.com",
        "opener": (
            "Building a payments product for African markets means your content has to work in a "
            "space where most fintech writing was designed for Western audiences -- the specificity "
            "of your context is exactly what generic AI strips out."
        ),
    },
    {
        "name": "Nicolas",
        "email": "nico@daptatech.com",
        "opener": (
            "Building an integration product means your content has to speak to both the technical "
            "buyer who'll implement it and the business buyer who'll sign off -- that dual clarity "
            "is exactly what generic AI writing flattens."
        ),
    },
    {
        "name": "Rizwan",
        "email": "rizwan@zeroshq.com",
        "opener": (
            "Building at Zeros means you're in a space where the category definition is still being "
            "written -- whoever publishes the clearest, most consistent content owns the narrative first."
        ),
    },
    {
        "name": "Patrick",
        "email": "patrick@p3ncil.com",
        "opener": (
            "A product built around creation and expression has a particularly high bar for its own "
            "marketing -- the writing you ship about P3NCIL has to feel as intentional as the tools "
            "you're giving your users."
        ),
    },
    {
        "name": "Yasaman",
        "email": "yasi@frontdoor.xyz",
        "opener": (
            "Otio is built for people who read seriously -- your audience will immediately notice "
            "if the content you publish about it was stitched together by an AI rather than written "
            "by someone who actually uses it."
        ),
    },
    {
        "name": "Jacques",
        "email": "jacques@ideajudge.org",
        "opener": (
            "A platform for evaluating ideas has a particularly high bar for its own content -- "
            "every piece you publish is implicitly making the case that your judgment is sound."
        ),
    },
    {
        "name": "Jeff",
        "email": "jeff@outlever.com",
        "opener": (
            "Building a leverage tool means the content you ship about it has to demonstrate the "
            "leverage -- generic marketing copy actively undermines a product promise built on "
            "doing more with less."
        ),
    },
    {
        "name": "Ed",
        "email": "ed.rogers@akumina.com",
        "opener": (
            "Digital workplace platforms live inside enterprises where every communication has to "
            "earn attention -- the content you ship about Akumina has to reflect that same discipline, "
            "not sound like it came from a content calendar."
        ),
    },
    {
        "name": "Alex",
        "email": "alex@zweelie.com",
        "opener": (
            "Building a community product means your own online presence has to feel like a "
            "community, not a broadcast -- that requires content that sounds like a person, "
            "not a scheduler."
        ),
    },
    {
        "name": "James",
        "email": "james@payloadcms.com",
        "opener": (
            "Payload has become one of the most-discussed headless CMS options in the developer "
            "community -- that reputation was built by shipping content that actually respects how "
            "developers evaluate tools, not how vendors want them to."
        ),
    },
    {
        "name": "Zach",
        "email": "azizul@lekir.tech",
        "opener": (
            "Building a tech company in Malaysia means navigating a market where most developer "
            "tools and content were designed with North American audiences in mind -- your local "
            "context is a competitive advantage if the content reflects it."
        ),
    },
    {
        "name": "Bartu",
        "email": "bartu@gappsy.com",
        "opener": (
            "A no-code product lives in a space flooded with near-identical pitches -- the content "
            "that cuts through sounds like it was written by someone who actually understands why "
            "people struggle to build software, not someone summarizing the feature list."
        ),
    },
    {
        "name": "Senthil",
        "email": "senthil.nathan@ailaysa.com",
        "opener": (
            "Building an AI translation platform means you understand better than most how much "
            "voice gets lost when content moves across languages -- the same problem exists when "
            "it moves across formats."
        ),
    },
    {
        "name": "Corey",
        "email": "corey@splitzapp.co",
        "opener": (
            "A consumer fintech product in the expense-splitting space means your content has to "
            "make a mundane problem feel worth solving -- that requires writing that feels human "
            "and specific, not clinical and templated."
        ),
    },
    {
        "name": "Ivan",
        "email": "ivan@theevenstar.net",
        "opener": (
            "A company called The Evenstar suggests you're building something with a long view -- "
            "the content you ship about it should reflect that same sense of intention, not sound "
            "like it was generated to fill a content calendar."
        ),
    },
    {
        "name": "Pratyush",
        "email": "pratyush@foyer.work",
        "opener": (
            "Building an AI assistant product means your own marketing has to demonstrate what "
            "good AI output actually looks like -- any trace of generic content in your own copy "
            "makes Merlin a harder sell."
        ),
    },
    {
        "name": "Eboni",
        "email": "eboni@ebi-labs.com",
        "opener": (
            "Running a labs company means you're constantly shipping experiments into the world -- "
            "the content about each one has to be sharp enough to earn attention without a "
            "big brand behind it."
        ),
    },
    {
        "name": "Cole",
        "email": "cole@hedrick.io",
        "opener": (
            "Building a design-forward product means the visual communication is always on -- "
            "but the written content marketing is where most design-led companies fall flat, "
            "because the same craft standards don't get applied."
        ),
    },
    {
        "name": "Merideth",
        "email": "merideth@splitzbedding.com",
        "opener": (
            "A DTC bedding brand lives in a space where every competitor is running the same "
            "'sleep better' content -- the brands that break through are the ones that sound "
            "like a person with a specific point of view, not a category."
        ),
    },
    {
        "name": "Totte",
        "email": "totte.jonsson@cevoid.com",
        "opener": (
            "A UGC platform for e-commerce means your whole product thesis is that authentic "
            "content outperforms branded content -- your own marketing has to make the same case, "
            "or the pitch contradicts itself."
        ),
    },
    {
        "name": "Adam",
        "email": "adam@kahana.co",
        "opener": (
            "Knowledge-sharing products need content that demonstrates the thing they're selling -- "
            "if the writing you ship doesn't reflect genuine expertise, the product promise "
            "falls apart before the demo."
        ),
    },
    {
        "name": "Ken",
        "email": "ken@getcontentsports.com",
        "opener": (
            "Sports content has some of the most engaged audiences in media -- and the most loyal "
            "fans can immediately tell when the writing was generated rather than felt."
        ),
    },
    {
        "name": "Melissa",
        "email": "melissa@outlever.com",
        "opener": (
            "Co-founding a leverage tool means you're in the business of making effort go further -- "
            "the content you ship about Outlever has to demonstrate that same efficiency without "
            "losing the human voice behind it."
        ),
    },
    {
        "name": "Manuel",
        "email": "manuel.grosrenaud@saas-production.com",
        "opener": (
            "Running a SaaS production company means you're building multiple products "
            "simultaneously -- the content for each one has to sound distinct enough to "
            "stand on its own, in its own voice."
        ),
    },
    {
        "name": "Vinay",
        "email": "vinay@lsssoftware.com",
        "opener": (
            "Enterprise software companies often have the most technically credible products and "
            "the most generic content -- the gap between what the product does and how it's "
            "explained is where deals get lost."
        ),
    },
    {
        "name": "Sawan",
        "email": "sawan@webmavens.com",
        "opener": (
            "A web development agency's content is always a live portfolio of what you can build -- "
            "generic AI writing actively undermines the craftsmanship argument you're making "
            "with every project you ship."
        ),
    },
    {
        "name": "Morten",
        "email": "morten@worksome.com",
        "opener": (
            "Worksome sits at the intersection of HR and the future of work -- a space where "
            "everyone is publishing thought leadership and almost none of it sounds like it came "
            "from someone who's actually managed a contractor workforce."
        ),
    },
    {
        "name": "Roman",
        "email": "roman.kapiy@metacarbon.com",
        "opener": (
            "Climate tech content has a credibility problem -- most of it reads like marketing "
            "dressed up as impact reporting. The companies that cut through are the ones whose "
            "writing sounds like the founder actually wrote it."
        ),
    },
    {
        "name": "Zaka",
        "email": "zaka@deltadroplet.com",
        "opener": (
            "Building cloud infrastructure means your audience is technical enough to immediately "
            "dismiss content that doesn't reflect real operational experience -- the writing has "
            "to earn the trust the product depends on."
        ),
    },
    {
        "name": "Karamjit",
        "email": "karamjit@digitalnewsasia.com",
        "opener": (
            "Running a tech news platform in Asia means your editorial credibility is everything -- "
            "and in a market where AI-generated content is flooding the zone, the publications "
            "that sound human will be the ones that survive."
        ),
    },
    {
        "name": "Lina",
        "email": "lina@lemonslice.com",
        "opener": (
            "Building a creative product means the bar for your own creative output -- including "
            "the writing -- is set by the product itself. Anything that sounds templated "
            "contradicts the pitch before the user even signs up."
        ),
    },
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
    print(f"Sending to {total} recipients.\n")

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
