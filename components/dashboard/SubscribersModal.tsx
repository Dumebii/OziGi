"use client";
import SubscribersManager from "@/components/SubscribersManager";
import { usePlanStatus } from "../hooks/usePlanStatus";
import { useState } from "react";

interface SubscribersModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
  onOpenUpgradeModal?: () => void;
}


export default function SubscribersModal({ isOpen, onClose, session, onOpenUpgradeModal }: SubscribersModalProps) {
    const { planStatus, loading: planLoading } = usePlanStatus(); // move here
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  if (!isOpen) return null;
  

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-red-600 font-black text-xl"
        >
          ✕
        </button>
        <SubscribersManager session={session}    onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
/>
      </div>
    </div>
  );
}