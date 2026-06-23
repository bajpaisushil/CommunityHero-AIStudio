import React, { useState } from 'react';
import { 
  Building, 
  UserCheck, 
  DollarSign, 
  Activity, 
  CheckCircle, 
  X,
  Plus, 
  Eye, 
  ClipboardList, 
  Clock, 
  Star,
  Users
} from 'lucide-react';
import { TenantRecord } from '../types';

export default function RemoteOwnerDashboard() {
  const [tenants, setTenants] = useState<TenantRecord[]>([
    { id: "t-1", flatNum: "Flat 204", ownerName: "Sushil Bajpai", ownerContact: "sushil@remote.com", tenantName: "Elena Rostova", rentAmount: 1400, rentPaidStatus: "Paid", onboardingStep: "Completed", lastVisitorLog: "Courier delivered at 11h30", utilityUsageUnits: 340 },
    { id: "t-2", flatNum: "Flat 403", ownerName: "Richard Henderson", ownerContact: "richard@london.org", tenantName: "Marcus Chen", rentAmount: 1800, rentPaidStatus: "Pending", onboardingStep: "Agreement Pending", lastVisitorLog: "Guest checked-in at 20:15", utilityUsageUnits: 410 }
  ]);

  // Form states
  const [newFlatNum, setNewFlatNum] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [newTenant, setNewTenant] = useState("");
  const [newRent, setNewRent] = useState(1200);

  // Maintenance quote approvals
  const [quotes, setQuotes] = useState([
    { id: "q-1", flatNum: "Flat 204", quoteDesc: "Lateral flush-pipe seal replacement", cost: 240, approved: false, vendorName: "Apex Plumbing" },
    { id: "q-2", flatNum: "Flat 403", quoteDesc: "Balcony rail corrosion scrub", cost: 180, approved: false, vendorName: "S&M Refurbishments" }
  ]);

  const handleApproveQuote = (id: string) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, approved: true } : q));
  };

  const handleOnboardTenantSubmit = () => {
    if (!newFlatNum || !newTenant) return;
    setTenants(prev => [...prev, {
      id: `t-${Date.now()}`,
      flatNum: newFlatNum,
      ownerName: newOwner || "Remote Owner",
      ownerContact: "remote-landlord@rent.org",
      tenantName: newTenant,
      rentAmount: newRent,
      rentPaidStatus: "Pending",
      onboardingStep: "Verified ID",
      lastVisitorLog: "No activity logged",
      utilityUsageUnits: 0
    }]);

    setNewFlatNum("");
    setNewOwner("");
    setNewTenant("");
    setNewRent(1200);
  };

  const advanceOnboarding = (id: string) => {
    setTenants(tenants.map(t => {
      if (t.id === id) {
        const next: TenantRecord['onboardingStep'] = 
          t.onboardingStep === 'Verified ID' ? 'Agreement Pending' : 'Completed';
        return { ...t, onboardingStep: next };
      }
      return t;
    }));
  };

  return (
    <div className="space-y-6" id="remote_owner_dashboard">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-850 text-white rounded-3xl p-6 relative overflow-hidden" id="remote_showcase">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-1.5 font-mono text-amber-300 text-[10px] uppercase font-black tracking-widest leading-none mb-2">
          <Building className="w-4 h-4 text-amber-300" />
          <span>Gap 7: Remote Multi-Property Landlord Portal</span>
        </div>
        <h2 className="text-xl font-display font-black tracking-tight leading-none mb-1">Remote Multi-Property Owner Console</h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
          Many building owners reside far from their rental estates. HeroSync offers real-time monitoring: oversee tenant onboarding, tracking payments, remote maintenance payouts, utility spikes, and gate registers safely.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Tenants management log */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border p-6 shadow-xl space-y-5">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-black uppercase text-slate-400 block font-mono">PORTFOLIO LANDLORDS</span>
              <h3 className="text-xs font-black font-display text-indigo-950">Active Remote Rental List</h3>
            </div>
          </div>

          <div className="space-y-4">
            {tenants.map(t => (
              <div key={t.id} className="p-5 border rounded-3xl bg-slate-50/50 hover:bg-white transition space-y-4">
                <div className="flex justify-between items-start flex-wrap gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-mono tracking-wider font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md uppercase">{t.flatNum}</span>
                    <h4 className="text-sm font-black text-slate-900 mt-2 font-display">Tenant: {t.tenantName}</h4>
                    <p className="text-[10px] font-medium text-slate-400">Landlord: {t.ownerName}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[8px] font-mono font-bold block text-slate-450">MONTHLY LEASE RENT</span>
                    <span className="text-base font-black font-mono text-indigo-95s">${t.rentAmount}</span>
                    <span className={`text-[9px] font-black uppercase font-mono px-2 py-0.5 rounded block mt-1.5 ${
                      t.rentPaidStatus === 'Paid' ? 'bg-emerald-150 text-emerald-800' : 'bg-rose-150 text-rose-800 animate-pulse'
                    }`}>
                      {t.rentPaidStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t pt-3 text-[10px] text-slate-500 font-bold">
                  {/* Onboarding steps tracker */}
                  <div className="space-y-1">
                    <span>ONBOARD STATUS</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="bg-indigo-50 text-indigo-800 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">{t.onboardingStep}</span>
                      {t.onboardingStep !== "Completed" && (
                        <button 
                          onClick={() => advanceOnboarding(t.id)}
                          className="text-indigo-600 hover:underline"
                        >
                          Advance ➔
                        </button>
                      )}
                    </div>
                  </div>

                  {/* visitor Gate logger */}
                  <div className="space-y-1">
                    <span>REAL-TIME GATE ENTRY</span>
                    <p className="font-mono text-slate-600 truncate mt-1">🕒 {t.lastVisitorLog}</p>
                  </div>

                  {/* utility indicators */}
                  <div className="space-y-1">
                    <span>UTILITY UNITS WATCH</span>
                    <p className="font-mono text-indigo-950 mt-1">💧 {t.utilityUsageUnits} Units Consumed</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Simulate New Tenant Onboard form */}
          <div className="bg-slate-50/50 p-5 rounded-3xl space-y-4 border border-dashed">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-black text-indigo-950 font-display">Onboard New Tenant Remote Register</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <input 
                type="text" 
                value={newFlatNum} 
                onChange={e => setNewFlatNum(e.target.value)} 
                placeholder="Unit (e.g. Flat 104)"
                className="bg-white border p-2 rounded-xl text-xs outline-none focus:border-indigo-500" 
              />
              <input 
                type="text" 
                value={newOwner} 
                onChange={e => setNewOwner(e.target.value)} 
                placeholder="Owner full name"
                className="bg-white border p-2 rounded-xl text-xs outline-none focus:border-indigo-500" 
              />
              <input 
                type="text" 
                value={newTenant} 
                onChange={e => setNewTenant(e.target.value)} 
                placeholder="Tenant name"
                className="bg-white border p-2 rounded-xl text-xs outline-none focus:border-indigo-500" 
              />
              <input 
                type="number" 
                value={newRent} 
                onChange={e => setNewRent(Number(e.target.value))} 
                placeholder="Rent Amount ($)"
                className="bg-white border p-2 rounded-xl text-xs outline-none focus:border-indigo-500" 
              />
            </div>
            
            <button 
              onClick={handleOnboardTenantSubmit}
              className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Remote Tenant Checklist</span>
            </button>
          </div>
        </div>

        {/* Remote Maintenance Quotation Approvals Board */}
        <div className="lg:col-span-4 bg-white rounded-[2.5rem] border p-6 shadow-xl space-y-5">
          <div className="border-b pb-3">
            <span className="text-[9px] font-black uppercase text-slate-400 block font-mono">FINANCE COMPLIANCE</span>
            <h3 className="text-xs font-black font-display text-indigo-950">Remote Quotation Approvals</h3>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Plumbers or building contractors issue maintenance bills. Landlords approve or decline spending proposals instantly without visiting.
          </p>

          <div className="space-y-3.5">
            {quotes.map(q => (
              <div key={q.id} className="p-4 rounded-3xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono tracking-wider font-bold bg-slate-200 text-slate-700 px-1.5 rounded">{q.flatNum}</span>
                  <span className="font-mono text-xs font-black text-indigo-950">${q.cost}</span>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800 leading-tight">{q.quoteDesc}</p>
                  <p className="text-[9px] text-slate-400 mt-1">Compiled by: {q.vendorName}</p>
                </div>

                <div className="pt-2 border-t flex justify-end">
                  {q.approved ? (
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>APPROVED</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApproveQuote(q.id)}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-[10px] font-black transition"
                    >
                      Approve Spending
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
