import React, { useState } from 'react';
import { 
  Sparkles, 
  Droplets, 
  Zap, 
  Settings, 
  FileCheck, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  FileText
} from 'lucide-react';
import { Issue } from '../types';

interface AIOperationsProps {
  issues: Issue[];
}

export default function AIOperations({ issues }: AIOperationsProps) {
  // Simulator States
  const [tempMultiplier, setTempMultiplier] = useState<number>(31); // 31°C temp
  const [tankerBudget, setTankerBudget] = useState<number>(350); // $350 per tanker
  const [customThresholdKw, setCustomThresholdKw] = useState<number>(12); // Kw anomaly threshold
  
  // Calculate water leakage issues
  const waterLeaksCount = issues.filter(i => i.category === 'Water & Leakage' && i.status !== 'Resolved').length;
  // Predict monthly tankers needed: base remains 2, plus 1.8 tankers for each active un-isolated leak, multiplied by temperature factor
  const predictedTankers = Math.round(2 + (waterLeaksCount * 1.5) * (tempMultiplier > 30 ? 1.4 : 1.0));
  const estimatedTankerCost = predictedTankers * tankerBudget;

  // Anomalous readings simulation
  const [anomalyStatus, setAnomalyStatus] = useState<boolean>(true);
  const [reportMarkdown, setReportMarkdown] = useState<string>('');

  // Auto-generate committee status report using current issues list
  const handleGenerateReport = () => {
    let md = `## RWA COMMITTEE OPERATIONS REPORT\n`;
    md += `*Generated automatically via HeroSync AI operations module*\n\n`;
    md += `### 1. HIGH PRIORITY INCIDENTS SUMMARY\n`;
    const openIssues = issues.filter(i => i.status !== 'Resolved');
    if (openIssues.length === 0) {
      md += `* Excellent! No active priority incidents registered across our flats.\n`;
    } else {
      openIssues.forEach((issue) => {
        md += `- **[${issue.category}] ${issue.title}**\n`;
        md += `  * Severity: ${issue.severity} | Location: ${issue.address}\n`;
        md += `  * Directive: ${issue.aiResponse?.suggestedAction || 'Awaiting supervisor triage'}\n`;
      });
    }

    md += `\n### 2. RESOURCE PREDICTIONS\n`;
    md += `- predicted Summer Water Tankers: **${predictedTankers} tankers** required next 30 days.\n`;
    md += `- Estimated Emergency Water Outflow: **$${estimatedTankerCost}**.\n`;
    md += `- Live Grid Anomalies Detectors: **${anomalyStatus ? '1 Pending Trigger' : '0 Clean Grid'}**.\n\n`;
    md += `### 3. ACTIONABLE COMMITTEE MOTION\n`;
    md += `RESOLVED, that emergency water infrastructure pipeline patching be approved to offset excessive tanking fees.`;
    
    setReportMarkdown(md);
  };

  return (
    <div className="space-y-6" id="ai_operations_tab">
      
      {/* Dynamic Header */}
      <div className="bg-indigo-900 text-white rounded-3xl p-6 relative overflow-hidden" id="operations_showcase">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-2 mb-2 font-mono text-amber-300 text-[10px] uppercase font-black tracking-widest">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Section 1: AI-Powered Society Operations</span>
        </div>
        <h2 className="text-xl font-display font-black tracking-tight leading-none mb-2">Predictive Society Operations Console</h2>
        <p className="text-xs text-indigo-200 leading-relaxed max-w-2xl">
          Most modern management programs merely compile reports. HeroSync actively models society flows, predicting utility shortages and sniffing localized consumption anomalies before they cascade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start" id="operations_grid">
        
        {/* PANEL 1: WATER TANKER PREDICTOR */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2.5 pb-2.5 border-b">
            <div className="bg-cyan-100 text-cyan-700 p-2 rounded-2xl">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-cyan-600 block">DYNAMO UTILITY PREDICTION</span>
              <h3 className="text-xs font-black font-display text-indigo-950">Water Tanker Requirement Modeler</h3>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Active subterranean leakages on-site amplify building water losses. Model how summer temperature heatwaves escalate supply container requirements.
          </p>

          <div className="bg-slate-50 p-4 rounded-3xl space-y-4">
            {/* Temp Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-600">Simulated Temperature (°C)</span>
                <span className="text-cyan-700 font-mono font-black">{tempMultiplier}°C</span>
              </div>
              <input 
                type="range" 
                min={18} 
                max={42} 
                step={1}
                value={tempMultiplier} 
                onChange={(e) => setTempMultiplier(Number(e.target.value))}
                className="w-full h-1 bg-cyan-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
              <div className="flex justify-between text-[8px] font-bold text-slate-400">
                <span>Cool Season (18°C)</span>
                <span>Severe heatwave (42°C)</span>
              </div>
            </div>

            {/* active water leaks dynamic indicator */}
            <div className="flex items-center justify-between text-[11px] bg-white p-3 rounded-2xl border">
              <span className="text-slate-500 font-semibold">Active Un-Resolved Water Leaks:</span>
              <span className="font-mono font-black text-rose-600">x{waterLeaksCount}</span>
            </div>

            {/* Final predicted outcome display */}
            <div className="p-4 rounded-2xl bg-cyan-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[8px] font-mono uppercase tracking-widest text-cyan-300 font-bold block">MODEL ESTIMATE</span>
                <p className="text-2xl font-display font-black leading-none mt-1">{predictedTankers} Tankers</p>
                <p className="text-[10px] text-cyan-200 font-medium mt-1">Needed for coming 30 days due to pipe leaks</p>
              </div>

              <div className="text-right">
                <span className="text-[8px] font-mono text-cyan-300 block">TOTAL EXPENSE</span>
                <p className="text-xl font-display font-black text-amber-300 leading-none mt-1">${estimatedTankerCost}</p>
                <p className="text-[9px] text-cyan-200 mt-1">${tankerBudget}/p.t.</p>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 2: ELECTRICITY ANOMALY SNIFFER */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2.5 pb-2.5 border-b">
            <div className="bg-amber-100 text-amber-600 p-2 rounded-2xl">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-amber-500 block">GRID HEALTH CONSOLE</span>
              <h3 className="text-xs font-black font-display text-indigo-950">Energy & Water Consumption Anomaly Sniffer</h3>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Monitor dynamic building telemetry circuits. Real-time spike sniffer flags abnormal loads exceeding safe thresholds automatically.
          </p>

          <div className="space-y-3.5">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150 text-[11px]">
              <div>
                <span className="font-bold text-slate-700 block">Safe Loading limit</span>
                <span className="text-[9px] text-slate-400 font-medium font-mono">Max allowable drawing per flat hour</span>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={customThresholdKw} 
                  onChange={(e) => setCustomThresholdKw(Number(e.target.value))}
                  className="w-16 bg-white border p-1 rounded font-black text-center text-xs outline-none"
                />
                <span className="font-bold text-slate-500">kW</span>
              </div>
            </div>

            {/* Abnormal reading feed alert box */}
            {anomalyStatus ? (
              <div className="bg-red-50 border-2 border-red-150 p-4 rounded-3xl space-y-2.5 relative">
                <div className="absolute top-3.5 right-3.5 bg-red-100 text-red-700 px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider animate-pulse">
                  CRITICAL LOAD SPIKE
                </div>

                <div className="flex gap-2.5 text-xs text-red-900 leading-snug items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-red-950 block">Anomaly Detected under Flat 302:</strong>
                    <span className="text-[11px] text-red-800">
                      Circuit registered **32.4 kW** drawing at 3:15 AM UTC. Safe limit exceeded by 20.4 kW! Recommended action: Triage local heating coils or HVAC.
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setAnomalyStatus(false)}
                    className="p-1 px-3.5 bg-red-700 text-white rounded-full text-[10px] font-black hover:bg-red-800 transition shadow"
                  >
                    Mute Alert
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-3xl flex gap-2.5 text-xs text-emerald-800 items-center">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>All telemetry circuits running cleanly under the configured {customThresholdKw} kW safe threshold profile.</span>
              </div>
            )}
          </div>
        </div>

        {/* PANEL 3: COMMITTEE Status GENERATOR */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b">
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-100 text-indigo-700 p-2 rounded-2xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-indigo-600 block">GOVERNANCE ENGINE</span>
                <h3 className="text-xs font-black font-display text-indigo-950">Automated Committee Report Generator</h3>
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleGenerateReport}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Compile Live Audit Report</span>
            </button>
          </div>

          {reportMarkdown ? (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-[10px] leading-relaxed text-slate-700 whitespace-pre-wrap max-h-56 overflow-y-auto">
                {reportMarkdown}
              </div>
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(reportMarkdown);
                    alert("Report markdown copied to clipboard!");
                  }}
                  className="px-4 py-1.5 border border-slate-300 hover:bg-slate-100 rounded-full font-bold"
                >
                  Copy Text
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed">
              Click the Compile button to instantly aggregate current reported issues, predicted resources, and grid anomalies into formal RWA minutes ready for presentation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
