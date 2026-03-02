export default function Hero({ onStart }: { onStart: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-8 py-24 flex flex-col items-center text-center">
      <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-red-50 border border-red-100 text-red-700 text-[10px] font-black uppercase tracking-[0.3em]">
        Agentic Social Media Manager
      </div>
      <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-slate-950 mb-8 leading-[0.9]">
        TURN YOUR IDEAS INTO <br /> WINNING SOCIAL MEDIA <br /> CONTENT{" "}
        <span className="text-red-700 text-nowrap">IN YOUR OWN VOICE!</span>
      </h1>
      <p className="max-w-2xl text-slate-500 text-lg font-medium mb-12 leading-relaxed">
        Stop struggling to extract content from your context. WriterHelper
        ingests your long-form articles, personal notes, and meeting transcripts
        to architect a 3-day social media campaign that actually sounds like
        you.
      </p>
      <button
        onClick={onStart}
        className="bg-slate-950 text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-2xl active:scale-95"
      >
        Try It Now
      </button>
    </div>
  );
}
