import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  Loader2, 
  Search, 
  FileText, 
  Stethoscope, 
  Wind, 
  Zap, 
  UserCircle,
  AlertOctagon,
  ChevronRight,
  History,
  Lock,
  Eye,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { processSignal } from './services/gemini';
import { RSKIAAResponse, Severity } from './types';

const SEVERITY_COLORS: Record<Severity, string> = {
  CRITICAL: 'text-critical border-critical bg-critical/10',
  HIGH: 'text-high border-high bg-high/10',
  MEDIUM: 'text-medium border-medium bg-medium/10',
  LOW: 'text-low border-low bg-low/10'
};

const EXAMPLES = [
  {
    title: "Medical Emergency",
    text: "Patient 64yo male, found collapsed in garden. Breathing shallow. History of hypertension. Meds: lisinopril. No allergies known. BP 90/60 on arrival. Pulse weak."
  },
  {
    title: "Disaster Report",
    text: "Flash flooding at River St. 3 cars submerged. People on roofs of house #42 and #44. Power lines down. Water rising fast. Heavy rain continuing."
  },
  {
    title: "Mental Health Crisis",
    text: "Social media post: 'I can't do this anymore. Everything is dark. No one cares. Goodbye world.' Posted 5 mins ago from downtown area."
  }
];

export default function App() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<RSKIAAResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<RSKIAAResponse[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleProcess = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await processSignal(input);
      setResponse(result);
      setHistory(prev => [result, ...prev].slice(0, 5));
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError("Failed to process signal. Please ensure the input is clear enough for analysis.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen grid-bg flex flex-col">
      {/* Header */}
      <header className="border-b border-line p-4 flex justify-between items-center bg-bg sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ink flex items-center justify-center">
            <Shield className="text-bg w-6 h-6" />
          </div>
          <div>
            <h1 className="font-mono font-bold text-xl tracking-tighter leading-none">RSKIAA v1.0</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-60">Responsible AI Intent Bridge</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono uppercase opacity-60">
            <div className="w-2 h-2 rounded-full bg-low animate-pulse" />
            System Active
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 opacity-40" />
            <span className="text-[10px] font-mono uppercase opacity-40">Secure Node</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Intake */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <section className="bg-white/50 border border-line p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4" />
              <h2 className="col-header">Signal Intake</h2>
            </div>
            <p className="text-xs mb-4 opacity-70 italic">
              Input unstructured text, medical notes, emergency reports, or sensor data descriptions.
            </p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste messy real-world signal here..."
              className="w-full h-64 p-4 font-mono text-sm bg-bg/30 border border-line/20 focus:border-line focus:ring-0 transition-all resize-none"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setInput(ex.text)}
                  className="text-[10px] font-mono uppercase border border-line/20 px-2 py-1 hover:bg-ink hover:text-bg transition-colors"
                >
                  {ex.title}
                </button>
              ))}
            </div>
            <button
              onClick={handleProcess}
              disabled={isProcessing || !input.trim()}
              className="w-full mt-6 bg-ink text-bg py-4 flex items-center justify-center gap-2 font-mono uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Intelligence...
                </>
              ) : (
                <>
                  Process Signal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            {error && (
              <div className="mt-4 p-3 bg-critical/10 border border-critical text-critical text-xs font-mono uppercase">
                {error}
              </div>
            )}
          </section>

          {/* Accountability Stats */}
          <section className="border border-line p-6 bg-ink text-bg">
            <h3 className="col-header text-bg opacity-100 mb-4">Accountability Chain</h3>
            <div className="space-y-3">
              {[
                { label: "Transparency First", active: true },
                { label: "Human Oversight Note", active: true },
                { label: "Safety Bias Applied", active: true },
                { label: "Privacy Minimized", active: true },
                { label: "Uncertainty Disclosed", active: true }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] font-mono uppercase">
                  <span className="opacity-60">{item.label}</span>
                  <span className={item.active ? "text-low" : "text-critical"}>
                    {item.active ? "[ACTIVE]" : "[PENDING]"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Intelligence Output */}
        <div className="lg:col-span-7" ref={resultRef}>
          <AnimatePresence mode="wait">
            {!response && !isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border border-dashed border-line/30 opacity-40"
              >
                <Search className="w-12 h-12 mb-4" />
                <p className="font-mono uppercase tracking-widest text-sm">Awaiting Signal Input</p>
                <p className="text-xs mt-2 max-w-xs">RSKIAA is ready to bridge the gap between intent and action.</p>
              </motion.div>
            )}

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border border-line bg-white/30"
              >
                <div className="relative">
                  <Loader2 className="w-16 h-16 animate-spin opacity-20" />
                  <Shield className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="font-mono uppercase tracking-widest text-sm mt-6">Extracting Knowledge</p>
                <div className="w-48 h-1 bg-line/10 mt-4 overflow-hidden">
                  <motion.div 
                    className="h-full bg-ink"
                    animate={{ x: [-200, 200] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                </div>
                <p className="text-[10px] font-mono uppercase mt-4 opacity-60">Analyzing Domain & Severity...</p>
              </motion.div>
            )}

            {response && !isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Intelligence Header */}
                <div className="bg-white border border-line p-6 shadow-sm">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase opacity-60">Domain:</span>
                        <span className="text-xs font-bold uppercase tracking-wider">{response.domain}</span>
                      </div>
                      <h2 className="text-2xl font-bold tracking-tight leading-tight">{response.summary}</h2>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`px-3 py-1 border text-xs font-bold font-mono ${SEVERITY_COLORS[response.severity]}`}>
                        {response.severity} SEVERITY
                      </div>
                      <div className="text-[10px] font-mono uppercase opacity-60">
                        Confidence: <span className="text-ink font-bold">{response.confidence_percent}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Confidence Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-line/10 pt-4">
                    {[
                      { label: "Input Clarity", val: response.confidence_breakdown.input_clarity },
                      { label: "Domain Recog", val: response.confidence_breakdown.domain_recognition },
                      { label: "Findings", val: response.confidence_breakdown.finding_confidence },
                      { label: "Actions", val: response.confidence_breakdown.action_confidence }
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="text-[9px] font-mono uppercase opacity-50 mb-1">{item.label}</div>
                        <div className="h-1 bg-line/10 w-full">
                          <div className="h-full bg-ink" style={{ width: `${item.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Findings & Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Key Findings */}
                  <div className="bg-white border border-line p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-4 h-4" />
                      <h3 className="col-header">Key Findings</h3>
                    </div>
                    <div className="space-y-4">
                      {response.key_findings.map((finding, i) => (
                        <div key={i} className="group">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[9px] font-mono px-1 border ${
                              finding.certainty === 'CONFIRMED' ? 'border-low text-low' : 
                              finding.certainty === 'SUSPECTED' ? 'border-medium text-medium' : 
                              'border-line/40 opacity-60'
                            }`}>
                              {finding.certainty}
                            </span>
                            <span className="text-[9px] font-mono opacity-40 uppercase">Sig: {finding.significance}</span>
                          </div>
                          <p className="text-sm font-medium leading-snug">{finding.finding}</p>
                          <p className="text-[10px] mt-1 opacity-50 italic">"{finding.source_in_input}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Immediate Actions */}
                  <div className="bg-white border border-line p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-4 h-4" />
                      <h3 className="col-header">Immediate Actions</h3>
                    </div>
                    <div className="space-y-4">
                      {response.immediate_actions.sort((a, b) => a.priority - b.priority).map((action, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 border border-line flex items-center justify-center text-[10px] font-mono font-bold">
                            P{action.priority}
                          </div>
                          <div>
                            <p className="text-sm font-bold leading-tight">{action.action}</p>
                            <p className="text-[10px] mt-1 opacity-70">{action.rationale}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[9px] font-mono uppercase bg-bg px-1">{action.agency_or_role}</span>
                              {action.time_sensitive && (
                                <span className="text-[9px] font-mono uppercase text-critical animate-pulse">Time Sensitive</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Domain Specifics */}
                {(response.medical || response.mental_health || response.disaster_public_safety || response.environmental) && (
                  <div className="bg-white border border-line p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Stethoscope className="w-4 h-4" />
                      <h3 className="col-header">Domain Intelligence Extension</h3>
                    </div>
                    
                    {response.medical && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-[10px] font-mono uppercase opacity-60 mb-2">Differential Considerations</h4>
                          <ul className="space-y-1">
                            {response.medical.differential_considerations.map((item, i) => (
                              <li key={i} className="text-xs flex gap-2">
                                <ChevronRight className="w-3 h-3 flex-shrink-0 mt-0.5 opacity-40" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-mono uppercase text-critical mb-2">Contraindicated Actions</h4>
                          <ul className="space-y-1">
                            {response.medical.contraindicated_actions.map((item, i) => (
                              <li key={i} className="text-xs flex gap-2 text-critical">
                                <AlertOctagon className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {response.mental_health && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-[10px] font-mono uppercase opacity-60 mb-2">Risk Indicators</h4>
                            <div className="space-y-2">
                              {response.mental_health.risk_indicators.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-xs border-b border-line/5 pb-1">
                                  <span>{item.indicator}</span>
                                  <span className={`text-[9px] font-mono ${item.weight === 'HIGH' ? 'text-critical' : 'opacity-60'}`}>{item.weight}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-[10px] font-mono uppercase opacity-60 mb-2">Protective Factors</h4>
                            <ul className="space-y-1">
                              {response.mental_health.protective_factors.map((item, i) => (
                                <li key={i} className="text-xs flex gap-2">
                                  <CheckCircle2 className="w-3 h-3 text-low flex-shrink-0 mt-0.5" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="p-3 bg-bg/50 border border-line/10">
                          <h4 className="text-[10px] font-mono uppercase opacity-60 mb-1">Sensitivity Note</h4>
                          <p className="text-xs italic">{response.mental_health.sensitivity_note}</p>
                        </div>
                      </div>
                    )}

                    {response.disaster_public_safety && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-[10px] font-mono uppercase opacity-60 mb-2">Vulnerable Populations</h4>
                          <ul className="space-y-1">
                            {response.disaster_public_safety.vulnerable_populations.map((item, i) => (
                              <li key={i} className="text-xs flex gap-2">
                                <UserCircle className="w-3 h-3 flex-shrink-0 mt-0.5 opacity-40" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-mono uppercase opacity-60 mb-2">Resource Gaps</h4>
                          <ul className="space-y-1">
                            {response.disaster_public_safety.resource_gaps.map((item, i) => (
                              <li key={i} className="text-xs flex gap-2">
                                <AlertTriangle className="w-3 h-3 text-medium flex-shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Safety & Accountability Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Do Not Do & Missing Info */}
                  <div className="space-y-6">
                    <div className="bg-critical/5 border border-critical/20 p-6">
                      <div className="flex items-center gap-2 mb-4 text-critical">
                        <AlertOctagon className="w-4 h-4" />
                        <h3 className="col-header text-critical opacity-100">Do Not Do (Risk Mitigation)</h3>
                      </div>
                      <ul className="space-y-2">
                        {response.do_not_do.map((item, i) => (
                          <li key={i} className="text-xs font-bold flex gap-2">
                            <span className="opacity-40">—</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white border border-line p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <HelpCircle className="w-4 h-4" />
                        <h3 className="col-header">Missing Information</h3>
                      </div>
                      <ul className="space-y-2">
                        {response.missing_information.map((item, i) => (
                          <li key={i} className="text-xs flex gap-2">
                            <span className="opacity-40">?</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Assumptions & Accountability */}
                  <div className="space-y-6">
                    <div className="bg-white border border-line p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Eye className="w-4 h-4" />
                        <h3 className="col-header">AI Assumptions</h3>
                      </div>
                      <ul className="space-y-2">
                        {response.ai_assumptions.map((item, i) => (
                          <li key={i} className="text-xs flex gap-2 italic opacity-70">
                            <span className="opacity-40">~</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-ink text-bg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-4 h-4" />
                        <h3 className="col-header text-bg opacity-100">Accountability Log</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        {Object.entries(response.rskiaa_accountability).map(([key, val], i) => (
                          <div key={i} className="flex items-center justify-between text-[8px] font-mono uppercase">
                            <span className="opacity-50">{key.replace(/_/g, ' ')}</span>
                            <span className={val ? "text-low" : "text-critical"}>{val ? "YES" : "NO"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Human Oversight Note - Most Important */}
                <div className="bg-accent text-bg p-8 border-4 border-ink">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6" />
                    <h3 className="font-mono font-bold uppercase tracking-widest text-lg">Human Oversight Mandatory</h3>
                  </div>
                  <p className="text-lg font-medium leading-tight mb-4">
                    {response.human_oversight_note}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase opacity-80">
                    <Info className="w-3 h-3" />
                    RSKIAA assists professionals — it never replaces them. Verify all findings before deployment.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-line p-4 bg-bg text-[10px] font-mono uppercase opacity-40 flex justify-between items-center">
        <div>© 2026 RSKIAA Intelligence Systems</div>
        <div className="flex gap-4">
          <span>Latency: 1.2s</span>
          <span>Node: AS-SE1</span>
          <span>Protocol: RSKIAA-1.0</span>
        </div>
      </footer>
    </div>
  );
}
