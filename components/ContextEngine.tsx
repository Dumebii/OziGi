interface DistilleryProps {
  inputs: { url: string; text: string };
  setInputs: (val: { url: string; text: string }) => void;
  onGenerate: () => void;
  loading: boolean;
}

export default function Distillery({
  inputs,
  setInputs,
  onGenerate,
  loading,
}: DistilleryProps) {
  return (
    <section className="flex flex-col gap-4 p-6 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100">
      <div className="flex items-center bg-slate-50 rounded-2xl px-5 py-2 border border-slate-200 group focus-within:border-red-500/50 transition-colors">
        <span className="text-xl mr-3 opacity-30 group-focus-within:opacity-100">
          🔗
        </span>
        <input
          className="flex-1 outline-none text-slate-900 text-sm font-bold bg-transparent py-3"
          placeholder="Paste your article URL here..."
          value={inputs.url}
          onChange={(e) => setInputs({ ...inputs, url: e.target.value })}
        />
      </div>
      <div className="flex items-start bg-slate-50 rounded-2xl px-5 py-4 border border-slate-200 group focus-within:border-red-500/50 transition-colors">
        <span className="text-xl mr-3 mt-1 opacity-30 group-focus-within:opacity-100">
          📝
        </span>
        <textarea
          className="flex-1 outline-none text-slate-900 text-sm font-medium bg-transparent min-h-[140px] resize-none"
          placeholder="Add additional context: meeting minutes, transcripts, personal notes, etc..."
          value={inputs.text}
          onChange={(e) => setInputs({ ...inputs, text: e.target.value })}
        />
      </div>
      <button
        onClick={onGenerate}
        disabled={loading || (!inputs.url && !inputs.text)}
        className="w-full bg-red-700 text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-red-800 transition-all disabled:bg-slate-200 shadow-xl shadow-red-900/10 active:scale-[0.98]"
      >
        {loading ? "Generating..." : "Generate Personalized Content"}
      </button>
    </section>
  );
}
