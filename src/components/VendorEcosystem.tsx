import React, { useState } from 'react';
import { 
  Wrench, 
  MapPin, 
  Star, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Phone, 
  CreditCard,
  XCircle,
  Truck
} from 'lucide-react';
import { VendorItem, Issue } from '../types';

interface VendorEcosystemProps {
  vendors: VendorItem[];
  issues: Issue[];
  onUpdateIssueStatus: (issueId: string, status: 'Reported' | 'Verified' | 'In Progress' | 'Resolved') => void;
}

export default function VendorEcosystem({ vendors, issues, onUpdateIssueStatus }: VendorEcosystemProps) {
  // Simulator states
  const [selectedCategory, setSelectedCategory] = useState<'Plumbing' | 'Electrical' | 'Roads' | 'Waste'>('Plumbing');
  const [dispatchingVendor, setDispatchingVendor] = useState<VendorItem | null>(null);
  const [dispatchingIssueId, setDispatchingIssueId] = useState<string>('');
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'assigned' | 'transit' | 'completed'>('idle');
  const [userRating, setUserRating] = useState<number>(5);
  const [isPaid, setIsPaid] = useState(false);

  const filteredVendors = vendors.filter(v => {
    if (selectedCategory === 'Plumbing') return v.specialty.includes('Plumb') || v.specialty.includes('Pipe');
    if (selectedCategory === 'Electrical') return v.specialty.includes('Electr') || v.specialty.includes('Light');
    if (selectedCategory === 'Roads') return v.specialty.includes('Road') || v.specialty.includes('Pothole');
    if (selectedCategory === 'Waste') return v.specialty.includes('Waste') || v.specialty.includes('Sanit');
    return true;
  });

  const handleStartDispatch = (vendor: VendorItem) => {
    // Pick the first unresolved issue matching the category, or let user pick
    const matchingIssues = issues.filter(i => {
      if (selectedCategory === 'Plumbing') return i.category === 'Water & Leakage';
      if (selectedCategory === 'Electrical') return i.category === 'Streetlights';
      if (selectedCategory === 'Roads') return i.category === 'Roads & Potholes';
      if (selectedCategory === 'Waste') return i.category === 'Sanitation & Waste';
      return true;
    });

    const targetIssue = matchingIssues[0];
    if (!targetIssue) {
      alert("No open/incident reports exist matching this specialty! Please report a relevant issue first to assign.");
      return;
    }

    setDispatchingVendor(vendor);
    setDispatchingIssueId(targetIssue.id);
    setDispatchStatus('assigned');
    setIsPaid(false);
    
    // Transition target issue status to 'In Progress' natively
    onUpdateIssueStatus(targetIssue.id, 'In Progress');
  };

  const handleNextStep = () => {
    if (dispatchStatus === 'assigned') {
      setDispatchStatus('transit');
    } else if (dispatchStatus === 'transit') {
      setDispatchStatus('completed');
    }
  };

  const handleCompleteJob = () => {
    if (dispatchingIssueId) {
      onUpdateIssueStatus(dispatchingIssueId, 'Resolved');
    }
    setDispatchStatus('idle');
    setDispatchingVendor(null);
    setDispatchingIssueId('');
  };

  return (
    <div className="space-y-6" id="vendor_ecosystem_panel">
      
      {/* Header banner */}
      <div className="bg-emerald-950 p-6 rounded-3xl text-white flex flex-col justify-between" id="vendor_banner">
        <div>
          <span className="text-[10px] font-black uppercase text-amber-300 font-mono tracking-widest block mb-1">GAP 3: MUNICIPAL RESOLUTION MARKETPLACE</span>
          <h2 className="text-xl font-display font-black tracking-tight leading-none">Local Vendor Service Triage Ecosystem</h2>
        </div>
        <p className="text-xs text-slate-300 mt-2 font-medium max-w-2xl leading-relaxed">
          Standard platforms merely draft complaints. HeroSync solves them. We link verified contractors directly into reported problems, complete with rating scorecards, SLAs, and simulated inside-app payout processing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Marketplace Selection and Vendor Grid */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b flex-wrap gap-2">
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block font-mono">VERIFIED CONTRACTORS</span>
              <h3 className="text-xs font-black font-display text-indigo-950">Resolution Service Directory</h3>
            </div>

            {/* Category tabs */}
            <div className="flex gap-1.5 overflow-x-auto">
              {(['Plumbing', 'Electrical', 'Roads', 'Waste'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-black transition ${
                    selectedCategory === cat 
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVendors.map(vendor => (
              <div key={vendor.id} className="p-4 border border-slate-100 hover:border-indigo-400 rounded-3xl bg-slate-50/50 hover:bg-white transition flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <h4 className="text-xs font-black text-indigo-950">{vendor.name}</h4>
                      <p className="text-[9px] font-mono font-bold text-slate-400">{vendor.specialty.toUpperCase()}</p>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg text-[9px] font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{vendor.rating}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>SLA: {vendor.slaDays} Days</span>
                    </div>
                    <div>
                      <span>Base: <span className="font-mono text-indigo-950">${vendor.baseCharge}</span></span>
                    </div>
                    <div className="col-span-2">
                      <span>✓ {vendor.completedJobs} resolved dispatches</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t flex justify-between items-center">
                  <span className={`text-[9px] font-black uppercase font-mono px-2 py-0.5 rounded ${
                    vendor.available ? 'bg-emerald-150 text-emerald-800' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {vendor.available ? "Ready" : "In Field"}
                  </span>

                  <button
                    onClick={() => handleStartDispatch(vendor)}
                    disabled={!vendor.available || dispatchStatus !== 'idle'}
                    className="p-1 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-full text-[10px] font-black transition flex items-center gap-1 shadow"
                  >
                    <span>Assign Issue</span>
                    <ChevronRight className="w-3 h-3 stroke-[3]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Triage Status Timeline */}
        <div className="lg:col-span-4 bg-indigo-950 text-white rounded-[2.5rem] p-6 shadow-xl space-y-5">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase text-amber-300 font-mono block">MONITOR DISPATCHES</span>
            <h3 className="text-xs font-black font-display">Interactive SLA Timeline</h3>
          </div>

          {dispatchingVendor ? (
            <div className="space-y-5">
              {/* Dispatch Info */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-2">
                <span className="text-[8px] font-mono font-bold text-emerald-400 block tracking-widest uppercase">ACTIVE INCIDENT RESPONSE</span>
                <h4 className="text-xs font-bold text-slate-100">{dispatchingVendor.name}</h4>
                <p className="text-[10px] text-slate-400">Assigned code: **#{dispatchingIssueId?.slice(-4)}**</p>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {dispatchingVendor.contact}
                </p>
              </div>

              {/* Status Timestamps */}
              <div className="space-y-4 relative pl-5 border-l border-slate-800">
                {/* Stage 1 */}
                <div className="relative">
                  <span className={`absolute -left-[25px] w-3 h-3 rounded-full border-2 ${
                    dispatchStatus !== 'idle' ? 'bg-indigo-400 border-indigo-400' : 'bg-slate-900 border-slate-800'
                  }`}></span>
                  <div className="text-[11px]">
                    <p className={`font-bold ${dispatchStatus !== 'idle' ? 'text-indigo-200' : 'text-slate-500'}`}>Triage Request Formed</p>
                    <p className="text-[9px] text-slate-400">RWA systems matched contractor automatically based on low billing rates.</p>
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="relative">
                  <span className={`absolute -left-[25px] w-3 h-3 rounded-full border-2 ${
                    dispatchStatus === 'transit' || dispatchStatus === 'completed' ? 'bg-amber-400 border-amber-400' : 'bg-slate-900 border-slate-800'
                  }`}></span>
                  <div className="text-[11px]">
                    <p className={`font-bold ${dispatchStatus === 'transit' || dispatchStatus === 'completed' ? 'text-amber-200' : 'text-slate-500'}`}>Transit & Lateral Isolation</p>
                    <p className="text-[9px] text-slate-400">Truck en-route. Service SLA threshold expires within 4h.</p>
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="relative">
                  <span className={`absolute -left-[25px] w-3 h-3 rounded-full border-2 ${
                    dispatchStatus === 'completed' ? 'bg-emerald-400 border-emerald-400' : 'bg-slate-900 border-slate-800'
                  }`}></span>
                  <div className="text-[11px]">
                    <p className={`font-bold ${dispatchStatus === 'completed' ? 'text-emerald-300' : 'text-slate-500'}`}>Repairs Verified & Paid</p>
                    <p className="text-[9px] text-slate-400">Audit-ready. Plumber reported water main flow stabilization.</p>
                  </div>
                </div>
              </div>

              {/* Simulator Action controller */}
              <div className="space-y-2 pt-2">
                {dispatchStatus !== 'completed' ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-indigo-950 font-black rounded-xl text-xs transition flex items-center justify-center gap-1 shadow"
                  >
                    <Truck className="w-4 h-4 animate-bounce" />
                    <span>Simulate Contractor Progress</span>
                  </button>
                ) : (
                  <div className="space-y-3.5 bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
                    <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider block">Job Completed Workflow</span>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span>Service Payout Amount:</span>
                      <span className="font-mono font-bold text-emerald-300">${dispatchingVendor.baseCharge}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPaid(true)}
                      disabled={isPaid}
                      className={`w-full py-2 rounded-lg text-[10px] font-black tracking-wider transition uppercase ${
                        isPaid ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isPaid ? "✓ Pay Completed via App Wallet" : "Trigger Secure ESCROW App pay"}
                    </button>

                    <div className="flex justify-between items-center border-t border-slate-800 pt-2.5">
                      <span className="text-[10px] font-bold text-slate-400">Rate local vendor:</span>
                      <div className="flex gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map(num => (
                          <button key={num} onClick={() => setUserRating(num)}>
                            <Star className={`w-3.5 h-3.5 ${num <= userRating ? 'fill-current' : 'opacity-30'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCompleteJob}
                      className="w-full py-2 bg-white text-indigo-950 font-black rounded-lg text-[11px] hover:bg-slate-100 transition"
                    >
                      Close Triage Dispatch
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 italic text-[11px] border border-dashed border-slate-800 rounded-3xl">
              No active contractor dispatch tracked. Find the category and click **"Assign Issue"** on any plumber/electrician to start local repairs.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
