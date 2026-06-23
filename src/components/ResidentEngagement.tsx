import React, { useState } from 'react';
import { 
  Users, 
  HelpCircle, 
  Gift, 
  Car, 
  HeartHandshake, 
  Plus, 
  Check, 
  Sparkles,
  ShoppingBag,
  MessageCircle
} from 'lucide-react';
import { SkillExchangeItem, MarketItem, HelperItem } from '../types';

export default function ResidentEngagement() {
  const [activeSubTab, setActiveSubTab] = useState<'skills' | 'market' | 'helpers' | 'carpool'>('skills');

  // Dynamic state list
  const [skills, setSkills] = useState<SkillExchangeItem[]>([
    { id: "sk-1", residentName: "Elena Rostova", flatNum: "Flat 204", skillName: "French & Russian Language Lessons", description: "Offering conversational foreign language clusters. Free exchange for organic herb gardening pointers.", availableDays: "Saturdays 10 AM" },
    { id: "sk-2", residentName: "Dr. Bruce Banner", flatNum: "Flat 105", skillName: "Advanced Physics Tuition", description: "Helping juniors with highschool physics equations.", availableDays: "Wed evenings" },
    { id: "sk-3", residentName: "Sanya G.", flatNum: "Flat 403", skillName: "Yoga & Vinyasa Alignment", description: "Sunday morning sun salutation flows on the RWA rooftop terrace.", availableDays: "Sunday Sunrises" }
  ]);

  const [markets, setMarkets] = useState<MarketItem[]>([
    { id: "m-1", title: "Ergonomic Desk Chair", price: 45, description: "Excellent spine support, minor cosmetic wear on armrest. Pickup from Flat 301.", sellerFlat: "Flat 301", category: "Furniture" },
    { id: "m-2", title: "Instant Pot Duo Electric Cooker", price: 30, description: "Used 4 times. Complete with original pressure steam checklist.", sellerFlat: "Flat 202", category: "Electronics" }
  ]);

  const [helpers, setHelpers] = useState<HelperItem[]>([
    { id: "h-1", name: "Maya Sharma", role: "Cook", rating: 4.9, flatsWorking: ["Flat 101", "Flat 202", "Flat 305"], monthlySalaryEstimate: 180, recommendationQuote: "Makes incredible healthy organic dinners. Extremely punctual!" },
    { id: "h-2", name: "Rajesh Shinde", role: "Driver", rating: 4.8, flatsWorking: ["Flat 301", "Flat 402"], monthlySalaryEstimate: 220, recommendationQuote: "Very safe driving record. Expert with electric cars and parking clearances." }
  ]);

  const [carpools, setCarpools] = useState([
    { id: "cp-1", driverName: "Clark Kent", destination: "Financial District (SF downtown)", departureTime: "8:05 AM", seatCount: 3, vehicle: "Tesla Model 3" },
    { id: "cp-2", driverName: "Steve Rogers", destination: "Brooklyn Navy Yard Sector", departureTime: "7:30 AM", seatCount: 2, vehicle: "Vintage Electric Bike (Cargo side)" }
  ]);

  // Form Inputs
  const [skillFormName, setSkillFormName] = useState("");
  const [skillFormTitle, setSkillFormTitle] = useState("");
  const [skillFormDesc, setSkillFormDesc] = useState("");
  const [skillFormDays, setSkillFormDays] = useState("");

  const [marketFormTitle, setMarketFormTitle] = useState("");
  const [marketFormPrice, setMarketFormPrice] = useState(0);
  const [marketFormDesc, setMarketFormDesc] = useState("");
  const [marketFormCat, setMarketFormCat] = useState<'Rent' | 'Furniture' | 'Electronics' | 'Service' | 'Other'>('Furniture');

  const handleAddSkill = () => {
    if (!skillFormName || !skillFormTitle) return;
    setSkills(prev => [...prev, {
      id: `sk-${Date.now()}`,
      residentName: skillFormName,
      flatNum: "Flat 304",
      skillName: skillFormTitle,
      description: skillFormDesc,
      availableDays: skillFormDays
    }]);
    setSkillFormName("");
    setSkillFormTitle("");
    setSkillFormDesc("");
    setSkillFormDays("");
  };

  const handleAddMarket = () => {
    if (!marketFormTitle || !marketFormPrice) return;
    setMarkets(prev => [...prev, {
      id: `m-${Date.now()}`,
      title: marketFormTitle,
      price: Number(marketFormPrice),
      description: marketFormDesc,
      sellerFlat: "Flat 102",
      category: marketFormCat
    }]);
    setMarketFormTitle("");
    setMarketFormPrice(0);
    setMarketFormDesc("");
  };

  return (
    <div className="space-y-6" id="resident_engagement_hub">
      
      {/* Header Banner */}
      <div className="bg-indigo-900 text-white rounded-3xl p-6 relative overflow-hidden" id="engagement_showcase">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-900/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-1.5 font-mono text-amber-300 text-[10px] uppercase font-black tracking-widest leading-none mb-2">
          <HeartHandshake className="w-4 h-4 text-amber-300" />
          <span>Gap 6: Hyperlocal Engagement Hub & Marketplace</span>
        </div>
        <h2 className="text-xl font-display font-black tracking-tight leading-none mb-1">Cooperative Resident Engagement Hub</h2>
        <p className="text-xs text-indigo-200 leading-relaxed max-w-2xl">
          Turn your apartment block from a "complaint app" into a rich community ecosystem. Share local talents, sell furniture without shipping overheads, recommend help, and schedule carbon-offset carpools.
        </p>
      </div>

      {/* Main layout with horizontal category router */}
      <div className="bg-white rounded-[2.5rem] border p-6 shadow-xl space-y-6">
        
        {/* Navigation router bar */}
        <div className="flex border-b pb-3 overflow-x-auto gap-2.5 scrollbar-none" id="engagement_subtabs_header">
          <button
            onClick={() => setActiveSubTab('skills')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black transition whitespace-nowrap ${
              activeSubTab === 'skills'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Talent & Skill Exchange</span>
          </button>

          <button
            onClick={() => setActiveSubTab('market')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black transition whitespace-nowrap ${
              activeSubTab === 'market'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Flea Market Classifieds</span>
          </button>

          <button
            onClick={() => setActiveSubTab('helpers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black transition whitespace-nowrap ${
              activeSubTab === 'helpers'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Maid & Helpful Cook Directory</span>
          </button>

          <button
            onClick={() => setActiveSubTab('carpool')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black transition whitespace-nowrap ${
              activeSubTab === 'carpool'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Green Block Carpooling</span>
          </button>
        </div>

        {/* 1. SKILLS VIEW */}
        {activeSubTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="skills_view">
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider block">Resident Skills Catalog</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map(sk => (
                  <div key={sk.id} className="p-4 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-indigo-600 block">{sk.flatNum} • {sk.residentName}</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-800 mt-1 leading-snug">{sk.skillName}</h4>
                      <p className="text-[11px] text-slate-500 mt-1">{sk.description}</p>
                    </div>

                    <div className="flex justify-between items-center bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100/40 text-[10px] font-bold mt-2">
                      <span className="text-indigo-800">⏱️ {sk.availableDays}</span>
                      <button className="text-indigo-600 flex items-center gap-1 hover:underline">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Offer Skill panel */}
            <div className="lg:col-span-4 bg-slate-50 rounded-[2rem] p-5 border border-dashed space-y-4">
              <span className="text-[9px] font-black uppercase tracking-wider text-indigo-900 block font-mono">Contribute to the Coop</span>
              <h4 className="text-xs font-black text-indigo-950">Offer Your Skill</h4>

              <div className="space-y-3.5">
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-655 block">Your Name</label>
                  <input 
                    type="text" 
                    value={skillFormName} 
                    onChange={e => setSkillFormName(e.target.value)} 
                    placeholder="e.g. Elena Rostova" 
                    className="w-full bg-white border p-2 rounded-xl outline-none" 
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-655 block">Skill Name</label>
                  <input 
                    type="text" 
                    value={skillFormTitle} 
                    onChange={e => setSkillFormTitle(e.target.value)} 
                    placeholder="e.g. French Conversations" 
                    className="w-full bg-white border p-2 rounded-xl outline-none" 
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-655 block">Brief Description</label>
                  <textarea 
                    value={skillFormDesc} 
                    onChange={e => setSkillFormDesc(e.target.value)} 
                    placeholder="Exchange lessons or mutual help recommendations" 
                    className="w-full bg-white border p-2 rounded-xl outline-none h-20" 
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-655 block">Available time</label>
                  <input 
                    type="text" 
                    value={skillFormDays} 
                    onChange={e => setSkillFormDays(e.target.value)} 
                    placeholder="e.g. Saturdays at noon" 
                    className="w-full bg-white border p-2 rounded-xl outline-none" 
                  />
                </div>

                <button 
                  onClick={handleAddSkill}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition shadow"
                >
                  Publish Skill Offer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. FLEA MARKET */}
        {activeSubTab === 'market' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="market_view">
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider block font-mono">Hyperlocal Buy/Sell Listings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {markets.map(it => (
                  <div key={it.id} className="p-4 border rounded-3xl bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono tracking-wider font-bold bg-slate-200 px-2 py-0.5 rounded text-indigo-950 px-1.5 py-0.5 rounded-md uppercase">{it.category}</span>
                        <span className="text-xs font-black text-indigo-900">{it.sellerFlat}</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 mt-2 font-display leading-tight">{it.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{it.description}</p>
                    </div>

                    <div className="pt-3.5 border-t border-slate-150 flex items-center justify-between">
                      <span className="text-sm font-black font-mono text-emerald-800">${it.price}</span>
                      <button className="text-[10px] font-black bg-indigo-600 text-white px-3.5 py-1.5 rounded-full hover:bg-indigo-700 transition flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>Inquire Seller</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* List Item form */}
            <div className="lg:col-span-4 bg-slate-50 rounded-[2rem] p-5 border border-dashed space-y-4">
              <span className="text-[9px] font-black uppercase tracking-wider text-indigo-905 block font-mono">List Flat Belongings</span>
              <h4 className="text-xs font-black text-indigo-950">Draft classified item</h4>

              <div className="space-y-3.5">
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-655 block">Item Name</label>
                  <input 
                    type="text" 
                    value={marketFormTitle} 
                    onChange={e => setMarketFormTitle(e.target.value)} 
                    placeholder="e.g. Wooden Dining Table" 
                    className="w-full bg-white border p-2 rounded-xl outline-none" 
                  />
                </div>

                <div className="space-y-1 text-xs flex gap-2">
                  <div className="flex-1">
                    <label className="font-bold text-slate-655 block">Price ($)</label>
                    <input 
                      type="number" 
                      value={marketFormPrice} 
                      onChange={e => setMarketFormPrice(Number(e.target.value))} 
                      placeholder="e.g. 50" 
                      className="w-full bg-white border p-2 rounded-xl outline-none" 
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-655 block">Category</label>
                    <select 
                      value={marketFormCat}
                      onChange={e => setMarketFormCat(e.target.value as any)}
                      className="w-full bg-white border p-2 rounded-xl outline-none font-bold"
                    >
                      <option value="Furniture">Furniture</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Rent">Rent</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-655 block">Description</label>
                  <textarea 
                    value={marketFormDesc} 
                    onChange={e => setMarketFormDesc(e.target.value)} 
                    placeholder="Specify condition and pickup timing" 
                    className="w-full bg-white border p-2 rounded-xl outline-none h-20" 
                  />
                </div>

                <button 
                  onClick={handleAddMarket}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition shadow"
                >
                  List Item For Sale
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. VERIFIED HELPERS */}
        {activeSubTab === 'helpers' && (
          <div className="space-y-4" id="helpers_view">
            <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider block font-mono">Domestic Help Recommendation Board</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {helpers.map(hlp => (
                <div key={hlp.id} className="p-4 border rounded-3xl bg-slate-50/50 flex flex-col justify-between hover:bg-white transition relative">
                  <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg text-[9px] font-bold flex items-center gap-0.5">
                    <Check className="w-3 h-3 text-amber-600" />
                    <span>RATED {hlp.rating}</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md uppercase">{hlp.role}</span>
                      <h4 className="text-sm font-black text-slate-900 mt-2 font-display">{hlp.name}</h4>
                    </div>

                    <p className="text-[11px] text-slate-500 italic">"{hlp.recommendationQuote}"</p>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-bold border-t pt-2 mt-2">
                      <div>
                        <span>Working structure flats:</span>
                        <div className="flex gap-1 flex-wrap mt-0.5">
                          {hlp.flatsWorking.map(f => (
                            <span key={f} className="bg-slate-200 text-slate-700 p-0.5 px-1 rounded">{f}</span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span>Monthly Compensation:</span>
                        <p className="font-mono text-slate-700 mt-0.5">${hlp.monthlySalaryEstimate}/mo</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CARPOOL */}
        {activeSubTab === 'carpool' && (
          <div className="space-y-4" id="carpool_view">
            <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider block font-mono">Carbon-Offset carpooling boards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {carpools.map(cp => (
                <div key={cp.id} className="p-4 border rounded-3xl bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-indigo-600 block">{cp.vehicle}</span>
                    <h4 className="text-xs font-black text-slate-800">{cp.driverName} is driving to:</h4>
                    <p className="text-sm font-display font-black text-indigo-950">{cp.destination}</p>
                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-mono text-slate-700">Departs: {cp.departureTime}</span>
                  </div>

                  <div className="text-right flex flex-col justify-between items-end h-full">
                    <span className="text-[9px] font-mono font-bold text-slate-400">AVAILABLE SEATS</span>
                    <p className="text-2xl font-display font-black text-indigo-955">{cp.seatCount}</p>
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black hover:bg-indigo-700 transition mt-2">
                      Book Seat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
