"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, ArrowRight, ArrowLeft, X, CheckCircle2, ShieldCheck, Compass } from "lucide-react";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export const GuidedTour: React.FC<Props> = ({ isOpen: externalOpen, onClose: externalClose }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [internalOpen, setInternalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (searchParams.get("tour") === "true") {
      setInternalOpen(true);
    }
  }, [searchParams]);

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

  const handleClose = () => {
    setInternalOpen(false);
    if (externalClose) externalClose();
  };

  const steps = [
    {
      title: "1. Your Investment Command Center",
      desc: "This dashboard displays dynamically calculated total portfolio value, return %, calculated risk score, and sector exposure donut chart.",
      targetHref: "/"
    },
    {
      title: "2. Dynamic Portfolio & Holdings",
      desc: "Add and manage your stock holdings. ProsperHigh uses your portfolio weights to calculate real concentration risk and health scores.",
      targetHref: "/portfolio"
    },
    {
      title: "3. Analyze Any Stock or Company",
      desc: "Search ANY stock symbol or company to run a step-by-step 6-agent analysis pipeline.",
      targetHref: "/analyze"
    },
    {
      title: "4. Personalized Portfolio Suitability",
      desc: "This is different from a general rating. ProsperHigh evaluates whether an investment is suitable for YOUR specific portfolio.",
      targetHref: "/analyze"
    },
    {
      title: "5. Citation-Backed Research Terminal",
      desc: "Ask questions about annual reports and filings. Answers are supported by verifiable source document citations.",
      targetHref: "/research"
    },
    {
      title: "6. Decision History Audit Log",
      desc: "Every major analysis can be reviewed later to see what changed and why recommendations evolved over time.",
      targetHref: "/history"
    }
  ];

  if (!isOpen) return null;

  const stepObj = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      const nextHref = steps[currentStep].targetHref;
      if (nextHref && nextHref !== window.location.pathname) {
        router.push(nextHref);
      }
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
      <div className="bg-slate-900 text-white rounded-2xl p-6 max-w-md w-full border border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-accent text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-accent" />
            <span>ProsperHigh Guided Tour • Step {currentStep} of {steps.length}</span>
          </div>
          <button onClick={handleClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-extrabold font-manrope text-white">{stepObj.title}</h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
            {stepObj.desc}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30"
          >
            ← Back
          </button>

          <div className="flex space-x-1">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${idx + 1 === currentStep ? "bg-accent" : "bg-slate-700"}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-5 py-2 bg-accent hover:bg-accent-light text-charcoal font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1"
          >
            <span>{currentStep === steps.length ? "Finish Tour" : "Next →"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
