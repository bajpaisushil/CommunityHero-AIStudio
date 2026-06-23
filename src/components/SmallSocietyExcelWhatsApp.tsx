import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  FileSpreadsheet, 
  Share2, 
  Sliders, 
  CheckCircle, 
  Plus, 
  Trash, 
  ArrowRight,
  Copy,
  FolderSync
} from 'lucide-react';

interface FlatUnit {
  flatNum: string;
  residentName: string;
  outstandingDues: number;
}

export default function SmallSocietyExcelWhatsApp() {
  const [units, setUnits] = useState<FlatUnit[]>([
    { flatNum: "Flat 101", residentName: "Sarah Connor", outstandingDues: 0 },
    { flatNum: "Flat 102", residentName: "Bruce Wayne", outstandingDues: 0 },
    { flatNum: "Flat 201", residentName: "Clark Kent", outstandingDues: 120 },
    { flatNum: "Flat 202", residentName: "Peter Parker", outstandingDues: 0 },
    { flatNum: "Flat 301", residentName: "Tony Stark", outstandingDues: 450 },
    { flatNum: "Flat 302", residentName: "Steve Rogers", outstandingDues: 80 }
  ]);

  const [societyName, setSocietyName] = useState("Golden Gate Flat Coop");
  const [newNum, setNewNum] = useState("");
  const [newName, setNewName] = useState("");
  const [newDues, setNewDues] = useState(0);
  const [excelUploadedLog, setExcelUploadedLog] = useState("");
  const [excelFileSelectedName, setExcelFileSelectedName] = useState("");

  const handleExcelUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFileSelectedName(file.name);
    setExcelUploadedLog("Interpreting Excel workbook sheet registers...");
    
    setTimeout(() => {
      // Simulate parser inserting 3 new flats
      const uploadedFlats: FlatUnit[] = [
        { flatNum: "Flat 401", residentName: "Diana Prince", outstandingDues: 0 },
        { flatNum: "Flat 402", residentName: "Barry Allen", outstandingDues: 320 },
        { flatNum: "Flat 403", residentName: "Hal Jordan", outstandingDues: 0 }
      ];
      setUnits(prev => [...prev, ...uploadedFlats]);
      setExcelUploadedLog("Excel import success! 3 new flat structures loaded cleanly to memory.");
    }, 2000);
  };

  const handleAddFlatManual = () => {
    if (!newNum.trim() || !newName.trim()) return;
    setUnits(prev => [...prev, {
      flatNum: newNum,
      residentName: newName,
      outstandingDues: Number(newDues)
    }]);
    setNewNum("");
    setNewName("");
    setNewDues(0);
  };

  const handleDeleteFlat = (flatNum: string) => {
    setUnits(prev => prev.filter(u => u.flatNum !== flatNum));
  };

  // Compile WhatsApp announcement formatting
  const getWhatsAppMessageLayout = () => {
    let msg = `*📢 ${societyName.toUpperCase()} OFFICIAL ANNOUNCEMENT*\n`;
    msg += `--------------------------------------\n`;
    msg += `Hello Residents, please review current updates for our building group:\n\n`;
    const pendingFlats = units.filter(u => u.outstandingDues > 0);
    
    if (pendingFlats.length > 0) {
      msg += `*Outstanding Balances Audit* 💸\n`;
      pendingFlats.forEach(f => {
        msg += `- **${f.flatNum}** (${f.residentName}): _₹${f.outstandingDues}_\n`;
      });
      msg += `\nPlease settle outstanding accounts by check or UPI code. Thank you!\n\n`;
    }

    msg += `*Community Action Item* 🛠️\n`;
    msg += `- Water main cleaning dispatches scheduled next Tue 10 AM. Active lateral checks requested.\n\n`;
    msg += `_Generated via HeroSync RWA Portable Tool_`;

    return msg;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getWhatsAppMessageLayout());
    alert("WhatsApp broadcast message text copied to clipboard!");
  };

  return (
    <div className="space-y-6" id="small_society_tab">
      
      {/* Dynamic Header */}
      <div className="bg-amber-400 p-6 rounded-3xl text-indigo-950 flex flex-col justify-between" id="self_managed_header">
        <div>
          <span className="text-[10px] font-black uppercase text-indigo-950 font-mono tracking-widest block mb-1">GAP 2: SMALL / SELF-MANAGED RWAs</span>
          <h2 className="text-xl font-display font-black tracking-tight leading-none">Self-Managed Coops, Flats, & Townhomes Console</h2>
        </div>
        <p className="text-xs text-indigo-950/80 mt-2 font-medium max-w-2xl leading-relaxed">
          Large management applications ignore 10–50 flat cooperatives. They continue using spreadsheets and chaotic WhatsApp chats. This console acts as a secure connector: synchronize Excel sheet registry lists and compile neat WhatsApp broadcast notices instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Registry Manager Columns */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] border p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block font-mono">EXCEL CONNECTIVITY</span>
              <h3 className="text-xs font-black font-display text-indigo-950">Active Building Flat Registry</h3>
            </div>
            
            {/* Custom Input */}
            <div>
              <input 
                type="text" 
                value={societyName} 
                onChange={(e) => setSocietyName(e.target.value)}
                className="bg-slate-100 border p-1 rounded font-bold text-xs text-indigo-950 text-center outline-none"
              />
            </div>
          </div>

          {/* Interactive list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {units.map((u) => (
              <div key={u.flatNum} className="p-3 bg-slate-50 border rounded-2xl flex items-center justify-between hover:border-slate-350 transition">
                <div>
                  <h4 className="text-xs font-black text-indigo-950">{u.flatNum}</h4>
                  <p className="text-[10px] font-medium text-slate-500">{u.residentName}</p>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <div>
                    <span className="text-[8px] font-mono font-bold block text-slate-450">PENDING DUES</span>
                    <span className="text-xs font-bold font-mono text-indigo-950">${u.outstandingDues}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteFlat(u.flatNum)}
                    className="p-1 text-slate-400 hover:text-red-650 transition"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Unit form */}
          <div className="bg-slate-50/50 p-4 rounded-3xl space-y-3.5 border border-dashed">
            <span className="text-[9px] font-black uppercase text-indigo-650 tracking-wider block">Add Flat Structure Manual</span>
            <div className="grid grid-cols-3 gap-2">
              <input 
                type="text" 
                value={newNum} 
                onChange={(e) => setNewNum(e.target.value)} 
                placeholder="Unit Number (e.g. Flat 304)"
                className="bg-white border p-1.5 rounded-xl text-xs outline-none" 
              />
              <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                placeholder="Resident Full Name"
                className="bg-white border p-1.5 rounded-xl text-xs outline-none" 
              />
              <input 
                type="number" 
                value={newDues} 
                onChange={(e) => setNewDues(Number(e.target.value))} 
                placeholder="Outstanding Dues"
                className="bg-white border p-1.5 rounded-xl text-xs outline-none" 
              />
            </div>
            <button 
              type="button"
              onClick={handleAddFlatManual}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Structure Unit</span>
            </button>
          </div>

          {/* Excel parser simulation */}
          <div className="pt-3.5 border-t">
            <div className="flex items-center justify-between text-xs bg-slate-100 p-4 rounded-[2rem] border border-dashed">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                <div>
                  <span className="font-bold text-slate-800">Simulate Excel Registry Import</span>
                  <p className="text-[9px] text-slate-500">Fast import list (.XLS / CSV layout)</p>
                </div>
              </div>
              
              <div className="relative">
                <input 
                  type="file" 
                  accept=".xls,.xlsx,.csv" 
                  onChange={handleExcelUploadSimulate}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
                <button className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-[10px] font-black pointer-events-none">
                  Select Sheet file
                </button>
              </div>
            </div>
            {excelUploadedLog && (
              <p className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl mt-2 select-none animate-pulse">
                {excelUploadedLog}
              </p>
            )}
          </div>
        </div>

        {/* WhatsApp Notice Compiler Column */}
        <div className="lg:col-span-5 bg-white rounded-[2.5rem] border p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b">
            <MessageSquare className="w-5 h-5 text-emerald-500 animate-bounce" />
            <div>
              <span className="text-[9px] font-black uppercase text-emerald-650 block">COMMUNICATOR OUTLET</span>
              <h3 className="text-xs font-black font-display text-indigo-950">Group WhatsApp Broadcaster Notice</h3>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Formatting community announcements into WhatsApp bold layouts ensures high view-rates. Settle flat dues alerts with a clean layout ready for clipboard copies.
          </p>

          <div className="bg-emerald-950 p-4 rounded-[1.5rem] font-mono text-[10px] text-emerald-300 whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed border border-emerald-800">
            {getWhatsAppMessageLayout()}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <button
              onClick={copyToClipboard}
              className="py-2.5 bg-emerald-650 hover:bg-emerald-700 text-white rounded-xl font-black transition flex items-center justify-center gap-1.5 shadow"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy for WhatsApp</span>
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(getWhatsAppMessageLayout())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 border border-slate-350 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition flex items-center justify-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Open web.whatsapp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
