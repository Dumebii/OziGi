export default function BentoGrid() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-24">
      {/* Section Header */}
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
        <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">
          Built for Content Engineers.
        </h2>
        <p className="text-sm md:text-base font-bold text-slate-500 uppercase tracking-widest max-w-2xl mx-auto">
          We stripped out the chat UI and built a structured engine to turn your
          raw research into ready-to-ship campaigns.
        </p>
      </div>

      {/* The Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,_auto)]">
        {/* 📦 Box 1: Wide (Zero Prompt Engineering) */}
        <div className="md:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-12 border-2 border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-red-200 transition-colors">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700"></div>
          <div className="relative z-10 h-full flex flex-col justify-center">
            <span className="text-4xl mb-6 block">🧠</span>
            <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">
              Zero Prompt Engineering
            </h3>
            <p className="text-slate-600 font-medium leading-relaxed max-w-lg text-sm md:text-base">
              Ozigi handles the complex system prompts under the hood. You just
              provide the raw technical facts, and our engine enforces strict
              stylistic constraints to bypass AI detection and eliminate cheesy
              buzzwords.
            </p>
          </div>
        </div>

        {/* 📦 Box 2: Square (Content as Code) */}
        <div className="md:col-span-1 bg-slate-900 rounded-[2.5rem] p-8 border-2 border-slate-800 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-slate-800 rounded-full blur-2xl -mr-10 -mb-10 transition-transform group-hover:scale-125 duration-700"></div>
          <div className="relative z-10 h-full flex flex-col justify-center">
            <span className="text-3xl mb-4 block">💻</span>
            <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white mb-3">
              Content As Code
            </h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              Docs as code? Meet content as code. Stop wrestling with
              unpredictable AI chat interfaces and start engineering structured,
              multi-platform social campaigns designed for technical writers.
            </p>
          </div>
        </div>

        {/* 📦 Box 3: Square (Multiple Voices) */}
        <div className="md:col-span-1 bg-red-700 rounded-[2.5rem] p-8 border-2 border-red-800 shadow-xl relative overflow-hidden group hover:bg-red-600 transition-colors">
          <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/50 rounded-full blur-2xl -ml-10 -mt-10 transition-transform group-hover:scale-125 duration-700"></div>
          <div className="relative z-10 h-full flex flex-col justify-center">
            <span className="text-3xl mb-4 block">🗣️</span>
            <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white mb-3">
              Multiple Voices
            </h3>
            <p className="text-red-100 font-medium text-sm leading-relaxed">
              Train Ozigi on specific styles. Switch seamlessly between your
              "Snarky Developer" persona and your "Corporate Educator" persona
              with a single click.
            </p>
          </div>
        </div>

        {/* 📦 Box 4: Wide (Discord Integration) */}
        {/* 📦 Box 4: Wide (Multi-Platform Integration) */}
        <div className="md:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-12 border-2 border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-slate-300 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="relative z-10 max-w-md">
            <span className="text-4xl mb-6 block">🚀</span>
            <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">
              Publish to X, LinkedIn & Discord
            </h3>
            <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-base">
              Link your accounts via OAuth or connect a simple Webhook. Ozigi
              doesn't just format your content perfectly for each platform—it
              lets you push your finalized campaigns directly to your audience
              or team with a single click.
            </p>
          </div>

          {/* Decorative UI Element representing the 3 platforms */}
          <div className="hidden md:flex w-full max-w-[200px] flex-col gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-200 shadow-inner opacity-70 group-hover:opacity-100 transition-opacity">
            {/* X / Twitter */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-slate-900 flex-shrink-0 shadow-sm"></div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full"></div>
            </div>
            {/* LinkedIn */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-[#0A66C2] flex-shrink-0 shadow-sm"></div>
              <div className="w-5/6 h-2.5 bg-slate-200 rounded-full"></div>
            </div>
            {/* Discord */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-[#5865F2] flex-shrink-0 shadow-sm"></div>
              <div className="w-3/4 h-2.5 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
