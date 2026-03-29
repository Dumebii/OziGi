"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import AuthModal from "../components/AuthModal";
import PricingCards from "../components/PricingCards";
import { supabase } from "@/lib/supabase/client";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="bg-brand-offwhite font-sans text-slate-900 min-h-screen flex flex-col overflow-hidden">
      <Header session={session} onSignIn={() => setIsAuthModalOpen(true)} />
      <main className="flex-1">
        <Hero />

        {/* How It Works */}
        <section className="py-20 md:py-28 bg-white border-b border-slate-200/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-offwhite via-transparent to-transparent opacity-40" />
          <div className="relative max-w-6xl mx-auto px-6 z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={fadeUp}
              className="text-center mb-16 md:mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-brand-navy mb-4">
                From chaos to clarity
              </h2>
              <p className="text-slate-500 font-medium text-lg">
                Your voice. Your insights. Polished and ready.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
            >
              {[
                {
                  number: 1,
                  title: "Feed raw material",
                  desc: "Paste a URL, paste meeting notes, upload a PDF. No need to clean it up. Ozigi strips the noise and extracts what matters.",
                },
                {
                  number: 2,
                  title: "Your voice applies",
                  desc: "Set your persona once. Technical depth, tone, pacing, banned phrases—the engine locks in your style and enforces it perfectly every time.",
                },
                {
                  number: 3,
                  title: "Ship everywhere",
                  desc: "Post to X, LinkedIn, Discord, email, or Slack directly. One click. Your content reaches your audience sounding exactly like you.",
                },
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="bg-white rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 p-6 md:p-10 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-red/10 to-brand-navy/10 rounded-2xl flex items-center justify-center text-2xl font-black text-brand-red mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-brand-navy mb-4">
                    {step.title}
                  </h3>
                  <p className="text-base text-slate-600 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Human-in-the-Loop Callout */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="w-full max-w-6xl mx-auto px-6 py-20"
        >
          <div className="rounded-3xl bg-gradient-to-br from-brand-navy to-slate-800 p-8 md:p-14 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl" />
            <div className="max-w-2xl space-y-4 relative z-10">
              <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
                AI does the heavy lifting. <br className="hidden md:block" />
                You add the secret sauce.
              </h3>
              <p className="text-slate-300 font-medium text-lg leading-relaxed">
                Every post comes with an edit button. Add the insider detail, the specific story,
                the personal take that only you can make. Publish when it feels authentically yours.
              </p>
            </div>
            <Link
              href="/docs#human-in-the-loop"
              className="whitespace-nowrap rounded-xl bg-white text-brand-navy px-8 py-4 text-sm font-black uppercase tracking-widest shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all relative z-10"
            >
              See how it works →
            </Link>
          </div>
        </motion.section>

        {/* The Moat: Chaos In, Strategy Out */}
        <section className="w-full max-w-6xl mx-auto py-20 md:py-28 px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter text-brand-navy mb-12 text-center"
            >
              The difference between sounding human and sounding like a chatbot
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8 w-full items-stretch">
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="rounded-3xl bg-white border-2 border-slate-200 p-6 md:p-10 flex flex-col items-center shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="text-xl font-black italic uppercase tracking-tighter text-slate-500 mb-6">
                  🤖 Standard AI Output
                </div>
                <div className="w-full min-h-[14rem] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 italic mb-6 border border-slate-300 p-6 text-center text-sm font-medium leading-relaxed">
                  "Here are 5 key takeaways from this PDF about Scaling automation. Number 1 will shock you! 🚀 In conclusion, AI is changing the landscape of development for everyone..."
                </div>
                <div className="rounded-full bg-red-100 px-4 py-1.5 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-200">
                  Sounds like a template
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="rounded-3xl bg-gradient-to-br from-brand-navy/5 via-white to-brand-red/5 border-2 border-brand-red/20 p-6 md:p-10 flex flex-col items-center shadow-lg hover:shadow-2xl transition-all relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-red/5 rounded-full blur-2xl" />
                <div className="text-xl font-black italic uppercase tracking-tighter text-indigo-600 mb-6">
                  ⚡ The Ozigi Engine
                </div>
                <div className="w-full min-h-[14rem] bg-white rounded-2xl flex flex-col md:flex-row items-stretch text-slate-700 mb-6 border border-indigo-100 shadow-sm overflow-hidden text-xs sm:text-sm font-medium">
                  <div className="flex-1 p-5 border-b md:border-b-0 md:border-r border-indigo-50 bg-indigo-50/30 flex items-center justify-center text-center italic text-slate-500">
                    [ Well-structured thread with your actual technical insights, pacing, and tone. No emojis or robotic conclusions. ]
                  </div>
                  <div className="flex-1 p-5 flex items-center justify-start bg-white text-slate-900 leading-relaxed">
                    <span>
                      Scaling automation requires treating test code like production code. Poor architecture, like ignoring POM or SOLID, sinks suites faster than flaky environments. Data management is non-negotiable.
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-brand-red/10 px-4 py-1.5 text-sm font-bold text-brand-red ring-1 ring-inset ring-brand-red/20">
                  Sounds like a person
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Versatile Use Cases */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-white to-brand-offwhite">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={fadeUp}
              className="text-center mb-16 md:mb-24"
            >
              <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-brand-navy mb-4">
                Works for your world
              </h2>
              <p className="text-slate-500 font-medium text-lg">
                From technical founders to digital creators.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
            >
              {[
                {
                  title: "Developers & DevRel",
                  desc: "Turn messy API docs or release notes into polished X threads that actually engage developers. Keep the rigor, lose the jargon.",
                },
                {
                  title: "Founders & Leaders",
                  desc: "Take rough notes from a fundraising call or product meeting and generate thought leadership posts that move the needle on your go-to-market.",
                },
                {
                  title: "Educators & Trainers",
                  desc: "Upload your course slides or workshop deck. Ozigi pulls the core lessons and builds a multi-week campaign around them.",
                },
                {
                  title: "Creators & Writers",
                  desc: "Publish a podcast, drop a video, or post a newsletter. Ozigi reads it and generates hooks and follow-ups that sound like you.",
                },
              ].map((useCase, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-sm font-black uppercase tracking-widest text-brand-red mb-4">
                    Use Case {String(idx + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-brand-navy mb-4">
                    {useCase.title}
                  </h3>
                  <p className="text-lg text-slate-600 font-medium leading-relaxed">
                    {useCase.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-20 px-6 bg-white border-b border-slate-200/60">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUp}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-brand-navy">
                Built for speed, styled for authenticity
              </h2>
              <p className="text-slate-500 font-medium mt-4 max-w-2xl mx-auto">
                Skip the blank page. Skip the awkward AI language. Just ship.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  title: "Messy input welcome",
                  desc: "URLs, PDFs, voice notes, scattered thoughts—throw it all at Ozigi. It finds the signal in the noise.",
                },
                {
                  title: "Your voice locked in",
                  desc: "Define your persona once. Tone, depth, banned words, style—the engine enforces it flawlessly.",
                },
                {
                  title: "Instant publishing",
                  desc: "Ship to X, LinkedIn, Discord, email, Slack from your dashboard in seconds. No more context switching.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all"
                >
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-3 text-brand-navy">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-brand-offwhite to-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-brand-navy mb-4">
                Shipping faster, sounding smarter
              </h2>
              <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
                Real people. Real results. Real voice.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  name: "Priya Sharma",
                  role: "Senior Developer Advocate",
                  quote: "I paste my rough notes into Ozigi and get back a polished X thread that sounds like me, not a chatbot. It's the difference between shipping and not shipping.",
                  image: "/testimonials/priya.jpg",
                },
                {
                  name: "Marcus Chen",
                  role: "Technical Founder",
                  quote: "Before Ozigi, I'd spend two hours tweaking prompts and still sound like ChatGPT. Now I feed in rough thoughts and ship authentic posts in minutes.",
                  image: "/testimonials/marcus.jpg",
                },
                {
                  name: "Sarah Okonkwo",
                  role: "DevRel Lead",
                  quote: "Set my voice once. Now every post is on-brand, on-voice, and ready to go. My LinkedIn engagement tripled because I actually sound like me again.",
                  image: "/testimonials/sarah.jpg",
                },
              ].map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-100">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-black text-brand-navy">{testimonial.name}</h4>
                      <p className="text-xs text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed italic">"{testimonial.quote}"</p>
                  <div className="mt-6 flex text-brand-red">
                    {"★".repeat(5)}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-6 scroll-mt-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-brand-navy">
                No surprises. Just results.
              </h2>
              <p className="text-slate-500 font-medium mt-4">Try free forever. Scale when you ship.</p>
            </div>
            <PricingCards onOpenAuthModal={() => setIsAuthModalOpen(true)} />
          </div>
        </section>
      </main>
      <Footer />
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
}
