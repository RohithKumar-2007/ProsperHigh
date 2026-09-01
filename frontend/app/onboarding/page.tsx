"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { saveOnboardingProfile } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import { Shield, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, AlertTriangle, Sparkles, Building } from "lucide-react";

export default function OnboardingWizardPageV3() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // 10-Step Form State
  const [country, setCountry] = useState("India 🇮🇳");
  const [currency, setCurrency] = useState("INR (₹)");
  const [marketPref, setMarketPref] = useState("NSE (National Stock Exchange)");
  const [expLevel, setExpLevel] = useState("Learning Investor");
  
  // Financial Context
  const [plannedInvestment, setPlannedInvestment] = useState("₹25,000 – ₹1 Lakh");
  const [currentInvested, setCurrentInvested] = useState("₹25,000");
  const [monthlyCapacity, setMonthlyCapacity] = useState("₹5,000 – ₹15,000");
  const [emergencySavings, setEmergencySavings] = useState("Yes");
  const [obligations, setObligations] = useState<string[]>(["Family Responsibilities"]);

  // Goals & Horizon
  const [goals, setGoals] = useState<string[]>(["📈 Wealth Growth", "🛡 Capital Preservation"]);
  const [primaryGoalTop, setPrimaryGoalTop] = useState("📈 Wealth Growth");
  const [horizon, setHorizon] = useState("3–5 Years");

  // Risk Questionnaire
  const [lossReaction, setLossReaction] = useState("Wait and monitor");
  const [gainVsLoss, setGainVsLoss] = useState("Losing ₹1 Lakh concerns me more");
  const [volatilityComfort, setVolatilityComfort] = useState(50);

  // Portfolio Choice
  const [portfolioChoice, setPortfolioChoice] = useState("manual");
  const [holdings, setHoldings] = useState([
    { symbol: "TATAMOTORS", quantity: 30, price: 980.0 },
    { symbol: "INFY", quantity: 25, price: 1890.0 }
  ]);

  const [newStock, setNewStock] = useState("");
  const [newQty, setNewQty] = useState(10);
  const [newPrice, setNewPrice] = useState(1000);

  const toggleGoal = (g: string) => {
    if (goals.includes(g)) setGoals(goals.filter(item => item !== g));
    else setGoals([...goals, g]);
  };

  const addHolding = () => {
    if (newStock.trim()) {
      setHoldings([...holdings, { symbol: newStock.toUpperCase().trim(), quantity: newQty, price: newPrice }]);
      setNewStock("");
    }
  };

  // Calculate dynamic Risk Score (0-100)
  let riskScore = 50;
  if (expLevel === "Beginner") riskScore -= 12;
  if (expLevel === "Advanced") riskScore += 16;
  if (horizon === "10+ Years") riskScore += 20;
  if (lossReaction === "Invest more") riskScore += 18;
  if (lossReaction === "Sell immediately") riskScore -= 22;
  if (emergencySavings === "No") riskScore -= 10;
  riskScore = Math.max(10, Math.min(95, riskScore));

  const category = riskScore < 40 ? "Conservative" : riskScore < 70 ? "Balanced Growth" : "Aggressive";

  const handleFinish = async () => {
    setSaving(true);
    const user = getStoredUser();
    const userId = user?.id || `USR-${Date.now().toString(36).toUpperCase()}`;
    try {
      await saveOnboardingProfile({
        user_id: userId,
        profile: {
          country,
          currency,
          market_preference: marketPref,
          experience_level: expLevel,
          primary_goals: goals,
          primary_goal_top: primaryGoalTop,
          investment_horizon: horizon,
          loss_reaction: lossReaction,
          volatility_comfort: volatilityComfort
        },
        financial: {
          planned_investment: plannedInvestment,
          current_invested: currentInvested,
          monthly_capacity: monthlyCapacity,
          emergency_savings: emergencySavings,
          financial_obligations: obligations
        },
        holdings: portfolioChoice === "manual" ? holdings : []
      });
      window.location.href = "/?tour=true";
    } catch (e) {
      window.location.href = "/?tour=true";
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      {/* Step Progress Bar */}
      {step > 1 && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>ProsperHigh Investor Profile Wizard</span>
            <span>Step {step} of 10</span>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all flex-1 ${
                  s === step ? "bg-primary" : s < step ? "bg-positive" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: WELCOME */}
      {step === 1 && (
        <div className="prosper-card p-8 text-center space-y-6 animate-in fade-in duration-200">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto border border-primary/20">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-extrabold text-charcoal font-manrope">
            Welcome to ProsperHigh, {getStoredUser()?.name || "Investor"} 👋
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Before we analyze investments, let's understand your financial situation, goals, and risk profile.
          </p>
          <button
            onClick={() => setStep(2)}
            className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
          >
            Build My Investor Profile →
          </button>
        </div>
      )}

      {/* STEP 2: BASIC PROFILE */}
      {step === 2 && (
        <div className="prosper-card p-8 space-y-6 animate-in fade-in duration-200">
          <h2 className="text-2xl font-extrabold text-charcoal font-manrope">Step 2: Basic Profile & Market Focus</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase">Country</label>
              <input type="text" value={country} readOnly className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold mt-1" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase">Preferred Market Exchange</label>
              <div className="p-3 bg-emerald-50 text-positive border border-emerald-200 rounded-xl text-xs font-bold mt-1">
                🇮🇳 NSE / BSE (National Stock Exchange of India)
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button onClick={() => setStep(3)} className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl">
              Next: Experience →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: INVESTMENT EXPERIENCE */}
      {step === 3 && (
        <div className="prosper-card p-8 space-y-6 animate-in fade-in duration-200">
          <h2 className="text-2xl font-extrabold text-charcoal font-manrope">Step 3: Investment Experience</h2>

          <div className="space-y-3">
            {[
              { id: "Beginner", title: "🌱 Beginner", desc: "Just getting started. Prefer plain explanations without jargon." },
              { id: "Learning Investor", title: "📘 Learning Investor", desc: "Understand basic metrics (P/E ratios, market caps)." },
              { id: "Active Investor", title: "📈 Active Investor", desc: "Actively manage investments and follow earnings reports." },
              { id: "Advanced", title: "🧠 Advanced / Professional", desc: "Significant technical, quantitative, and macro knowledge." }
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => setExpLevel(opt.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  expLevel === opt.id ? "border-primary bg-primary/5 shadow-xs" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-charcoal">{opt.title}</span>
                  {expLevel === opt.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{opt.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(2)} className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-600">Back</button>
            <button onClick={() => setStep(4)} className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl">Next: Financial Context →</button>
          </div>
        </div>
      )}

      {/* STEP 4: FINANCIAL CONTEXT */}
      {step === 4 && (
        <div className="prosper-card p-8 space-y-6 animate-in fade-in duration-200">
          <h2 className="text-2xl font-extrabold text-charcoal font-manrope">Step 4: Investment Capacity & Financial Context</h2>
          <p className="text-xs text-slate-500">We do not collect sensitive bank credentials. This helps customize risk warnings.</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase">How much are you planning to invest?</label>
              <select value={plannedInvestment} onChange={(e) => setPlannedInvestment(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold mt-1">
                <option value="Less than ₹25,000">Less than ₹25,000</option>
                <option value="₹25,000 – ₹1 Lakh">₹25,000 – ₹1 Lakh</option>
                <option value="₹1 – ₹5 Lakhs">₹1 – ₹5 Lakhs</option>
                <option value="₹5 – ₹10 Lakhs">₹5 – ₹10 Lakhs</option>
                <option value="₹10 Lakhs+">₹10 Lakhs+</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 uppercase">Monthly regular investment capacity</label>
              <select value={monthlyCapacity} onChange={(e) => setMonthlyCapacity(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold mt-1">
                <option value="₹0 – ₹5,000">₹0 – ₹5,000</option>
                <option value="₹5,000 – ₹15,000">₹5,000 – ₹15,000</option>
                <option value="₹15,000 – ₹50,000">₹15,000 – ₹50,000</option>
                <option value="₹50,000+">₹50,000+</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 uppercase">Emergency Savings Status</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {["Yes", "Partially", "No"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setEmergencySavings(opt)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      emergencySavings === opt ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(3)} className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-600">Back</button>
            <button onClick={() => setStep(5)} className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl">Next: Goals →</button>
          </div>
        </div>
      )}

      {/* STEP 5: INVESTMENT GOALS */}
      {step === 5 && (
        <div className="prosper-card p-8 space-y-6 animate-in fade-in duration-200">
          <h2 className="text-2xl font-extrabold text-charcoal font-manrope">Step 5: Primary Investment Goals</h2>

          <div className="grid grid-cols-2 gap-3">
            {[
              "📈 Wealth Growth",
              "🛡 Capital Preservation",
              "🏖 Retirement",
              "💰 Passive Income",
              "🎓 Education",
              "🏠 Major Purchase"
            ].map((g) => {
              const selected = goals.includes(g);
              return (
                <div
                  key={g}
                  onClick={() => toggleGoal(g)}
                  className={`p-3.5 rounded-xl border cursor-pointer text-xs font-bold transition-all flex items-center justify-between ${
                    selected ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-700"
                  }`}
                >
                  <span>{g}</span>
                  {selected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(4)} className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-600">Back</button>
            <button onClick={() => setStep(6)} className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl">Next: Horizon →</button>
          </div>
        </div>
      )}

      {/* STEP 6: INVESTMENT HORIZON */}
      {step === 6 && (
        <div className="prosper-card p-8 space-y-6 animate-in fade-in duration-200">
          <h2 className="text-2xl font-extrabold text-charcoal font-manrope">Step 6: Investment Horizon</h2>

          <div className="space-y-3">
            {["< 1 Year", "1–3 Years", "3–5 Years", "5–10 Years", "10+ Years"].map((h) => (
              <div
                key={h}
                onClick={() => setHorizon(h)}
                className={`p-4 rounded-xl border cursor-pointer font-bold text-xs transition-all flex items-center justify-between ${
                  horizon === h ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-700"
                }`}
              >
                <span>{h}</span>
                {horizon === h && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(5)} className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-600">Back</button>
            <button onClick={() => setStep(7)} className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl">Next: Risk Questionnaire →</button>
          </div>
        </div>
      )}

      {/* STEP 7: RISK QUESTIONNAIRE */}
      {step === 7 && (
        <div className="prosper-card p-8 space-y-6 animate-in fade-in duration-200">
          <h2 className="text-2xl font-extrabold text-charcoal font-manrope">Step 7: Risk Tolerance Questionnaire</h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase">Your portfolio falls 20% in one month. What do you do?</label>
              <div className="space-y-2 mt-2">
                {["Sell immediately", "Sell some investments", "Wait and monitor", "Invest more"].map((opt) => (
                  <div
                    key={opt}
                    onClick={() => setLossReaction(opt)}
                    className={`p-3 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                      lossReaction === opt ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-700"
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(6)} className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-600">Back</button>
            <button onClick={() => setStep(8)} className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl">View Calculated Profile →</button>
          </div>
        </div>
      )}

      {/* STEP 8: RISK PROFILE RESULT */}
      {step === 8 && (
        <div className="prosper-card p-8 space-y-6 animate-in fade-in duration-200">
          <h2 className="text-2xl font-extrabold text-charcoal font-manrope">Step 8: Your Calculated Risk Profile</h2>

          <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between border border-slate-800">
            <div>
              <span className="text-xs font-extrabold text-accent uppercase tracking-wider">Assigned Profile</span>
              <h3 className="text-2xl font-black font-manrope mt-1">{category}</h3>
              <p className="text-xs text-slate-300 mt-1">Calculated from horizon, drawdown scenarios, and financial context.</p>
            </div>
            <div className="text-right bg-white/10 p-4 rounded-xl">
              <div className="text-[10px] font-bold text-slate-300 uppercase">Risk Score</div>
              <div className="text-3xl font-black text-accent font-manrope">{riskScore} / 100</div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(7)} className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-600">Back</button>
            <button onClick={() => setStep(9)} className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl">Next: Portfolio Setup →</button>
          </div>
        </div>
      )}

      {/* STEP 9: PORTFOLIO SETUP CHOICE */}
      {step === 9 && (
        <div className="prosper-card p-8 space-y-6 animate-in fade-in duration-200">
          <h2 className="text-2xl font-extrabold text-charcoal font-manrope">Step 9: Portfolio Setup Choice</h2>

          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setPortfolioChoice("manual")}
              className={`p-6 rounded-2xl border cursor-pointer text-center space-y-2 transition-all ${
                portfolioChoice === "manual" ? "border-primary bg-primary/5" : "border-slate-200"
              }`}
            >
              <Building className="w-8 h-8 text-primary mx-auto" />
              <h3 className="text-sm font-bold text-charcoal">Add Existing Holdings</h3>
              <p className="text-xs text-slate-500">Enter stocks manually or upload CSV.</p>
            </div>

            <div
              onClick={() => setPortfolioChoice("empty")}
              className={`p-6 rounded-2xl border cursor-pointer text-center space-y-2 transition-all ${
                portfolioChoice === "empty" ? "border-primary bg-primary/5" : "border-slate-200"
              }`}
            >
              <Sparkles className="w-8 h-8 text-accent mx-auto" />
              <h3 className="text-sm font-bold text-charcoal">Start Fresh</h3>
              <p className="text-xs text-slate-500">Start with an empty portfolio.</p>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(8)} className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-600">Back</button>
            <button onClick={() => setStep(10)} className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl">Next: Finalize →</button>
          </div>
        </div>
      )}

      {/* STEP 10: ADD HOLDINGS & LAUNCH */}
      {step === 10 && (
        <div className="prosper-card p-8 space-y-6 animate-in fade-in duration-200">
          <h2 className="text-2xl font-extrabold text-charcoal font-manrope">Step 10: Add Initial Holdings & Finish</h2>

          {portfolioChoice === "manual" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  placeholder="Stock (e.g. TATAMOTORS)"
                  className="bg-slate-50 border rounded-lg p-2 text-xs font-bold"
                />
                <input
                  type="number"
                  value={newQty}
                  onChange={(e) => setNewQty(Number(e.target.value))}
                  placeholder="Qty"
                  className="bg-slate-50 border rounded-lg p-2 text-xs font-bold"
                />
                <button onClick={addHolding} type="button" className="bg-primary text-white text-xs font-bold rounded-lg py-2">
                  + Add Stock
                </button>
              </div>

              <div className="space-y-2">
                {holdings.map((h, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs font-bold text-charcoal">
                    <span>{h.symbol}</span>
                    <span>Qty: {h.quantity}</span>
                    <span>Avg: ₹{h.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600 text-center font-bold">
              Starting fresh with an empty portfolio. You can add holdings anytime from the Portfolio tab!
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-200">
            <button onClick={() => setStep(9)} className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-600">Back</button>
            <button
              onClick={handleFinish}
              disabled={saving}
              className="px-8 py-3 bg-positive hover:bg-positive-light text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
            >
              <span>{saving ? "Saving..." : "FINISH & LAUNCH DASHBOARD →"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
