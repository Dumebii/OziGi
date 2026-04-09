"use client";
import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, X } from "lucide-react";

interface CancellationModalProps {
  currentPlan: string;
  onClose: () => void;
  onSuccess: () => void;
}

const CANCELLATION_REASONS = [
  { value: "too_expensive", label: "Too expensive" },
  { value: "not_using", label: "Not using it enough" },
  { value: "found_alternative", label: "Found an alternative" },
  { value: "missing_features", label: "Missing features I need" },
  { value: "technical_issues", label: "Technical issues" },
  { value: "other", label: "Other reason" },
];

export default function CancellationModal({
  currentPlan,
  onClose,
  onSuccess,
}: CancellationModalProps) {
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"confirm" | "reason">("confirm");

  const handleCancel = async () => {
    if (!reason) {
      toast.error("Please select a reason for cancellation");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, feedback: feedback.trim() || null }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      toast.success("Subscription cancelled. You're now on the Free plan.");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("[Cancellation] Error:", error);
      toast.error(error.message || "Failed to cancel subscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-4 border-slate-900 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight text-red-900">
              Cancel Subscription
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "confirm" ? (
            <>
              <p className="text-slate-700 mb-4">
                You&apos;re currently on the{" "}
                <span className="font-bold capitalize">{currentPlan}</span> plan.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-800">
                  <strong>Before you go:</strong> If you cancel, you&apos;ll lose access to:
                </p>
                <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc list-inside">
                  {currentPlan === "team" && (
                    <>
                      <li>30 campaigns/month (down to 5)</li>
                      <li>Unlimited personas</li>
                      <li>Image generation</li>
                      <li>Email newsletters</li>
                    </>
                  )}
                  {currentPlan === "organization" && (
                    <>
                      <li>Unlimited campaigns</li>
                      <li>Ozigi Copilot</li>
                      <li>Campaign analytics</li>
                      <li>Priority model access</li>
                    </>
                  )}
                  {currentPlan === "enterprise" && (
                    <>
                      <li>Custom limits and SLA</li>
                      <li>Team workspaces</li>
                      <li>Dedicated support</li>
                    </>
                  )}
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Keep my plan
                </button>
                <button
                  onClick={() => setStep("reason")}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
                >
                  Continue cancellation
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-slate-700 mb-4">
                We&apos;re sorry to see you go. Help us improve by sharing why:
              </p>
              <div className="space-y-2 mb-4">
                {CANCELLATION_REASONS.map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      reason === r.value
                        ? "border-brand-red bg-red-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-4 h-4 text-brand-red focus:ring-brand-red"
                    />
                    <span className="text-sm text-slate-700">{r.label}</span>
                  </label>
                ))}
              </div>
              {reason === "other" && (
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us more (optional)..."
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm resize-none focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
                  rows={3}
                />
              )}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep("confirm")}
                  className="flex-1 py-2.5 px-4 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCancel}
                  disabled={!reason || isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Cancelling..." : "Cancel subscription"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
