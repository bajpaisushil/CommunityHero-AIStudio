import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  CheckCircle, 
  Activity, 
  Droplet, 
  Lightbulb, 
  Trash2, 
  Plus, 
  Award, 
  Users, 
  Compass, 
  MessageSquare, 
  Send, 
  Filter, 
  Shield, 
  TrendingUp, 
  Volume2,
  ChevronRight, 
  Sparkles, 
  Clock, 
  Upload, 
  Sliders, 
  Leaf, 
  X,
  Zap,
  Info
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Issue, Comment, UserProfile, CityStats, IssueCategory, IssueStatus, IssueSeverity, VendorItem, FinanceRecord } from './types';
import CommunityActionHub from './components/CommunityActionHub';

// Multi-gap imported visual remedies
import LocalAIAssistant from './components/LocalAIAssistant';
import FinanceTransparency from './components/FinanceTransparency';
import AIOperations from './components/AIOperations';
import SmallSocietyExcelWhatsApp from './components/SmallSocietyExcelWhatsApp';
import VendorEcosystem from './components/VendorEcosystem';
import ResidentEngagement from './components/ResidentEngagement';
import RemoteOwnerDashboard from './components/RemoteOwnerDashboard';

export default function App() {
  // Application State
  const [issues, setIssues] = useState<Issue[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<CityStats | null>(null);
  const [predictiveInsights, setPredictiveInsights] = useState<any>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  
  // Active Simulated User
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [isOfficialMode, setIsOfficialMode] = useState<boolean>(false);
  
  // Responsive sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Shared Finance Ledger State
  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>([
    { id: "rec-1", date: "2026-06-01", type: "Maintenance Fee", description: "Standard flat maintenance contributions compiled ($120/flat)", amount: 2880, category: "income" },
    { id: "rec-2", date: "2026-06-03", type: "Utility Tanker", description: "AquaFlow Emergency Water Container - 2000g tanking", amount: 480, category: "expense" },
    { id: "rec-3", date: "2026-06-10", type: "Repair Payout", description: "Apex Plumbing pipe patching on lateral column 4", amount: 650, category: "expense" },
    { id: "rec-4", date: "2026-06-12", type: "Security Fund", description: "Access Gate CCTV camera sensor repairs", amount: 310, category: "expense" },
    { id: "rec-5", date: "2026-06-15", type: "Event Spending", description: "Flea market community barbecue refreshments", amount: 120, category: "expense" }
  ]);

  // Shared Vendor Ecosystem State
  const [vendors, setVendors] = useState<VendorItem[]>([
    { id: "v-1", name: "AquaFlow Municipal Tankers", specialty: "Emergency Water Container Tanker Delivery", rating: 4.8, completedJobs: 142, slaDays: 1, baseCharge: 480, contact: "+1 (555) 012-9201", available: true },
    { id: "v-2", name: "Apex Plumbing Services", specialty: "Subterranean Pipe Triage & Lateral Repair", rating: 4.6, completedJobs: 89, slaDays: 2, baseCharge: 320, contact: "+1 (555) 016-8800", available: true },
    { id: "v-3", name: "Flash Electric Solutions", specialty: "Streetlamp Circuitry, grid loading & HVAC", rating: 4.9, completedJobs: 215, slaDays: 1, baseCharge: 210, contact: "+1 (555) 014-4321", available: true },
    { id: "v-4", name: "S&M Refurbishments", specialty: "Balcony Railing Sanding & Concrete Masonry", rating: 4.5, completedJobs: 64, slaDays: 4, baseCharge: 400, contact: "+1 (555) 018-7711", available: false }
  ]);

  // Navigation Tabs including Gaps
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports_feed' | 'predictive' | 'leaderboard' | 'ai_ops' | 'small_societies' | 'vendors' | 'finances' | 'bot_assistant' | 'residents' | 'remote_owners'>('dashboard');

  const onUpdateIssueStatus = async (issueId: string, status: 'Reported' | 'Verified' | 'In Progress' | 'Resolved') => {
    try {
      const res = await fetch(`/api/issues/${issueId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: status,
          officialComment: `Auto-dispatched vendor to resolve reported item. Status changed to ${status}.`,
          officialName: "SF Public Works Regional Planner"
        })
      });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // New Report Modal & State
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<IssueCategory>('Roads & Potholes');
  const [newSeverity, setNewSeverity] = useState<IssueSeverity>('Medium');
  const [newAddress, setNewAddress] = useState('');
  const [newImage, setNewImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Acoustic Calibration Sniffer States
  const [acousticHz, setAcousticHz] = useState<number>(340);
  const [acousticDb, setAcousticDb] = useState<number>(45);
  const [acousticActive, setAcousticActive] = useState<boolean>(false);

  // Volunteer Pledging States
  const [pledgeResourceType, setPledgeResourceType] = useState<'Labor (Hours)' | 'Traffic Cones' | 'Shovels & Rakes' | 'Spray Paint' | 'Sacks & Bins'>('Labor (Hours)');
  const [pledgeQuantity, setPledgeQuantity] = useState<number>(2);
  const [isPledging, setIsPledging] = useState<boolean>(false);
  
  // Comments input text
  const [commentText, setCommentText] = useState('');
  
  // Simulation Panel for Official Status Changes
  const [newStatus, setNewStatus] = useState<IssueStatus>('In Progress');
  const [officialNotes, setOfficialNotes] = useState('');

  // Built-in Coordinate Presets in SF for Map Pinning
  const coordinatePresets = [
    { name: "Downtown / Market St Hub", address: "4th St & Market St Corner, San Francisco, CA", lat: 37.7849, lng: -122.4094 },
    { name: "Mission District Transit Block", address: "850 Mission St, San Francisco, CA", lat: 37.7749, lng: -122.4194 },
    { name: "Castro Commercial Plaza", address: "Castro St & 18th St, San Francisco, CA", lat: 37.7649, lng: -122.4294 },
    { name: "Franklin Square Community Park", address: "Franklin Square Park, San Francisco, CA", lat: 37.7549, lng: -122.4094 },
    { name: "Twin Peaks High Vista", address: "Twin Peaks Blvd, San Francisco, CA", lat: 37.7544, lng: -122.4478 },
  ];

  // Load Initial API Data
  const loadData = async () => {
    try {
      const issuesRes = await fetch('/api/issues');
      const issuesData = await issuesRes.json();
      setIssues(issuesData);
      
      // Auto-select first issue if none selected
      if (issuesData.length > 0 && !selectedIssue) {
        setSelectedIssue(issuesData[0]);
      } else if (selectedIssue) {
        const updated = issuesData.find((i: Issue) => i.id === selectedIssue.id);
        if (updated) setSelectedIssue(updated);
      }

      const usersRes = await fetch('/api/users');
      const usersData = await usersRes.json();
      setUsers(usersData);

      // Default active user is user-1 initially
      if (!activeUser && usersData.length > 0) {
        setActiveUser(usersData[0]);
      } else if (activeUser) {
        const updatedUser = usersData.find((u: UserProfile) => u.id === activeUser.id);
        if (updatedUser) setActiveUser(updatedUser);
      }

      const statsRes = await fetch('/api/stats');
      const statsData = await statsRes.json();
      setStats(statsData);
      
    } catch (err) {
      console.error('Error fetching baseline community logs:', err);
    }
  };

  // Load Insights
  const loadInsights = async () => {
    try {
      const res = await fetch('/api/insights/predictive');
      const data = await res.json();
      setPredictiveInsights(data);
    } catch (err) {
      console.error('Error downloading forward predictions:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'predictive') {
      loadInsights();
    }
  }, [activeTab]);

  // Set selected preset coordinates
  const handlePresetSelect = (preset: typeof coordinatePresets[0]) => {
    setNewAddress(preset.address);
  };

  // Trigger base64 converter on image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Dispatch live report submission
  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !newAddress.trim()) {
      setSubmitError("Title, Description and Address coordinates are required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    // Identify current address coordinates if applicable, or assign random offsets
    const matchingPreset = coordinatePresets.find(p => p.address === newAddress);
    const latitude = matchingPreset ? matchingPreset.lat : 37.7749 + (Math.random() - 0.5) * 0.04;
    const longitude = matchingPreset ? matchingPreset.lng : -122.4194 + (Math.random() - 0.5) * 0.04;

    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          category: newCategory,
          severity: newSeverity,
          address: newAddress,
          latitude,
          longitude,
          reporterName: activeUser ? activeUser.name : "Anonymous Hero",
          reporterId: activeUser ? activeUser.id : "anonymous-id",
          imageUrl: newImage || undefined,
          acousticHz: newCategory === "Water & Leakage" && acousticActive ? acousticHz : undefined,
          acousticDb: newCategory === "Water & Leakage" && acousticActive ? acousticDb : undefined
        })
      });

      if (!res.ok) {
        throw new Error("Failed to process server dispatch parameters.");
      }

      const freshlyCreated = await res.json();
      setIsNewReportOpen(false);
      
      // Reset form variables
      setNewTitle('');
      setNewDescription('');
      setNewImage('');
      setNewAddress('');
      setAcousticActive(false);
      setAcousticHz(340);
      setAcousticDb(45);
      
      await loadData();
      setSelectedIssue(freshlyCreated);
      setActiveTab('dashboard'); // Switch to main lookups
    } catch (err: any) {
      setSubmitError(err.message || "Unknown transportation dispatch error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upvote/Community validation trigger
  const handleUpvote = async (issueId: string) => {
    if (!activeUser) return;
    try {
      const res = await fetch(`/api/issues/${issueId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: activeUser.id })
      });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Comments
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue || !commentText.trim()) return;

    try {
      const res = await fetch(`/api/issues/${selectedIssue.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: isOfficialMode ? "Hon. Supervisor (Official)" : (activeUser?.name || "Citizen Guide"),
          userRole: isOfficialMode ? "official" : "citizen",
          text: commentText
        })
      });

      if (res.ok) {
        setCommentText('');
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Dispatch community micro-volunteering or resource pledge
  const handleCreatePledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue || !activeUser) return;

    setIsPledging(true);
    try {
      const res = await fetch(`/api/issues/${selectedIssue.id}/pledges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUser.id,
          name: activeUser.name,
          resourceType: pledgeResourceType,
          quantity: pledgeQuantity
        })
      });

      if (res.ok) {
        setPledgeQuantity(2);
        await loadData();
      }
    } catch (err) {
      console.error('Error dispatching community pledge', err);
    } finally {
      setIsPledging(false);
    }
  };

  // Simulate Municipal State Changes
  const handleStatusChangeSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;

    try {
      const res = await fetch(`/api/issues/${selectedIssue.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          officialComment: officialNotes || `Assigned repair team for ${selectedIssue.category} and deployed heavy assets.`,
          officialName: "SF Public Works Regional Planner"
        })
      });

      if (res.ok) {
        setOfficialNotes('');
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Dynamic Icon selector based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Roads & Potholes':
        return <AlertTriangle className="w-5 h-5" />;
      case 'Water & Leakage':
        return <Droplet className="w-5 h-5" />;
      case 'Streetlights':
        return <Lightbulb className="w-5 h-5" />;
      case 'Sanitation & Waste':
        return <Trash2 className="w-5 h-5" />;
      case 'Parks & Public Spaces':
        return <Leaf className="w-5 h-5" />;
      default:
        return <Compass className="w-5 h-5" />;
    }
  };

  // Highlight severity color code
  const getSeverityBadge = (severity: IssueSeverity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'High':
        return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
    }
  };

  // Status visual label color
  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'In Progress':
        return 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20';
      case 'Verified':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      default:
        return 'bg-slate-400/15 text-slate-500 border border-slate-400/20';
    }
  };

  // Filter issues based on choices and query
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          issue.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || issue.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate chart metrics for visual analysis
  const getChartData = () => {
    if (issues.length === 0) return [];
    const categories: { [key: string]: number } = {};
    issues.forEach(i => {
      categories[i.category] = (categories[i.category] || 0) + 1;
    });
    return Object.keys(categories).map(key => ({
      name: key.replace(' & ', '\n'),
      count: categories[key],
    }));
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden relative" id="app_frame">
      
      {/* Mobile background backdrop overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-indigo-950/45 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION - Designed with elegant 'Vibrant Palette' Indigo & Amber */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-indigo-900 flex flex-col p-5 text-white shrink-0 border-r border-indigo-950/40 shadow-2xl justify-between transition-transform duration-300 lg:relative lg:translate-x-0 ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`} id="app_sidebar">
        
        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Brand Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="bg-amber-400 p-2.5 rounded-2xl shadow-lg shadow-amber-400/20 transform hover:rotate-6 transition-transform">
              <Zap className="w-6 h-6 text-indigo-950 stroke-[2.5]" id="brand_badge_icon" />
            </div>
            <div>
              <span className="text-xl font-display font-black tracking-tight uppercase block leading-none text-white">HeroSync</span>
              <span className="text-[10px] text-amber-300 font-mono tracking-widest uppercase">Community Hero</span>
            </div>
          </div>

          {/* Core Interactive User Switching Context Console */}
          <div className="bg-indigo-950/50 p-4 rounded-3xl border border-indigo-800/40 backdrop-blur-md">
            <p className="text-[10px] text-indigo-300 font-mono font-bold uppercase tracking-wider mb-2">Simulated Account Scope</p>
            
            {/* User Dropdown Selector */}
            <div className="space-y-2">
              <select 
                className="w-full bg-indigo-900 text-xs text-white border border-indigo-750 p-2.5 rounded-xl outline-none font-bold cursor-pointer"
                value={activeUser?.id || ''}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const foundUser = users.find(u => u.id === selectedId);
                  if (foundUser) {
                    setActiveUser(foundUser);
                    setIsOfficialMode(false);
                  }
                }}
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    Citizen: {u.name}
                  </option>
                ))}
              </select>

              {/* Mode Toggle Button */}
              <button 
                onClick={() => setIsOfficialMode(!isOfficialMode)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isOfficialMode 
                    ? 'bg-amber-400 text-indigo-950 shadow-md shadow-amber-400/20' 
                    : 'bg-indigo-800/80 text-indigo-200 hover:bg-indigo-850'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Official Supervisor Mode
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${isOfficialMode ? 'bg-indigo-900 animate-pulse' : 'bg-slate-500'}`}></span>
              </button>
            </div>

            {/* Simulated Active Stats / Progress Level indicator */}
            {!isOfficialMode && activeUser && (
              <div className="mt-3 pt-3 border-t border-indigo-850/40">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-indigo-200">Active Level</span>
                  <span className="text-amber-300 font-bold font-mono">Lvl {Math.floor(activeUser.points / 100) + 1}</span>
                </div>
                <div className="w-full bg-indigo-950 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(activeUser.points % 100)}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-right text-indigo-300 mt-1">{activeUser.points} XP Dynamic Points</p>
              </div>
            )}

            {isOfficialMode && (
              <div className="mt-3 pt-3 border-t border-indigo-850/40 text-[11px] text-amber-200 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                <span>You can now approve requests, transition issue statuses, and trigger rapid field dispatches.</span>
              </div>
            )}
          </div>

          {/* Navigation Links with indicators */}
          <nav className="space-y-1" id="sidebar_nav">
            <span className="text-[8px] font-mono font-black tracking-widest text-indigo-300 block mb-1">CIVIC PORTAL</span>

            <button 
              onClick={() => { setActiveTab('dashboard'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold tracking-tight transition-all text-left ${
                activeTab === 'dashboard'
                  ? 'bg-amber-400 text-indigo-950 font-black shadow-lg'
                  : 'text-indigo-200 hover:bg-indigo-850/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5 shrink-0" />
              <span>City Dashboard</span>
            </button>

            <button 
              onClick={() => { setActiveTab('reports_feed'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold tracking-tight transition-all text-left ${
                activeTab === 'reports_feed'
                  ? 'bg-amber-400 text-indigo-950 font-black shadow-lg'
                  : 'text-indigo-200 hover:bg-indigo-850/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>Civic Reports Feed</span>
              {issues.length > 0 && (
                <span className="ml-auto bg-indigo-950/60 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {issues.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => { setActiveTab('predictive'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold tracking-tight transition-all text-left ${
                activeTab === 'predictive'
                  ? 'bg-amber-400 text-indigo-950 font-black shadow-lg'
                  : 'text-indigo-200 hover:bg-indigo-850/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>AI Target Analytics</span>
            </button>

            <span className="text-[8px] font-mono font-black tracking-widest text-indigo-305 block pt-2 mb-1">GAP SOLUTIONS</span>

            {/* Gap 1 */}
            <button 
              onClick={() => { setActiveTab('ai_ops'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold tracking-tight transition-all text-left ${
                activeTab === 'ai_ops' ? 'bg-amber-400 text-indigo-950 font-black shadow-lg' : 'text-indigo-200 hover:bg-indigo-850/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5 shrink-0 text-amber-300" />
              <span>1. AI Ops Model</span>
            </button>

            {/* Gap 2 */}
            <button 
              onClick={() => { setActiveTab('small_societies'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold tracking-tight transition-all text-left ${
                activeTab === 'small_societies' ? 'bg-amber-400 text-indigo-950 font-black shadow-lg' : 'text-indigo-200 hover:bg-indigo-850/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 shrink-0 text-amber-300" />
              <span>2. Small Society Excel</span>
            </button>

            {/* Gap 3 */}
            <button 
              onClick={() => { setActiveTab('vendors'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold tracking-tight transition-all text-left ${
                activeTab === 'vendors' ? 'bg-amber-400 text-indigo-950 font-black shadow-lg' : 'text-indigo-200 hover:bg-indigo-850/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 shrink-0 text-amber-300" />
              <span>3. Resolution directory</span>
            </button>

            {/* Gap 4 */}
            <button 
              onClick={() => { setActiveTab('finances'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold tracking-tight transition-all text-left ${
                activeTab === 'finances' ? 'bg-amber-400 text-indigo-950 font-black shadow-lg' : 'text-indigo-200 hover:bg-indigo-850/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 shrink-0 text-amber-300" />
              <span>4. Live balance ledger</span>
            </button>

            {/* Gap 5 */}
            <button 
              onClick={() => { setActiveTab('bot_assistant'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold tracking-tight transition-all text-left ${
                activeTab === 'bot_assistant' ? 'bg-amber-400 text-indigo-950 font-black shadow-lg' : 'text-indigo-200 hover:bg-indigo-850/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0 text-amber-300" />
              <span>5. RWA smart assistant</span>
            </button>

            {/* Gap 6 */}
            <button 
              onClick={() => { setActiveTab('residents'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold tracking-tight transition-all text-left ${
                activeTab === 'residents' ? 'bg-amber-400 text-indigo-950 font-black shadow-lg' : 'text-indigo-200 hover:bg-indigo-850/60'
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0 text-amber-300" />
              <span>6. Resident classifieds</span>
            </button>

            {/* Gap 7 */}
            <button 
              onClick={() => { setActiveTab('remote_owners'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold tracking-tight transition-all text-left ${
                activeTab === 'remote_owners' ? 'bg-amber-400 text-indigo-950 font-black shadow-lg' : 'text-indigo-200 hover:bg-indigo-850/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 shrink-0 text-amber-300" />
              <span>7. Remote landlord gate</span>
            </button>

            <button 
              onClick={() => { setActiveTab('leaderboard'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold tracking-tight transition-all text-left ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-400 text-indigo-950 font-black shadow-lg'
                  : 'text-indigo-200 hover:bg-indigo-850/60'
              }`}
            >
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>Hero Leaderboard</span>
            </button>
          </nav>
        </div>

        {/* Footer info displaying platform credentials */}
        <div className="pt-4 border-t border-indigo-850/65 text-indigo-300 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-[10px] font-semibold text-indigo-150 uppercase tracking-wider">SF Metro Service Active</span>
          </div>
          <p className="text-[9px] text-indigo-400 leading-tight">Empowering community-led urban resilience.</p>
        </div>
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-rose-100/15 shadow-sm px-4 md:px-8 flex items-center justify-between shrink-0" id="main_header">
          <div className="flex items-center gap-3">
            {/* Hamburger responsive toggle switch */}
            <button 
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>

            <div className="flex flex-col">
              <h1 className="text-sm md:text-xl font-display font-black text-indigo-950 uppercase tracking-tight leading-none mb-1">
                {activeTab === 'dashboard' && "Neighborhood Dashboard"}
                {activeTab === 'reports_feed' && "Civic Reports Feed"}
                {activeTab === 'predictive' && "AI Preventative Pipeline"}
                {activeTab === 'leaderboard' && "Civic Hero Leaderboard"}
                {activeTab === 'ai_ops' && "Section 1: AI Operations Mode"}
                {activeTab === 'small_societies' && "Section 2: Self-Managed Cooperatives"}
                {activeTab === 'vendors' && "Section 3: Contractor Marketplace"}
                {activeTab === 'finances' && "Section 4: Treasury Ledger"}
                {activeTab === 'bot_assistant' && "Section 5: AI RWA Assistant"}
                {activeTab === 'residents' && "Section 6: Resident Talents Hub"}
                {activeTab === 'remote_owners' && "Section 7: Landlord Monitor Portal"}
              </h1>
              <p className="text-slate-500 text-[10px] font-semibold flex items-center gap-1 leading-none">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                Live coverage grid: Sector 9 District (SF Area)
              </p>
            </div>
          </div>

          {/* Action buttons (New Complaint submission) */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsNewReportOpen(true)}
              className="bg-indigo-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm tracking-tight shadow-xl shadow-indigo-150 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              id="btn_new_citizen_report"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Report New Issue</span>
              <span className="sm:hidden">Report</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE AREA CONTAINER */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" id="dashboard_body">

          {/* 1. CITY STATS WIDGETS - DISPLAYED ON CORE LANDING */}
          {stats && ['dashboard', 'reports_feed', 'predictive', 'leaderboard'].includes(activeTab) && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="stats_panel">
              
              {/* Card 1 - Total Resolved */}
              <div className="bg-indigo-600 p-5 rounded-[2rem] text-white shadow-xl shadow-indigo-100 flex flex-col justify-between h-36 border border-indigo-500/30 transform hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-wider text-indigo-200">TOTAL RESOLVED</p>
                  <div className="bg-white/10 p-1.5 rounded-full">
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-display font-black leading-none">{stats.resolvedIssuesCount}</p>
                  <p className="text-[11px] text-indigo-200/90 font-medium mt-1">✓ Across all municipal blocks</p>
                </div>
              </div>

              {/* Card 2 - Average Response Time */}
              <div className="bg-white p-5 rounded-[2rem] text-slate-800 border-2 border-slate-100 shadow-md flex flex-col justify-between h-36 transform hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">AVERAGE RESOLUTION</p>
                  <div className="bg-amber-100 p-1.5 rounded-full">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-display font-black leading-none text-indigo-950">
                    {stats.averageResolutionTimeDays} <span className="text-xs font-bold text-slate-400">Days</span>
                  </p>
                  <div className="w-full bg-slate-150 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-amber-500 h-full w-4/5 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Card 3 - Environmental Savings (CO2 Saved) */}
              <div className="bg-emerald-500 p-5 rounded-[2rem] text-white shadow-xl shadow-emerald-100 flex flex-col justify-between h-36 border border-emerald-400/30 transform hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-wider text-emerald-100">CARBON OFFSET</p>
                  <div className="bg-white/10 p-1.5 rounded-full">
                    <Leaf className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-display font-black leading-none">
                    {stats.co2SavedKg} <span className="text-sm font-medium">kg CO₂e</span>
                  </p>
                  <p className="text-[11px] text-emerald-100/90 font-medium mt-1">Saved via localized leak & waste clearance</p>
                </div>
              </div>

              {/* Card 4 - City Security Safety Index Rating */}
              <div className="bg-white p-5 rounded-[2rem] text-slate-800 border-2 border-slate-100 shadow-md flex flex-col justify-between h-36 transform hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">CIVIC SAFETY SCORE</p>
                  <div className="bg-blue-100 p-1.5 rounded-full">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-display font-black leading-none text-indigo-950">{stats.safetyScore}%</p>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">● Healthy Ward Status</p>
                </div>
              </div>

            </section>
          )}

          {/* 2. DYNAMIC WORKSPACE ROUTING PANEL */}

          {/* TAB: DASHBOARD VIEWPORT */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-12 gap-6 items-start" id="view_dashboard_main">
              
              {/* Left Column Feed Snippet */}
              <div className="col-span-12 lg:col-span-5 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-black text-sm text-indigo-950 uppercase tracking-wider">Top Priority Incidents</h2>
                  <button 
                    onClick={() => setActiveTab('reports_feed')}
                    className="text-xs text-indigo-600 font-bold flex items-center gap-1 hover:underline"
                  >
                    View all {issues.length}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3.5">
                  {issues.slice(0, 3).map((issue) => (
                    <div 
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue)}
                      className={`p-4 rounded-3xl border-2 cursor-pointer transition-all ${
                        selectedIssue?.id === issue.id 
                          ? 'bg-amber-50/50 border-amber-400 shadow-lg' 
                          : 'bg-white border-slate-100 hover:border-indigo-300 shadow-sm'
                      }`}
                      id={`priority_card_${issue.id}`}
                    >
                      <div className="flex gap-4">
                        {/* Status / Category Icon */}
                        <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center border ${
                          issue.category === 'Water & Leakage' ? 'bg-cyan-50 border-cyan-100 text-cyan-600' :
                          issue.category === 'Roads & Potholes' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                          issue.category === 'Streetlights' ? 'bg-yellow-50 border-yellow-150 text-yellow-600' :
                          issue.category === 'Sanitation & Waste' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                          'bg-slate-50 border-slate-200 text-slate-500'
                        }`}>
                          {getCategoryIcon(issue.category)}
                        </div>

                        {/* Title and stats layout */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <h3 className="font-bold text-sm text-slate-900 truncate leading-none pt-0.5">{issue.title}</h3>
                            <span className={`text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded-full ${getSeverityBadge(issue.severity)}`}>
                              {issue.severity.toUpperCase()}
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-500 line-clamp-1 mb-2.5">{issue.description}</p>
                          
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 font-medium truncate max-w-[150px]">
                              📍 {issue.address.split(',')[0]}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${getStatusBadge(issue.status)}`}>
                                {issue.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simulated Localized Chart */}
                <div className="bg-white p-5 rounded-[2rem] border-2 border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Classification Density</h3>
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">LIVE METRIC</span>
                  </div>
                  
                  {/* Recharts simplified visual bar chart */}
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748B' }} fontFamily="monospace" />
                        <YAxis tick={{ fontSize: 9, fill: '#64748B' }} />
                        <Tooltip contentStyle={{ background: '#0F172A', color: '#FFF', borderRadius: '12px', border: 'none', fontSize: '11px' }} />
                        <Bar dataKey="count" fill="#4f46e5" radius={[5, 5, 0, 0]}>
                          {getChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4F46E5' : '#10B981'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Right Column Interactive map and dynamic inspection zone */}
              <div className="col-span-12 lg:col-span-7 space-y-6">
                
                {/* Visual Map Sandbox */}
                <div className="relative h-96 bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white shadow-slate-200">
                  
                  {/* Grid Lines Overlay representing real SF coordinates layout */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-slate-800/60"></div>
                  <div className="absolute inset-y-0 left-1/3 w-0.5 bg-slate-800/60"></div>
                  <div className="absolute inset-y-0 left-2/3 w-0.5 bg-slate-800/40"></div>
                  
                  {/* Glowing radar line */}
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 via-transparent to-transparent pulse-glow"></div>

                  {/* Dynamic pin representation of current issue list */}
                  {issues.map(issue => {
                    const isSelected = selectedIssue?.id === issue.id;
                    // Proportional scale on coordinates (SF center: 37.7749, -122.4194)
                    const xOffset = ((issue.longitude + 122.45) / 0.08) * 100;
                    const yOffset = (1 - (issue.latitude - 37.74) / 0.05) * 100;
                    
                    return (
                      <div 
                        key={issue.id}
                        onClick={() => setSelectedIssue(issue)}
                        className="absolute cursor-pointer transition-all duration-300 hover:scale-125 z-10"
                        style={{ left: `${Math.max(10, Math.min(90, xOffset))}%`, top: `${Math.max(10, Math.min(90, yOffset))}%` }}
                      >
                        <div className="relative group">
                          {/* Inner glowing core */}
                          <div className={`w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-xl ${
                            isSelected 
                              ? 'bg-amber-400 scale-125 text-indigo-950 ring-4 ring-amber-400/35' 
                              : 'bg-indigo-600 text-white hover:bg-amber-300 hover:text-indigo-950'
                          }`}>
                            <MapPin className="w-4.5 h-4.5 stroke-[2.5]" />
                          </div>

                          {/* Float visual tooltip overlay */}
                          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-900 border border-slate-750 text-white rounded-xl px-2.5 py-1 whitespace-nowrap text-[10px] font-bold shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity ${isSelected ? 'opacity-100 z-20' : ''}`}>
                            <p className="font-black text-amber-300">{issue.title.slice(0, 25)}...</p>
                            <p className="text-[8px] text-slate-300">{issue.category} • {issue.status}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Custom Map Sandbox controls */}
                  <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 border border-slate-800 text-white max-w-xs">
                    <p className="text-[9px] font-mono font-bold tracking-widest text-amber-400 uppercase">CIVIC MONITORING CONSOLE</p>
                    <p className="text-xs font-bold mt-1 text-slate-150">SF Municipal Precinct</p>
                    <p className="text-[10px] text-slate-400 mt-1">Click any glow pin on the grid to instantly inspect citizen dispatches, comments, and field-work diagnostics.</p>
                  </div>

                  {/* Satellite indicator */}
                  <div className="absolute bottom-4 left-4 bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-850 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>TELEM GRID ACTIVE</span>
                  </div>
                </div>

                {/* Inspect Card Selection Details */}
                {selectedIssue && (
                  <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-lg space-y-5">
                    <div className="flex items-start justify-between flex-wrap gap-2 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${getStatusBadge(selectedIssue.status)}`}>
                            {selectedIssue.status}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${getSeverityBadge(selectedIssue.severity)}`}>
                            {selectedIssue.severity} Severity
                          </span>
                        </div>
                        <h3 className="text-xl font-display font-black text-indigo-950 leading-tight">{selectedIssue.title}</h3>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                          {selectedIssue.address}
                        </p>
                      </div>

                      {/* Community verification action panel */}
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">VALIDATIONS</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleUpvote(selectedIssue.id)}
                            className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all ${
                              selectedIssue.upvotedBy.includes(activeUser?.id || '')
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            👍 Upvote to Verify
                            <span className="font-black bg-white/20 px-1.5 py-0.2 rounded-md">
                              {selectedIssue.upvotes}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Image Attachment (If present) */}
                    {selectedIssue.imageUrl && (
                      <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                        <img 
                          src={selectedIssue.imageUrl} 
                          alt="Incident attachments" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Full Description & Dispatch Notes */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase text-indigo-950/70 tracking-wider">Citizen Report Details</h4>
                      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        "{selectedIssue.description}"
                      </p>
                      <div className="flex items-center gap-1.5 justify-between text-[11px] text-slate-400 font-medium px-1">
                        <span>Reported by: <strong className="text-slate-600 font-bold">{selectedIssue.reporterName}</strong></span>
                        <span>Logged: <strong className="text-slate-600 font-mono font-bold">{new Date(selectedIssue.createdAt).toLocaleDateString()}</strong></span>
                      </div>
                    </div>

                    {/* DYNAMIC AI DISPATCHER MODULE - GENERATED AT INGEST BY SERVER SIDE GEMINI */}
                    {selectedIssue.aiResponse && (
                      <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-3xl space-y-3.5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl"></div>
                        <div className="flex items-center gap-1.5">
                          <div className="bg-indigo-600/10 p-1.5 rounded-xl">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-wider text-indigo-600 block">AUTOMATED SYSTEM DISPATCH</span>
                            <span className="text-xs font-black text-indigo-950 font-display">Gemini AI Dispatch Diagnostics</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="space-y-1">
                            <span className="text-[10px] text-indigo-500 font-bold uppercase block">AI Classified Summary</span>
                            <p className="font-semibold text-indigo-950 bg-white/50 p-2 rounded-xl text-[11px] leading-snug">{selectedIssue.aiResponse.summary}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-indigo-500 font-bold uppercase block">Suggested Mitigation Fieldwork</span>
                            <p className="font-semibold text-indigo-950 bg-white/50 p-2 rounded-xl text-[11px] leading-snug">{selectedIssue.aiResponse.suggestedAction}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 pt-2 text-[11px] font-semibold border-t border-indigo-200/30">
                          <div>
                            <span className="text-[9px] text-indigo-500 font-bold block uppercase">Dispatched Agency</span>
                            <span className="text-indigo-900 line-clamp-1">{selectedIssue.aiResponse.dispatchedTo}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-indigo-500 font-bold block uppercase">Est. Resolution Max</span>
                            <span className="text-indigo-900 font-bold font-mono">{selectedIssue.aiResponse.targetDaysToResolve} Working Days</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-indigo-100 bg-emerald-600 font-bold uppercase px-1.5 py-0.5 rounded-md inline-block mb-1">Impact Offset</span>
                            <span className="text-indigo-950 block text-[10px] leading-none text-emerald-700 font-bold">{selectedIssue.aiResponse.alternativeImpact}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <CommunityActionHub
                      issue={selectedIssue}
                      activeUser={activeUser}
                      pledgeResourceType={pledgeResourceType}
                      pledgeQuantity={pledgeQuantity}
                      isPledging={isPledging}
                      setPledgeResourceType={setPledgeResourceType}
                      setPledgeQuantity={setPledgeQuantity}
                      onPledgeSubmit={handleCreatePledge}
                    />

                    {/* COMMENTS SECTION FROM CITIZEN & DEPUTY OFFICIALS */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase text-indigo-900/60 tracking-wider">Community Verification & Official Log</h4>
                      
                      <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
                        {selectedIssue.comments.length === 0 ? (
                          <p className="text-xs text-slate-400 italic text-center py-4">No validation remarks yet. Help by posting status signals or dispatch corrections below.</p>
                        ) : (
                          selectedIssue.comments.map(c => (
                            <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                                  {c.username}
                                  {c.userRole === 'official' && (
                                    <span className="bg-amber-400 text-indigo-950 text-[9px] font-black uppercase px-1.5 py-0.2 rounded">Official</span>
                                  )}
                                </span>
                                <span className="text-[9px] font-mono text-slate-400">
                                  {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 font-medium leading-relaxed">{c.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Comment Input */}
                      <form onSubmit={handlePostComment} className="flex gap-2">
                        <input 
                          type="text"
                          placeholder={isOfficialMode ? "Type supervisor notes..." : "Enter verification question, detail or note..."}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-indigo-400 text-slate-800"
                        />
                        <button 
                          type="submit"
                          className="bg-indigo-600 text-white rounded-xl px-4 py-2 text-xs font-bold hover:bg-indigo-700 transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>

                    {/* MUNICIPAL OFFICIAL WORK SIMULATOR PANEL - VERY USEFUL FOR DEMONSTRATION */}
                    {isOfficialMode && (
                      <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl space-y-3 pt-4">
                        <div className="flex items-center gap-1.5 pb-2 border-b border-amber-200/50">
                          <Sliders className="w-4 h-4 text-amber-700" />
                          <h4 className="text-xs font-black uppercase text-amber-950 tracking-wider">Official Resolution Sandbox Console</h4>
                        </div>
                        
                        <form onSubmit={handleStatusChangeSimulation} className="grid grid-cols-12 gap-3">
                          <div className="col-span-4">
                            <label className="text-[10px] font-bold text-amber-800 uppercase block mb-1">Transit status</label>
                            <select 
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
                              className="w-full bg-white border border-amber-200 p-2 rounded-xl text-xs outline-none text-slate-800 font-bold"
                            >
                              <option value="Verified">Verified</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved (Closes & Awards Points)</option>
                            </select>
                          </div>

                          <div className="col-span-6">
                            <label className="text-[10px] font-bold text-amber-800 uppercase block mb-1">Response Memo to Citizens</label>
                            <input 
                              type="text"
                              value={officialNotes}
                              onChange={(e) => setOfficialNotes(e.target.value)}
                              placeholder="e.g. Asp halted, hot mix patched today and cleared cones..."
                              className="w-full bg-white border border-amber-200 p-2 rounded-xl text-xs outline-none text-slate-800"
                            />
                          </div>

                          <div className="col-span-2 flex items-end">
                            <button 
                              type="submit"
                              className="w-full bg-amber-500 hover:bg-amber-600 text-indigo-950 font-black py-2 rounded-xl text-xs transition"
                            >
                              Apply
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB: CIVIC REPORTS FEED */}
          {activeTab === 'reports_feed' && (
            <div className="space-y-6" id="view_reports_feed">
              
              {/* Dynamic Filtering Panel */}
              <div className="bg-white p-5 rounded-[2rem] border-2 border-slate-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-3 items-center">
                  
                  {/* Category filters */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-400 mr-1.5 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5" />
                      Category:
                    </span>
                    {['All', 'Roads & Potholes', 'Water & Leakage', 'Streetlights', 'Sanitation & Waste', 'Parks & Public Spaces'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                          categoryFilter === cat 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {cat === 'All' ? 'All' : cat.split(' & ')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

                  {/* Status filters */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-400 mr-1.5">Status:</span>
                    {['All', 'Reported', 'Verified', 'In Progress', 'Resolved'].map((stat) => (
                      <button
                        key={stat}
                        onClick={() => setStatusFilter(stat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                          statusFilter === stat 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {stat}
                      </button>
                    ))}
                  </div>

                </div>

                {/* Text Lookup */}
                <div className="relative">
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search titles, streets, descriptors..."
                    className="bg-slate-100 text-slate-800 font-medium px-4 py-2 pl-9 rounded-xl text-xs w-60 outline-none border border-slate-200 focus:border-indigo-400"
                  />
                  <Compass className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Feed Results & Detail Side Grid */}
              <div className="grid grid-cols-12 gap-6 items-start">
                
                {/* List Box */}
                <div className="col-span-12 lg:col-span-6 space-y-4">
                  {filteredIssues.length === 0 ? (
                    <div className="bg-white p-12 rounded-[2rem] border-2 border-dashed border-slate-200 text-center space-y-3">
                      <AlertTriangle className="w-10 h-10 text-orange-400 mx-auto" />
                      <p className="font-bold text-slate-700">No matching reports identified.</p>
                      <p className="text-xs text-slate-400">Try loosening your category filters or adjusting search strings.</p>
                    </div>
                  ) : (
                    filteredIssues.map((issue) => (
                      <div 
                        key={issue.id}
                        onClick={() => setSelectedIssue(issue)}
                        className={`bg-white p-5 rounded-[2rem] border-2 cursor-pointer transition-all ${
                          selectedIssue?.id === issue.id 
                            ? 'bg-indigo-50/20 border-indigo-500 shadow-md ring-1 ring-indigo-200' 
                            : 'border-slate-150/70 hover:border-indigo-400 shadow-sm'
                        }`}
                      >
                        <div className="flex gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center border ${
                            issue.category === 'Water & Leakage' ? 'bg-cyan-50 border-cyan-100 text-cyan-600' :
                            issue.category === 'Roads & Potholes' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                            issue.category === 'Streetlights' ? 'bg-yellow-50 border-yellow-150 text-yellow-600' :
                            issue.category === 'Sanitation & Waste' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                            'bg-slate-50 border-slate-200 text-slate-500'
                          }`}>
                            {getCategoryIcon(issue.category)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1 mb-1.5">
                              <h3 className="font-display font-black text-slate-800 leading-snug truncate">{issue.title}</h3>
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${getSeverityBadge(issue.severity)}`}>
                                {issue.severity}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{issue.description}</p>
                            
                            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                              <span className="text-slate-400 font-bold truncate max-w-[200px]">📍 {issue.address}</span>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${getStatusBadge(issue.status)}`}>
                                  {issue.status}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">👍 {issue.upvotes} Upvotes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Inspect Side panel */}
                <div className="col-span-12 lg:col-span-6">
                  {selectedIssue ? (
                    <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-md space-y-6">
                      <div className="flex justify-between items-start border-b border-slate-150/60 pb-4">
                        <div>
                          <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase rounded-full ${getStatusBadge(selectedIssue.status)} mr-2`}>
                            {selectedIssue.status}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">ID: {selectedIssue.id}</span>
                          <h2 className="text-xl font-display font-black text-indigo-950 leading-tight mt-1">{selectedIssue.title}</h2>
                          <p className="text-xs text-slate-400 font-medium mt-1">🏷️ {selectedIssue.category}</p>
                        </div>

                        <button 
                          onClick={() => handleUpvote(selectedIssue.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            selectedIssue.upvotedBy.includes(activeUser?.id || '')
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-indigo-850'
                          }`}
                        >
                          👍 {selectedIssue.upvotes} Upvotes
                        </button>
                      </div>

                      {/* Detail Coordinates and map pinpointing */}
                      <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 grid grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">LOCATION COORDINATES</span>
                          <p className="text-slate-700 truncate">LAT: {selectedIssue.latitude.toFixed(4)}</p>
                          <p className="text-slate-700 truncate">LNG: {selectedIssue.longitude.toFixed(4)}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5 font-bold">POSTAL PHYSICAL</span>
                          <p className="text-slate-700 line-clamp-2 leading-snug">{selectedIssue.address}</p>
                        </div>
                      </div>

                      {selectedIssue.imageUrl && (
                        <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-100">
                          <img src={selectedIssue.imageUrl} alt="Dispatch attachment" className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Detail text */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black uppercase text-indigo-950/70 block tracking-widest">Incident Narrative</span>
                        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                          "{selectedIssue.description}"
                        </p>
                      </div>

                      {/* AI Dispatch Diagnosis */}
                      {selectedIssue.aiResponse && (
                        <div className="bg-indigo-900 text-white p-5 rounded-3xl space-y-4 shadow-xl shadow-indigo-150/40 relative">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-300 animate-bounce" />
                            <span className="text-xs font-display font-black text-amber-300 tracking-wider">PRESCRIBED MITIGATION WORK-PLAN (AI)</span>
                          </div>
                          <div className="space-y-2 text-xs">
                            <p><strong className="text-indigo-200">Incident Target Scope:</strong> {selectedIssue.aiResponse.summary}</p>
                            <p><strong className="text-indigo-200">Mitigation Strategy:</strong> {selectedIssue.aiResponse.suggestedAction}</p>
                            <p><strong className="text-indigo-200">Dispatched Authority Office:</strong> {selectedIssue.aiResponse.dispatchedTo}</p>
                            <p><strong className="text-indigo-200">Target Resolution Ceiling:</strong> Within {selectedIssue.aiResponse.targetDaysToResolve} days</p>
                            <div className="pt-2 border-t border-indigo-800 text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                              🍃 {selectedIssue.aiResponse.alternativeImpact}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="pt-2">
                        <CommunityActionHub
                          issue={selectedIssue}
                          activeUser={activeUser}
                          pledgeResourceType={pledgeResourceType}
                          pledgeQuantity={pledgeQuantity}
                          isPledging={isPledging}
                          setPledgeResourceType={setPledgeResourceType}
                          setPledgeQuantity={setPledgeQuantity}
                          onPledgeSubmit={handleCreatePledge}
                        />
                      </div>

                    </div>
                  ) : (
                    <div className="bg-white p-12 rounded-[2.5rem] text-center border-2 border-dashed border-slate-200">
                      <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="font-bold text-slate-700">No issue active for inspection.</p>
                      <p className="text-xs text-slate-400">Click on any reports from the feed to view full details.</p>
                    </div>
                  )}
                </div>

              </div>
              
            </div>
          )}

          {/* TAB: PREDICTIVE INSIGHTS */}
          {activeTab === 'predictive' && (
            <div className="space-y-6" id="view_predictive_insights">
              
              {/* Alert Intro header */}
              <div className="bg-indigo-900 p-6 rounded-[2.5rem] text-white shadow-xl flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800/30 rounded-full blur-3xl"></div>
                <div className="space-y-2 relative max-w-xl">
                  <span className="bg-amber-400 text-indigo-950 font-black text-[9px] tracking-widest px-2.5 py-0.5 rounded-full uppercase">
                    GEMINI ENGINE ACTIVE
                  </span>
                  <h2 className="text-2xl font-display font-black uppercase tracking-tight">Preventative Asset Maintenance Forecast</h2>
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    By feeding telemetry lists of road surface cracks, light deficiencies, and water main pressure markers, our engine calculates infrastructural micro-breakdown spots before full physical failures materialize.
                  </p>
                </div>
                <Sparkles className="w-16 h-16 text-amber-300/30 mr-5 hidden md:block" />
              </div>

              {/* Forecast summary */}
              {predictiveInsights && (
                <div className="bg-amber-50 border border-amber-200/60 p-5 rounded-3xl flex items-center gap-3">
                  <div className="p-2 bg-amber-400 text-indigo-950 rounded-2xl">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider">Live Regional Forecast Summary</h4>
                    <p className="text-xs text-indigo-950 font-medium mt-0.5">"{predictiveInsights.forecastSummary}"</p>
                  </div>
                </div>
              )}

              {/* Three dynamic predictions */}
              <div className="grid grid-cols-3 gap-6">
                {predictiveInsights?.insights ? (
                  predictiveInsights.insights.map((ins: any, idx: number) => (
                    <div 
                      key={ins.id || idx}
                      className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-md flex flex-col justify-between space-y-4 hover:border-indigo-400 transition"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className={`text-[9px] font-mono font-black tracking-widest uppercase border px-2 py-0.5 rounded ${
                            ins.riskScore >= 80 ? 'bg-red-50 text-red-600 border-red-250' :
                            ins.riskScore >= 70 ? 'bg-orange-50 text-orange-600 border-orange-200' :
                            'bg-amber-50 text-amber-600 border-amber-200'
                          }`}>
                            Risk Rating {ins.riskScore}%
                          </span>
                          
                          <span className="text-[10px] text-slate-400 font-bold font-mono">#{idx+1} Pipeline</span>
                        </div>

                        <h3 className="font-display font-black text-indigo-950 text-base leading-snug">{ins.hazardName}</h3>
                        
                        <div className="space-y-2 text-xs">
                          <p><strong className="text-slate-400 font-bold uppercase text-[9px] block">Vulnerable Target Scope</strong> 📍 {ins.location}</p>
                          <p className="text-slate-600 leading-normal"><strong className="text-slate-400 font-bold uppercase text-[9px] block">Causal Indicators</strong> {ins.indicator}</p>
                          <p className="text-slate-600 leading-normal bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/30"><strong className="text-indigo-600 font-black uppercase text-[9px] block">Suggested Preventative Fix</strong> {ins.recommendedActivity}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/20">
                        <span className="font-black text-slate-400 text-[10px] uppercase">EST. MITIGATION SAVING</span>
                        <span className="font-mono text-emerald-700 font-black text-sm">{ins.estimatedDamageAvoidanceSavings}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 space-y-3">
                    <Clock className="w-8 h-8 text-indigo-400 mx-auto animate-spin" />
                    <p className="font-bold text-slate-700">Downloading fresh predictive asset telemetry...</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB: LEADERBOARD & CIVIC HERO RECOGNITION */}
          {activeTab === 'leaderboard' && (
            <div className="grid grid-cols-12 gap-6 items-start" id="view_leaderboard">
              
              {/* Leaderboard Podiums / top ranks */}
              <div className="col-span-8 bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-md space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-display font-black text-indigo-950 text-lg uppercase">Civic Pioneers Leaderboard</h3>
                    <p className="text-xs text-slate-400 font-semibold">Updated immediately as verification and reports are completed</p>
                  </div>
                  <Award className="w-7 h-7 text-amber-500 stroke-[2.5]" />
                </div>

                {/* Table list */}
                <div className="space-y-3">
                  {users.map((profile, index) => (
                    <div 
                      key={profile.id}
                      className={`p-4 rounded-3xl border flex items-center justify-between gap-4 transition ${
                        activeUser?.id === profile.id 
                          ? 'bg-indigo-50/30 border-indigo-400 shadow-sm' 
                          : 'bg-slate-50 border-slate-100/80 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Rank Circle badge */}
                        <div className={`w-8 h-8 rounded-full font-black font-mono text-xs flex items-center justify-center border-2 ${
                          index === 0 ? 'bg-amber-100 border-amber-400 text-amber-800' :
                          index === 1 ? 'bg-slate-150 border-slate-300 text-slate-700' :
                          index === 2 ? 'bg-orange-100 border-orange-350 text-orange-850' :
                          'bg-white border-slate-200 text-slate-500'
                        }`}>
                          {index + 1}
                        </div>

                        {/* Name / email logs */}
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{profile.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono font-medium">{profile.email}</p>
                        </div>
                      </div>

                      {/* Score metrics */}
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dispatched Reports</p>
                          <p className="font-mono text-xs font-black text-slate-700">{profile.reportsCreated} Incidents</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verifications Made</p>
                          <p className="font-mono text-xs font-black text-slate-700">{profile.verificationsCompleted} Checks</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dynamic Points</p>
                          <p className="font-mono text-sm font-black text-indigo-650">{profile.points} XP</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side badge showcase panel */}
              <div className="col-span-4 bg-indigo-950 p-6 rounded-[2.5rem] text-white space-y-6 shadow-xl">
                <div className="space-y-1">
                  <h3 className="font-display font-black text-amber-400 text-sm uppercase">Community Merits Badge System</h3>
                  <p className="text-[11px] text-indigo-200">Unlock these medals by actively contributing telemetry & reporting structural anomalies.</p>
                </div>

                <div className="space-y-4">
                  {activeUser && (
                    <div className="bg-indigo-900/60 p-4 rounded-3xl border border-indigo-850">
                      <p className="text-[10px] text-amber-400 font-mono uppercase font-bold tracking-wider mb-2.5">
                        {activeUser.name}'s Showcase
                      </p>
                      
                      <div className="space-y-3.5">
                        {activeUser.badges.map(b => (
                          <div key={b.id} className="flex gap-3 items-start">
                            <div className="bg-amber-400 p-1.5 rounded-xl text-indigo-950 transform hover:-rotate-6 transition">
                              <Award className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold leading-tight">{b.title}</p>
                              <p className="text-[10px] text-indigo-200 mt-0.5 leading-snug">{b.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-[10px] text-indigo-400 font-mono uppercase font-black">All Civic Badge Challenges</p>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="p-2.5 bg-indigo-900/40 rounded-xl border border-indigo-850 flex items-center justify-between text-indigo-200">
                        <span>🚀 Pothole Patrol</span>
                        <span className="text-[9px] bg-indigo-855 text-indigo-300 px-2 py-0.5 font-bold rounded-md">5 Reports</span>
                      </div>
                      <div className="p-2.5 bg-indigo-900/40 rounded-xl border border-indigo-850 flex items-center justify-between text-indigo-200">
                        <span>💧 Water Sentinel</span>
                        <span className="text-[9px] bg-indigo-855 text-indigo-300 px-2 py-0.5 font-bold rounded-md">8 Verifications</span>
                      </div>
                      <div className="p-2.5 bg-indigo-900/40 rounded-xl border border-indigo-850 flex items-center justify-between text-indigo-200">
                        <span>🌟 First Responder</span>
                        <span className="text-[9px] bg-indigo-855 text-indigo-300 px-2 py-0.5 font-bold rounded-md">First Verify</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* GAP 1: AI-powered society operations */}
          {activeTab === 'ai_ops' && (
            <div id="view_ai_ops">
              <AIOperations issues={issues} />
            </div>
          )}

          {/* GAP 2: Small societies WhatsApp & Excel simulation */}
          {activeTab === 'small_societies' && (
            <div id="view_small_societies">
              <SmallSocietyExcelWhatsApp />
            </div>
          )}

          {/* GAP 3: Local Contractor/Vendor resolve directory */}
          {activeTab === 'vendors' && (
            <div id="view_vendors">
              <VendorEcosystem 
                vendors={vendors} 
                issues={issues} 
                onUpdateIssueStatus={onUpdateIssueStatus} 
              />
            </div>
          )}

          {/* GAP 4: Finance audit-ready live ledger sheet & OCR invoice */}
          {activeTab === 'finances' && (
            <div id="view_finances">
              <FinanceTransparency 
                records={financeRecords} 
                activeUser={activeUser}
                onAddRecord={(newRecord) => setFinanceRecords(prev => [newRecord, ...prev])}
              />
            </div>
          )}

          {/* GAP 5: Local resident audio/text prompt assistant bot */}
          {activeTab === 'bot_assistant' && (
            <div id="view_bot_assistant">
              <LocalAIAssistant activeUser={activeUser} />
            </div>
          )}

          {/* GAP 6: Resident skills, fleet and fleamembers hub */}
          {activeTab === 'residents' && (
            <div id="view_residents">
              <ResidentEngagement />
            </div>
          )}

          {/* GAP 7: Remote property landlord monitor gate */}
          {activeTab === 'remote_owners' && (
            <div id="view_remote_owners">
              <RemoteOwnerDashboard 
                issues={issues} 
                onUpdateIssueStatus={onUpdateIssueStatus} 
              />
            </div>
          )}

        </div>

      </main>

      {/* NEW COMPLAINT SUBMISSION MODAL */}
      {isNewReportOpen && (
        <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4" id="modal_report_overlay">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-indigo-900 px-8 py-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-black">TELEMETRY INITIATOR</span>
                <h3 className="text-xl font-display font-black uppercase tracking-tight">Initiate Field Dispatch Complaint</h3>
              </div>
              <button 
                onClick={() => setIsNewReportOpen(false)}
                className="p-1.5 rounded-full hover:bg-indigo-800 text-indigo-200 transition"
              >
                <X className="w-5 h-5 shadow-sm" />
              </button>
            </div>

            {/* Modal Content Form */}
            <form onSubmit={handleCreateReport} className="flex-1 overflow-y-auto p-8 space-y-5">
              {submitError && (
                <div className="p-3.5 bg-red-50 border border-red-250 text-red-700 text-xs font-bold rounded-2xl">
                  ⚠️ {submitError}
                </div>
              )}

              {/* Title parameters */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-indigo-950/70 tracking-wider">Report Subject Title *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Damaged Water Trunk Spillage, Deep crater after crosswalk..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100/80 rounded-2xl px-4 py-3 text-xs outline-none focus:border-indigo-500 text-slate-800"
                />
              </div>

              {/* Row: Category and Severity selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-indigo-950/70 tracking-wider">Issue Classification</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as IssueCategory)}
                    className="w-full bg-slate-50 border-2 border-slate-100/80 rounded-2xl px-4 py-3 text-xs outline-none focus:border-indigo-500 text-slate-800 font-bold"
                  >
                    <option value="Roads & Potholes">Roads & Potholes</option>
                    <option value="Water & Leakage">Water & Leakage</option>
                    <option value="Streetlights">Streetlights</option>
                    <option value="Sanitation & Waste">Sanitation & Waste</option>
                    <option value="Parks & Public Spaces">Parks & Public Spaces</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-indigo-950/70 tracking-wider">Calculated Severity Rating</label>
                  <select 
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as IssueSeverity)}
                    className="w-full bg-slate-50 border-2 border-slate-100/80 rounded-2xl px-4 py-3 text-xs outline-none focus:border-indigo-500 text-slate-800 font-bold"
                  >
                    <option value="Low">Low (Minor aesthetic concern)</option>
                    <option value="Medium">Medium (Affecting local commute/pedestrians)</option>
                    <option value="High">High (Dangerous vehicular safety hazard)</option>
                    <option value="Critical">Critical (Severe infrastructure collapse/pipe burst)</option>
                  </select>
                </div>
              </div>

              {/* FEATURE: INTERACTIVE ACOUSTIC LEAK SNIFFER CALIBRATION */}
              {newCategory === "Water & Leakage" && (
                <div className="bg-cyan-50 border-2 border-cyan-150 p-5 rounded-3xl space-y-3.5 relative" id="acoustic_sniffer_calibrator_container">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                    <span>ACTIVE SONIC MIC</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="bg-cyan-600/15 p-2 rounded-xl text-cyan-600">
                      <Volume2 className="w-4.5 h-4.5 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-indigo-950 font-display">Sonic Acoustic Sniffer Calibration</h4>
                      <p className="text-[10px] text-slate-500 leading-snug">Calibrate your phone micro-sensor signal with local pipe water vibrations to record acoustic metrics.</p>
                    </div>
                  </div>

                  {/* Active Toggle Switch */}
                  <div className="flex justify-between items-center bg-cyan-900/5 px-4 py-2.5 rounded-xl border border-cyan-100">
                    <span className="text-[11px] font-bold text-slate-700">Attach Sonic Acoustic Signature Checklist</span>
                    <button
                      type="button"
                      onClick={() => setAcousticActive(!acousticActive)}
                      className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out font-mono outline-none ${
                        acousticActive ? 'bg-cyan-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          acousticActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      ></span>
                    </button>
                  </div>

                  {acousticActive && (
                    <div className="space-y-4 pt-1" id="sniffer_sliders">
                      {/* Frequency Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-655">Subterranean Vibration Pitch</span>
                          <span className="text-cyan-700 font-mono font-black">{acousticHz} Hz</span>
                        </div>
                        <input
                          type="range"
                          min={100}
                          max={1500}
                          step={10}
                          value={acousticHz}
                          onChange={(e) => setAcousticHz(Number(e.target.value))}
                          className="w-full h-1 bg-cyan-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                        />
                        <div className="flex justify-between text-[8px] font-bold text-slate-400">
                          <span>Low rumble (Heavy main break)</span>
                          <span>High squeal (Minor pinhole seepage)</span>
                        </div>
                      </div>

                      {/* Decibel Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-655">Acoustic Signal Amplitude Volume</span>
                          <span className="text-cyan-700 font-mono font-black">{acousticDb} dB</span>
                        </div>
                        <input
                          type="range"
                          min={20}
                          max={120}
                          step={5}
                          value={acousticDb}
                          onChange={(e) => setAcousticDb(Number(e.target.value))}
                          className="w-full h-1 bg-cyan-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                        />
                        <div className="flex justify-between text-[8px] font-bold text-slate-400">
                          <span>Distant flow (20 dB)</span>
                          <span>Extremely deafening rush (120 dB)</span>
                        </div>
                      </div>

                      {/* Diagnostic Signature result panel */}
                      <div className="p-3 rounded-2xl bg-white border border-cyan-150/60 flex items-start gap-2.5">
                        <Activity className="w-4.5 h-4.5 text-cyan-600 mt-0.5 shrink-0" />
                        <div className="text-[10px] leading-snug">
                          <strong className="text-cyan-800 font-bold uppercase tracking-wide block">SNIFFER PITCH READ-OUT</strong>
                          <span>
                            {acousticHz < 400 
                              ? 'Low frequency waves indicate heavy sewer structural rupture + potential sinkhole formation. Recommended DPW response priority: Extreme Urgent.'
                              : 'High pitch resonance indicates stable water piping with high pressure pinhole leaks. Recommended DPW response priority: Priority Repair.'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Physical Coordinates Map Presets Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-indigo-950/70 tracking-wider">Precinct Intersection Address Location *</label>
                
                {/* Visual coordinate selector options */}
                <div className="flex flex-wrap gap-1.5">
                  {coordinatePresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition ${
                        newAddress === preset.address 
                          ? 'bg-indigo-600 border-indigo-600 text-white' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      📍 {preset.name.split(' / ')[0]}
                    </button>
                  ))}
                </div>

                <input 
                  type="text"
                  required
                  placeholder="e.g., 4th St & Market St, San Francisco, CA"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100/80 rounded-2xl px-4 py-3 text-xs outline-none focus:border-indigo-500 text-slate-800"
                />
              </div>

              {/* Description Details block */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-indigo-950/70 tracking-wider">Hazard Description & Telemetry detail *</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Explain exactly what is wrong. Describe diameter of pothole, speed of water gushing flow, or threat levels..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100/80 rounded-2xl px-4 py-3 text-xs outline-none focus:border-indigo-500 text-slate-800"
                />
              </div>

              {/* Media input Base64 simulator */}
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-indigo-950/70 tracking-wider">Attach Field Photo Evidence (Optional)</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-4 transition-all text-center relative pointer duration-200">
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {newImage ? (
                    <div className="space-y-2">
                      <p className="text-xs text-emerald-600 font-bold">✓ Evidence Photo loaded successfully!</p>
                      <img src={newImage} alt="Attachment evidence" className="mx-auto max-h-24 rounded-lg object-contain shadow-sm border" />
                      <button 
                        type="button" 
                        onClick={(e) => { e.preventDefault(); setNewImage(''); }}
                        className="text-[10px] text-red-500 hover:underline block mx-auto font-bold"
                      >
                        Remove Selected Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-slate-500">
                      <Upload className="w-6 h-6 mx-auto text-slate-400" />
                      <p className="text-xs font-bold">Drag and drop or search local photo file</p>
                      <p className="text-[10px] text-slate-400">JPEG, PNG accepted (Max size 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Hint about Gemini Realtime Category Verification Dispatch */}
              <div className="bg-indigo-50 border border-indigo-150 p-4 rounded-2xl flex items-start gap-2 text-[11px] text-indigo-900">
                <Sparkles className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5 animate-pulse" />
                <p className="leading-snug">
                  <strong>Gemini AI Integration:</strong> On submit, the AI Dispatcher instantly runs schema-based diagnostics to assign work-gang units, verify classification categories, and generate public impact statements.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 justify-end">
                <button 
                  type="button"
                  onClick={() => setIsNewReportOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 text-white px-7 py-2.5 rounded-full font-black text-xs shadow-xl shadow-indigo-150 hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5 transition"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      Dispatching AI diagnostics...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit & Dispatch Now
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
