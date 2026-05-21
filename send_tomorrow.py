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

DELAY_BETWEEN_SENDS = 60

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

SUBJECT = "AI content that doesn't sound like AI"

# ── 6 retries from yesterday ───────────────────────────────────────────────
RETRIES = [
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

# ── 51 new contacts ────────────────────────────────────────────────────────
NEW_CONTACTS = [
    {
        "name": "Amar",
        "email": "amar@aivdigital.com",
        "opener": (
            "Building a digital media company around AI means your own content has to prove the "
            "thesis before the pitch even starts -- any AI-generated output in your marketing "
            "actively undermines the case you're making."
        ),
    },
    {
        "name": "Siddharth",
        "email": "siddharth@dresma.com",
        "opener": (
            "AI product photography is a space where the before-and-after speaks for itself -- "
            "but the content explaining why it works still has to sound like someone who "
            "understands e-commerce, not a press release."
        ),
    },
    {
        "name": "Farhan",
        "email": "farhan.wazir@cideator.com",
        "opener": (
            "A company built on creative ideation has a particularly high bar for its own content -- "
            "every piece you ship is an implicit demonstration of what creative thinking "
            "actually looks like in practice."
        ),
    },
    {
        "name": "Ivan",
        "email": "ivan@writehuman.ai",
        "opener": (
            "WriteHuman is literally solving the problem of AI content that sounds like AI -- "
            "your own marketing has to be the proof of concept, not just the pitch."
        ),
    },
    {
        "name": "Johannes",
        "email": "johannes.jacop@yatta.de",
        "opener": (
            "Project management software is one of the most competitive SaaS categories -- "
            "the content that cuts through sounds like it was written by someone who's actually "
            "missed a deadline, not someone who's read the feature list."
        ),
    },
    {
        "name": "Tudor",
        "email": "tudor@sosha.ai",
        "opener": (
            "Building a social media tool means every platform you're on is a live demo of your "
            "product thesis -- if the content doesn't sound authentic, the product promise "
            "falls apart before the trial."
        ),
    },
    {
        "name": "Vaibhav",
        "email": "vaibhav@predixion.ai",
        "opener": (
            "Predictive AI products live in a space where the audience is skeptical by design -- "
            "the content explaining what the product does has to be as precise as the "
            "predictions it's making."
        ),
    },
    {
        "name": "Kshitij",
        "email": "shibi@synfiction.ai",
        "opener": (
            "Building an AI fiction platform means your product is literally about voice and "
            "narrative -- the content you ship about it has to reflect that same creative "
            "intelligence, not flatten it into a feature list."
        ),
    },
    {
        "name": "Mark",
        "email": "mark@agency.pizza",
        "opener": (
            "Running a tool for agencies means your audience is full of people who get paid "
            "to evaluate content quality -- they'll know immediately if your own marketing "
            "was generated."
        ),
    },
    {
        "name": "Gertjan",
        "email": "gertjan@apideck.com",
        "opener": (
            "Building an API integration platform means your audience is technical enough to "
            "dismiss content that doesn't reflect real developer experience -- the writing has "
            "to earn the credibility the product depends on."
        ),
    },
    {
        "name": "Vincent",
        "email": "vince@trybe.do",
        "opener": (
            "Building a community product means your content strategy is always visible to the "
            "exact audience you're trying to win -- any drop in authenticity is immediately "
            "obvious to the people who care most."
        ),
    },
    {
        "name": "Cole",
        "email": "cole@bytezza.com",
        "opener": (
            "Tezza built its following on a specific aesthetic sensibility -- every piece of "
            "content you ship either reinforces that brand identity or dilutes it."
        ),
    },
    {
        "name": "Per",
        "email": "pjj@sociuu.com",
        "opener": (
            "A social media management platform has a unique meta-problem -- every piece of "
            "content you ship about it is itself a social post that has to actually land."
        ),
    },
    {
        "name": "Stuart",
        "email": "stuart@hail.to",
        "opener": (
            "Building a communication tool means the way you communicate about it is always "
            "the most visible demonstration of your product values -- and the hardest thing "
            "to fake."
        ),
    },
    {
        "name": "Chris",
        "email": "chris@mindpal.co",
        "opener": (
            "A second brain product is built on the premise that better information management "
            "leads to better thinking -- the content you ship about it has to reflect that same "
            "clarity, not add to the noise."
        ),
    },
    {
        "name": "Jack",
        "email": "jack@meisteritsystems.com",
        "opener": (
            "IT services companies are often technically excellent and content-invisible -- the "
            "ones that build inbound pipelines are the ones that finally develop a recognizable "
            "voice and publish it consistently."
        ),
    },
    {
        "name": "Nazzareno",
        "email": "nazzareno.gorni@growens.io",
        "opener": (
            "Running an email marketing platform means you understand better than anyone how much "
            "subject lines and body copy matter -- the content you ship about Growens has to "
            "live up to that same standard."
        ),
    },
    {
        "name": "Ofir",
        "email": "ofir@communipass.com",
        "opener": (
            "Building a community access product means your content has to speak to managers "
            "who are already drowning in tools -- and only lands if it sounds like it came from "
            "someone who's actually run an event or managed a member list."
        ),
    },
    {
        "name": "Lara",
        "email": "lara@usetwirl.com",
        "opener": (
            "Building a content platform for creators means your own content strategy has to "
            "model what great creator content looks like -- if it doesn't, the product promise "
            "is undermined before the signup."
        ),
    },
    {
        "name": "Omry",
        "email": "omry@cockpit-ai.com",
        "opener": (
            "An AI operations product called Cockpit is making a promise about control and "
            "clarity -- the content you ship about it has to reflect that same discipline, "
            "not read like an AI wrote it."
        ),
    },
    {
        "name": "Gustav",
        "email": "gustav@adlystudios.com",
        "opener": (
            "Influencer marketing platforms are evaluated by people who've seen every kind of "
            "pitch -- the content that earns their attention sounds like it was written by "
            "someone who actually understands creator economics."
        ),
    },
    {
        "name": "Lisane",
        "email": "lisane@niara.ai",
        "opener": (
            "Building an AI product means your content has to do double duty -- convincing "
            "technical buyers that the AI is sound and business buyers that the problem is real. "
            "Generic content fails both simultaneously."
        ),
    },
    {
        "name": "Maryliz",
        "email": "maryliz@goodpix.co",
        "opener": (
            "A visual product has a constant content challenge -- the written marketing has to "
            "match the visual standard the product sets, which is a bar most AI-generated "
            "copy doesn't clear."
        ),
    },
    {
        "name": "Anand",
        "email": "anand@technogise.com",
        "opener": (
            "Custom software consultancies live and die by their ability to communicate expertise -- "
            "the ones that win the right clients are the ones whose thought leadership sounds "
            "like it came from engineers who've actually solved the problems they're writing about."
        ),
    },
    {
        "name": "Ergys",
        "email": "ergys.gega@virtual.al",
        "opener": (
            "Building a tech company in Albania means doing something genuinely contrarian -- "
            "the content you ship needs to reflect that same independence, not sound like "
            "it was written by a content agency in San Francisco."
        ),
    },
    {
        "name": "Kenz",
        "email": "kenz@mochimin.com",
        "opener": (
            "Consumer brand content lives or dies on personality -- and personality is exactly "
            "what generic AI writing strips out first."
        ),
    },
    {
        "name": "Amay",
        "email": "amay@zikhara.ai",
        "opener": (
            "Building an AI product means you're in a market where everyone is claiming the same "
            "capabilities -- the content that cuts through explains specifically what makes yours "
            "different, in a voice that doesn't sound like the others."
        ),
    },
    {
        "name": "Aurimas",
        "email": "aurimas@swirlai.com",
        "opener": (
            "AI data tools require content that can translate between the technical buyer who'll "
            "build with it and the business buyer who'll fund it -- generic AI content fails "
            "both audiences simultaneously."
        ),
    },
    {
        "name": "Vinodh",
        "email": "vinodh@aroratechsolutions.com",
        "opener": (
            "Technology consulting firms often have deep expertise and thin content -- the ones "
            "that build inbound pipelines are the ones that commit to thought leadership that "
            "sounds like it came from the engineers doing the actual work."
        ),
    },
    {
        "name": "Raghav",
        "email": "raghav@animaker.com",
        "opener": (
            "Animaker has built one of the largest no-code animation audiences in the world -- "
            "that kind of scale requires content that can speak to a professional animator and "
            "a first-time user at the same time."
        ),
    },
    {
        "name": "Damian",
        "email": "dchen@getdms.com",
        "opener": (
            "Document management is one of those enterprise categories where the content is "
            "usually indistinguishable from a spec sheet -- the companies that win are the ones "
            "that finally explain the problem in plain, specific language."
        ),
    },
    {
        "name": "Ryo",
        "email": "r-suzuki@oz-vision.co.jp",
        "opener": (
            "Building a vision AI company out of Japan means your content has to work for a "
            "global audience while reflecting a genuinely different product perspective -- "
            "that's a localization challenge AI writing tools almost always get wrong."
        ),
    },
    {
        "name": "Rajan",
        "email": "rajan@easelapps.ai",
        "opener": (
            "Building an AI design product means the visual output speaks for itself -- but the "
            "content explaining why the AI makes better design decisions still has to sound "
            "like someone who understands design thinking, not a feature announcement."
        ),
    },
    {
        "name": "Samuel",
        "email": "samuel@brandninja.ai",
        "opener": (
            "A branding product has a unique credibility problem -- if your own brand voice "
            "isn't sharp, the pitch for helping others with theirs falls apart before "
            "the conversation starts."
        ),
    },
    {
        "name": "Polo",
        "email": "polo@wiwo.me",
        "opener": (
            "Building a work platform means your content has to resonate with founders and "
            "HR teams simultaneously -- two audiences with very different expectations for "
            "what sounds credible."
        ),
    },
    {
        "name": "Landon",
        "email": "landon@automatearsenal.com",
        "opener": (
            "An automation product has a unique content challenge -- you need to make efficiency "
            "feel exciting without making it sound like you're replacing the people "
            "reading the email."
        ),
    },
    {
        "name": "Patrick",
        "email": "patrick@sideko.dev",
        "opener": (
            "A product called Port of Context is making a specific promise about clarity and "
            "information -- the content you ship has to live up to that promise, not add "
            "to the noise it's trying to cut through."
        ),
    },
    {
        "name": "Joachim",
        "email": "joachim@fapshi.com",
        "opener": (
            "Building a payment platform in Cameroon means navigating both the technical "
            "complexity of African payment infrastructure and an audience skeptical of another "
            "fintech promise -- the content that earns trust sounds like it was written by "
            "someone who's actually tried to send money across borders."
        ),
    },
    {
        "name": "Fabrice",
        "email": "fabrice@adamik.io",
        "opener": (
            "Web3 infrastructure content has a particularly hard job -- it has to be technically "
            "precise enough for developers while being accessible enough for the broader "
            "ecosystem. Generic AI fails at both ends of that range."
        ),
    },
    {
        "name": "Augustus",
        "email": "augustusm@relworx.com",
        "opener": (
            "Building HR and payroll infrastructure for African markets means your content has "
            "to address a context that most Western HR software writing completely ignores -- "
            "the specificity is the advantage if the writing reflects it."
        ),
    },
    {
        "name": "Cagri",
        "email": "merhaba@cagrisarigoz.com",
        "opener": (
            "Running a personal brand consultancy means the bar for your own content is set "
            "by what you charge clients to achieve -- anything that sounds generated undermines "
            "the offer before the conversation starts."
        ),
    },
    {
        "name": "Erik",
        "email": "erik@wilgot.ai",
        "opener": (
            "Building an AI product means your content is always operating in a space where "
            "your audience has already seen a hundred AI pitches -- the ones that land sound "
            "like they came from someone who actually uses the thing they built."
        ),
    },
    {
        "name": "Ben",
        "email": "ben@serialprogressseeker.com",
        "opener": (
            "A brand called Serial Progress Seeker is built entirely on personal voice -- "
            "the moment the content stops sounding like you and starts sounding like a template, "
            "the audience has no reason to follow."
        ),
    },
    {
        "name": "Ami",
        "email": "ami@vylitworld.com",
        "opener": (
            "Building a creator platform means your own content strategy is always the most "
            "visible proof of concept you have -- if it doesn't model what great creator "
            "content looks like, the product pitch falls apart."
        ),
    },
    {
        "name": "Artsiom",
        "email": "artsiom@genpeach.ai",
        "opener": (
            "Building a generative AI product means your own marketing is the first thing "
            "people will use to evaluate whether your AI output is actually good -- generic "
            "content actively undermines the credibility of the product."
        ),
    },
    {
        "name": "Rennie",
        "email": "rennie@leapshq.com",
        "opener": (
            "Building a content marketing platform in Nigeria means operating at the intersection "
            "of one of Africa's most dynamic startup ecosystems and a global content market built "
            "around Western defaults -- the specificity of your context is exactly what the "
            "content needs to reflect."
        ),
    },
    {
        "name": "Giorgi",
        "email": "main@skrib.com",
        "opener": (
            "Building a writing tool means the content you ship about it is always an implicit "
            "demonstration of what good writing looks like -- any generic output in your own "
            "marketing contradicts the product's reason for existing."
        ),
    },
    {
        "name": "Wee",
        "email": "quek@mhub.my",
        "opener": (
            "PropTech content has to navigate a uniquely skeptical audience -- real estate "
            "professionals who've seen every software pitch and need to see genuine domain "
            "expertise before they'll consider a new tool."
        ),
    },
    {
        "name": "Amin",
        "email": "amin.rashwan@notnice.io",
        "opener": (
            "A company called Not Nice is already making a brand promise about being direct -- "
            "the content you ship has to live up to that same edge without tipping into "
            "shock value."
        ),
    },
    {
        "name": "Salomon",
        "email": "salo@givechariot.com",
        "opener": (
            "Nonprofit tech content has a dual credibility challenge -- it has to earn trust "
            "from mission-driven organizations while also demonstrating the technical rigor "
            "that makes the product reliable. Generic content sounds like neither."
        ),
    },
    {
        "name": "Kevin",
        "email": "kevin.pham@weallnet.com",
        "opener": (
            "Building a network platform means the content you ship has to model the kind of "
            "connection and community you're promising your users -- if it doesn't feel human, "
            "the product promise is undermined before anyone signs up."
        ),
    },
]

RECIPIENTS = RETRIES + NEW_CONTACTS


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
    msg["Subject"]  = SUBJECT
    msg["From"]     = f"Dumebi Okolo <{FROM_EMAIL}>"
    msg["To"]       = f"{r['name']} <{r['email']}>"
    msg["Reply-To"] = FROM_EMAIL
    msg.attach(MIMEText(plain, "plain", "utf-8"))
    msg.attach(MIMEText(html,  "html",  "utf-8"))
    smtp.sendmail(FROM_EMAIL, r["email"], msg.as_string())


def connect():
    smtp = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT)
    smtp.login(FROM_EMAIL, APP_PASSWORD)
    return smtp


def main():
    total = len(RECIPIENTS)
    print(f"Sending to {total} recipients ({len(RETRIES)} retries + {len(NEW_CONTACTS)} new).\n")

    sent, failed = [], []
    smtp = connect()
    print("Logged in to Zoho Mail.\n")

    for i, r in enumerate(RECIPIENTS, 1):
        tag = "[RETRY]" if i <= len(RETRIES) else "[NEW]  "
        body  = build_body(r["opener"])
        plain = make_plain(body)
        html  = make_html(body)

        try:
            send_email(smtp, r, plain, html)
            print(f"[{i}/{total}] {tag} SENT  -> {r['name']} <{r['email']}>")
            sent.append(r["email"])
        except smtplib.SMTPServerDisconnected:
            # Reconnect and retry once
            try:
                smtp = connect()
                send_email(smtp, r, plain, html)
                print(f"[{i}/{total}] {tag} SENT  -> {r['name']} <{r['email']}> (reconnected)")
                sent.append(r["email"])
            except Exception as e:
                print(f"[{i}/{total}] {tag} FAIL  -> {r['name']} <{r['email']}>: {e}")
                failed.append((r["email"], str(e)))
        except Exception as e:
            print(f"[{i}/{total}] {tag} FAIL  -> {r['name']} <{r['email']}>: {e}")
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
