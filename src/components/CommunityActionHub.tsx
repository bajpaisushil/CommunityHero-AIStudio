import React from 'react';
import { 
  Users, 
  Wrench, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  ShieldAlert,
  Volume2,
  Radio,
  Sparkles,
  Award
} from 'lucide-react';
import { Issue, UserProfile, VolunteerPledge } from '../types';

interface CommunityActionHubProps {
  issue: Issue;
  activeUser: UserProfile | null;
  pledgeResourceType: 'Labor (Hours)' | 'Traffic Cones' | 'Shovels & Rakes' | 'Spray Paint' | 'Sacks & Bins';
  pledgeQuantity: number;
  isPledging: boolean;
  setPledgeResourceType: (v: 'Labor (Hours)' | 'Traffic Cones' | 'Shovels & Rakes' | 'Spray Paint' | 'Sacks & Bins') => void;
  setPledgeQuantity: (v: number) => void;
  onPledgeSubmit: (e: React.FormEvent) => void;
}

export default function CommunityActionHub({
  issue,
  activeUser,
  pledgeResourceType,
  pledgeQuantity,
  isPledging,
  setPledgeResourceType,
  setPledgeQuantity,
  onPledgeSubmit
}: CommunityActionHubProps) {
  
  // Calculate total labor hours pledged
  const totalLaborHours = (issue.pledges || [])
    .filter(p => p.resourceType === 'Labor (Hours)')
    .reduce((sum, p) => sum + p.quantity, 0);

  // Calculate total other physical resources
  const totalPhysicalResources = (issue.pledges || [])
    .filter(p => p.resourceType !== 'Labor (Hours)')
    .reduce((sum, p) => sum + p.quantity, 0);

  // Target values to show completion index
  const laborTarget = 10;
  const materialTarget = 15;
  const laborPercent = Math.min(100, Math.round((totalLaborHours / laborTarget) * 100));
  const materialPercent = Math.min(100, Math.round((totalPhysicalResources / materialTarget) * 100));

  // Determine standard feedback message based on acoustic metrics if present
  const getSimulatedAcousticFeedback = (hz: number, db: number) => {
    if (hz > 800) {
      return {
        type: 'High-Pitch Gurgle / Minor Pipe-Wall Porosity Seepage',
        warning: 'Moderate structural degradation. Flow rates are currently confined; local pavement collapse warning is low but active.',
        color: 'text-amber-600 bg-amber-500/10 border-amber-500/20'
      };
    } else {
      return {
        type: 'Low-Frequency Subterranean Cavity Rumble / High-Volume Lateral Pipe Shear',
        warning: 'CRITICAL VOIDS FORMING. Continuous subterranean soil washouts detected. Rapid sinkhole progression likely within 48 hours if left un-isolated!',
        color: 'text-red-600 bg-red-500/10 border-red-500/20'
      };
    }
  };

  const acousticFeedback = issue.acousticHz && issue.acousticDb 
    ? getSimulatedAcousticFeedback(issue.acousticHz, issue.acousticDb)
    : null;

  return (
    <div className="space-y-5" id="community_action_hub">
      {/* FEATURE 1: ACOUSTIC DIAGNOSTICS DISPLAY */}
      {issue.category === 'Water & Leakage' && issue.acousticHz && issue.acousticDb && acousticFeedback && (
        <div className="bg-cyan-950 text-cyan-200 p-5 rounded-3xl border border-cyan-800/40 space-y-3 relative overflow-hidden" id="acoustic_diagnostics_panel">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
            <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">Sonic Acoustic Leak Signature</span>
            <span className="ml-auto text-[8px] bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">TELEM VERIFIED</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-2.5 border-b border-cyan-800/30">
            <div className="bg-cyan-900/35 p-2 rounded-xl text-center border border-cyan-900/15">
              <span className="text-[8px] uppercase font-bold text-cyan-400 block tracking-wide">Frequency Pitch</span>
              <span className="text-sm font-display font-black text-cyan-50 font-mono">{issue.acousticHz} Hz</span>
            </div>
            <div className="bg-cyan-900/35 p-2 rounded-xl text-center border border-cyan-900/15">
              <span className="text-[8px] uppercase font-bold text-cyan-400 block tracking-wide">Turbulence Volume</span>
              <span className="text-sm font-display font-black text-cyan-50 font-mono">{issue.acousticDb} dB</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-start gap-1.5 leading-snug">
              <Radio className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
              <p className="font-semibold text-cyan-100/90 text-[11px]">
                <strong className="text-cyan-300">Leak Signature:</strong> {acousticFeedback.type}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-900/50 border border-cyan-800/20 text-[10px] leading-relaxed text-cyan-300">
              <span className="font-black text-cyan-400 block uppercase text-[8px] tracking-wide mb-0.5">PREVENTATIVE RISK MEMO</span>
              "{acousticFeedback.warning}"
            </div>
          </div>

          {/* Graphic soundwave simulator */}
          <div className="flex gap-0.5 items-end h-4 pt-1 px-1 justify-center opacity-70">
            {[...Array(16)].map((_, i) => (
              <div 
                key={i} 
                className="bg-cyan-400 rounded-full w-1 flex-1 transition-all duration-300"
                style={{ 
                  height: `${20 + Math.sin(i * 0.9 + (issue.acousticHz || 1)) * 80}%`,
                  animation: `pulseWave ${1 + (i % 3) * 0.2}s ease-in-out infinite alternate`
                }}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* FEATURE 2: VOLUNTEER PLEDGING HUB */}
      <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-[2rem] space-y-4" id="pledge_card_hub">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-100/50">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600/10 p-1.5 rounded-xl text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-indigo-500 block">CIVIC EMPOWERMENT HUB</span>
              <h4 className="text-xs font-black text-indigo-950 font-display">Hands-On Micro-Volunteer Pledges</h4>
            </div>
          </div>

          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold rounded-lg uppercase tracking-wide">
            {totalLaborHours + totalPhysicalResources > 0 ? 'Active Collaboration' : 'Ready to Organize'}
          </span>
        </div>

        {/* Community progress metrics against target */}
        <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
          <div className="space-y-1 bg-white p-3 rounded-2xl border border-indigo-50">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-500">Volunteer Hours Target</span>
              <span className="text-indigo-600 font-bold font-mono">{totalLaborHours} / {laborTarget} Hrs</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${laborPercent}%` }}
              ></div>
            </div>
            <p className="text-[9px] text-slate-400 font-medium">Physical labor to self-rebuild / assist crews</p>
          </div>

          <div className="space-y-1 bg-white p-3 rounded-2xl border border-indigo-50">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-500">Safety Assets Target</span>
              <span className="text-indigo-600 font-bold font-mono">{totalPhysicalResources} / {materialTarget} units</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${materialPercent}%` }}
              ></div>
            </div>
            <p className="text-[9px] text-slate-400 font-medium">Cones, rakes, spray paint supplied</p>
          </div>
        </div>

        {/* Current list of citizen commits */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase text-indigo-950/70 block tracking-wider">Citizen Pledge Registry</span>
          
          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {(!issue.pledges || issue.pledges.length === 0) ? (
              <p className="text-[11px] text-slate-400 italic text-center py-2.5 bg-white rounded-2xl border border-indigo-50/50">
                No local citizen pledges logged yet. Stand up as the first pioneer by pledging units below!
              </p>
            ) : (
              issue.pledges.map(p => (
                <div key={p.id} className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="font-bold text-slate-800">{p.name}</span>
                    <span className="text-slate-400 font-medium font-mono text-[10px]">{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="font-mono bg-indigo-50 text-indigo-700 border border-indigo-100/40 px-2 py-0.5 rounded font-black">
                    +{p.quantity} {p.resourceType}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Interactive Pledge form */}
        {activeUser && (
          <form onSubmit={onPledgeSubmit} className="bg-white/60 p-3.5 rounded-2xl border border-indigo-100/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-indigo-950/70">Co-Submit Micro-Pledge (Gain +30 XP!)</span>
              <span className="text-[9px] text-indigo-500 font-bold bg-indigo-50 px-1.5 py-0.2 rounded-md uppercase font-mono">Simulated Hero Actions</span>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-6">
                <select 
                  value={pledgeResourceType}
                  onChange={(e) => setPledgeResourceType(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 p-2 rounded-xl text-[11px] outline-none text-slate-700 font-bold"
                >
                  <option value="Labor (Hours)">Labor (Hours)</option>
                  <option value="Traffic Cones">Traffic Cones</option>
                  <option value="Shovels & Rakes">Shovels & Rakes</option>
                  <option value="Spray Paint">Spray Paint</option>
                  <option value="Sacks & Bins">Sacks & Bins</option>
                </select>
              </div>

              <div className="col-span-3">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <button 
                    type="button" 
                    onClick={() => setPledgeQuantity(Math.max(1, pledgeQuantity - 1))}
                    className="px-2 py-1.5 font-bold hover:bg-slate-50 text-xs border-r flex-1"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-mono font-black text-center text-slate-800 w-12 block">{pledgeQuantity}</span>
                  <button 
                    type="button" 
                    onClick={() => setPledgeQuantity(Math.min(10, pledgeQuantity + 1))}
                    className="px-2 py-1.5 font-bold hover:bg-slate-50 text-xs border-l flex-1"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="col-span-3">
                <button 
                  type="submit"
                  disabled={isPledging}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2 rounded-xl text-[11px] transition duration-200"
                >
                  {isPledging ? 'Pledging...' : 'Pledge'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* FEATURE 3: QUEST INSTRUCTIONS HINT */}
      {!issue.status.includes('Resolved') && (
        <div className="bg-amber-400/10 border border-amber-300/30 p-4 rounded-3xl flex gap-3 text-xs text-amber-900 leading-snug">
          <Award className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <strong className="text-amber-950 font-display font-medium">Verify on-site during your commute:</strong>
            <p className="text-[11px] text-amber-800/90 mt-0.5">This reported issue is currently undergoing community validation check. Upvoting flags citizen consensus, transitioning reported reports to verified state and rewarding validators.</p>
          </div>
        </div>
      )}
    </div>
  );
}
