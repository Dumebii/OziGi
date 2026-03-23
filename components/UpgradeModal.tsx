"use client";
import PricingCards from "./PricingCards";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal?: () => void;
}

export default function UpgradeModal({ isOpen, onClose, onOpenAuthModal }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-red-600 font-black text-xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-4">Upgrade Your Plan</h2>
        <PricingCards onOpenAuthModal={onOpenAuthModal} />
      </div>
    </div>
  );
}