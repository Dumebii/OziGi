import Link from "next/link";
import Footer from "../../components/Footer";

export default function DocsPage() {
  return (
    <div className="bg-[#fafafa] font-sans text-slate-900 min-h-screen flex flex-col">
      {/* Minimal Docs Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-black italic uppercase tracking-tighter text-xl text-slate-900">
              Ozigi Docs
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm"
          >
            Go to Dashboard →
          </Link>
        </div>
      </header>

      {/* Docs Content */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 w-full">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
            Platform Documentation
          </h1>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            Ozigi is an intelligent context engine designed to cure "blank page syndrome" by bridging the gap between your raw research and structured social distribution.
          </p>
        </div>

        <div className="space-y-16">
          {/* Section 1: The Context Engine & Multimodal Ingestion */}
          <section>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 border-b-2 border-slate-100 pb-2 mb-6">
              1. Multimodal Ingestion
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-4">
              Unlike standard AI chatbots, Ozigi does not require prompt engineering on your end. Powered by Google's Gemini 2.5 Flash, the engine handles massive context windows so you can simply drop in your raw data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 font-medium mb-6">
              <li>
                <strong>URL Extraction:</strong> Paste a link to your blog post, GitHub PR, or API documentation.
              </li>
              <li>
                <strong>Raw Notes:</strong> Dump unformatted meeting transcripts or brain dumps directly into the text area.
              </li>
              <li>
                <strong>Document Uploads:</strong> Upload PDFs or images. Ozigi will natively extract the core narrative without you needing to summarize it first.
              </li>
            </ul>
          </section>

          {/* Section 2: The Banned Lexicon (DevRel Positioning) */}
          <section>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 border-b-2 border-slate-100 pb-2 mb-6">
              2. The Banned Lexicon (Anti-AI Constraints)
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-4">
              The primary differentiator of Ozigi is its aggressive stance against "AI-speak." Standard LLMs fall into predictable cadence patterns and vocabulary crutches.
            </p>
            <p className="text-slate-600 font-medium leading-relaxed mb-4">
              At the API route level, Ozigi intercepts the generation and enforces a strict <strong>Banned Lexicon</strong>. The engine is actively penalized for using words like:
            </p>
            <div className="bg-slate-900 text-red-400 p-6 rounded-2xl font-mono text-sm shadow-lg leading-relaxed">
              delve, testament, tapestry, crucial, vital, landscape, realm, unlock, supercharge, revolutionize, paradigm, seamlessly, robust...
            </div>
            <p className="text-slate-500 text-sm font-medium mt-4">
              This forces the model to bypass AI detection tools and generate highly bursty, pragmatic copy that sounds like a battle-tested professional.
            </p>
          </section>

          {/* Section 3: Custom Personas */}
          <section>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 border-b-2 border-slate-100 pb-2 mb-6">
              3. System Personas: Your Secret Weapon
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-4">
              Most users treat AI prompts as instructions ("Write a tweet about X"). Ozigi treats prompts as <strong>Editorial Briefs</strong>. Your Persona is the most powerful differentiator in the platform.
            </p>
            <p className="text-slate-600 font-medium leading-relaxed mb-6">
              Using the Settings modal, you can create and save multiple database-backed voice profiles. When writing your persona, do not describe what you want the AI to write; describe <strong>who the AI is</strong>, their attitude, and their formatting rules.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Bad Example */}
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <span className="text-red-700 font-black uppercase tracking-widest text-xs mb-2 block">
                  ❌ Weak Persona
                </span>
                <p className="font-mono text-sm text-slate-700 leading-relaxed">
                  "You are a helpful marketing assistant. Write engaging and professional posts about my software updates. Make sure to use emojis to make it fun."
                </p>
                <p className="text-xs text-slate-500 font-medium mt-4">
                  Result: Generic output, heavy reliance on buzzwords, sounds like an intern wrote it.
                </p>
              </div>

              {/* Good Example */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                <span className="text-green-400 font-black uppercase tracking-widest text-xs mb-2 block">
                  ✅ High-Impact Persona
                </span>
                <p className="font-mono text-sm text-slate-300 leading-relaxed">
                  "You are a pragmatic, battle-tested Staff Engineer. You speak directly, use dry humor, and absolutely despise corporate fluff. You prefer short, punchy sentences. You never apologize. You optimize for brutal clarity."
                </p>
                <p className="text-xs text-slate-400 font-medium mt-4">
                  Result: Authoritative, highly-readable content that commands respect and stops the scroll.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Publishing Integrations */}
          <section>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 border-b-2 border-slate-100 pb-2 mb-6">
              4. Publishing & Formatting
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-6">
              Ozigi does not post to your accounts without your final say. We
              use a combination of secure Web Intents and Webhooks to give you
              total control over the final published product.
            </p>
          </section>

          {/* Section 5: Native Image Generation (NEW) */}
          <section>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 border-b-2 border-slate-100 pb-2 mb-6">
              5. Native Image Generation
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-4">
              Social platforms prioritize multimodal content. Instead of forcing you to leave Ozigi to create graphics in Figma or Canva, the Context Engine features a built-in, platform-aware image generator.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white border-2 border-slate-200 p-6 rounded-[2rem] shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                  <span>🎨</span> Abstract vs. Text Graphics
                </h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Inside each generated campaign card, you have the option to generate a graphic. If you leave the input field blank, the engine will create an abstract, high-quality background. If you provide text (e.g., "3 Rules for API Design"), the engine will render that text directly onto the graphic.
                </p>
              </div>

              <div className="bg-slate-900 border-2 border-slate-900 p-6 rounded-[2rem] shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest text-white mb-3 flex items-center gap-2">
                  <span>🔗</span> Pipeline Integration
                </h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  Graphics are deeply integrated into the publishing flow. When you generate an image on a LinkedIn card and click "Publish," Ozigi executes a 3-step OAuth handshake to automatically upload and attach that specific image to your LinkedIn post.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Human-in-the-Loop & The Edit Button */}
          <section>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 border-b-2 border-slate-100 pb-2 mb-6">
              6. Human-in-the-Loop: The Final Polish
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-6">
              Ozigi is built on the belief that AI should be your <strong>co-pilot</strong>, not your replacement. While our engine handles the heavy lifting of extraction and structural drafting, the "Edit" button is the most critical tool in your arsenal.
            </p>

            <div className="bg-indigo-50 border-2 border-indigo-100 p-8 rounded-[2rem] mb-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h3 className="text-indigo-900 font-black uppercase tracking-widest text-sm mb-3">
                    The Collaborative Workflow
                  </h3>
                  <p className="text-indigo-800/80 text-sm font-medium leading-relaxed">
                    Ozigi generates "high-fidelity drafts"—posts that are 90% ready. That final 10% is where your unique expertise, current context, and personal flair live. By clicking the <strong>Edit</strong> icon on any campaign card, you take the wheel to add that specific piece of "insider knowledge" only a human can provide.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-indigo-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </div>
                  <span className="font-black italic uppercase text-slate-900 tracking-tighter">The "Edit" Factor</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="space-y-2">
                <span className="text-slate-400 font-black text-xs uppercase tracking-widest">Phase 1</span>
                <h4 className="font-bold text-slate-900">AI Synthesis</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Ozigi processes your raw research and applies the Banned Lexicon to create a pragmatic, "AI-less" draft.</p>
              </div>
              <div className="space-y-2">
                <span className="text-indigo-500 font-black text-xs uppercase tracking-widest">Phase 2</span>
                <h4 className="font-bold text-slate-900">Human Polish</h4>
                <p className="text-xs text-slate-500 leading-relaxed">You use the Edit button to inject specific technical nuances, jokes, or project-specific details.</p>
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 font-black text-xs uppercase tracking-widest">Phase 3</span>
                <h4 className="font-bold text-slate-900">Distribution</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Once the draft matches your standard of excellence, you trigger the secure Web Intent or Webhook.</p>
              </div>
            </div>
            
            {/* Publishing Integrations Continued */}
            <div className="space-y-8">
              {/* X / Twitter Sub-section */}
              <div>
                <h3 className="text-lg font-black uppercase tracking-widest text-slate-900 mb-2 flex items-center gap-2">
                  <span className="text-slate-900 text-2xl">𝕏</span> X (Twitter)
                  Web Intents
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-4 text-sm">
                  To ensure you can review character limits and add media, Ozigi
                  uses <strong>Twitter Web Intents</strong>. When you click
                  "Publish" for an X post, we instantly compile your generated text and pop open
                  a new Twitter tab with your content pre-loaded and ready to
                  tweet.
                </p>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-2">
                    Threads vs. Singles
                  </h4>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    Inside the Context Engine, you can toggle your X output
                    between a <strong>Single Tweet</strong> or a full{" "}
                    <strong>Thread</strong>. Ozigi's AI is explicitly trained to
                    architect technical threads with proper numbering (1/5,
                    etc.) and line breaks.
                  </p>
                </div>
              </div>

              {/* Discord Sub-section */}
              <div className="bg-white border-2 border-slate-200 p-6 sm:p-8 rounded-[2rem] shadow-sm mt-8">
                <h3 className="text-lg font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-[#5865F2] text-2xl">👾</span> Discord
                  Webhook Setup
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-6 text-sm">
                  To let Ozigi automatically drop campaign drafts into your
                  Discord, you just need a Webhook URL. It takes exactly 15
                  seconds to create one:
                </p>
                <ol className="list-decimal pl-5 space-y-3 text-sm text-slate-700 font-medium font-sans marker:text-slate-400 marker:font-black">
                  <li>
                    Open your Discord server and click your{" "}
                    <strong>Server Name</strong> in the top left corner.
                  </li>
                  <li>
                    Select <strong>Server Settings</strong> from the dropdown
                    menu.
                  </li>
                  <li>
                    In the left sidebar, click on <strong>Integrations</strong>,
                    then click <strong>Webhooks</strong>.
                  </li>
                  <li>
                    Click the <strong>New Webhook</strong> button.
                  </li>
                  <li>
                    Give your webhook a name (like "Ozigi Bot") and select the
                    specific channel where you want your posts to land.
                  </li>
                  <li>
                    Click <strong>Copy Webhook URL</strong> and hit Save.
                  </li>
                  <li>
                    Paste that URL directly into your Ozigi Settings modal.
                    You're done! 🚀
                  </li>
                </ol>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}