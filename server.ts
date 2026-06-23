import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Modality } from "@google/genai";
import dotenv from "dotenv";
import { Issue, Comment, UserProfile, CityStats, IssueCategory, IssueSeverity, IssueStatus } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parser with large limit for image uploads
app.use(express.json({ limit: "15mb" }));
app.use(cors());

// Initialize Gemini SDK with User-Agent header as required by guidelines
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini client successfully initialized.");
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
  }
} else {
  console.log("No valid GEMINI_API_KEY found, server will use rule-based fallback analyzer.");
}

// Global In-Memory Database
const mockUsers: UserProfile[] = [
  {
    id: "user-1",
    name: "Elena Rostova",
    email: "elena.r@community.org",
    points: 240,
    reportsCreated: 12,
    verificationsCompleted: 18,
    resolvedContributed: 5,
    badges: [
      { id: "b1", title: "Pothole Patrol", description: "Reported 5 road issues", unlockedAt: "2026-05-12", icon: "CheckCircle", color: "bg-blue-100 text-blue-700 border-blue-200" },
      { id: "b2", title: "Water Sentinel", description: "Verified 10 leakage reports", unlockedAt: "2026-06-02", icon: "Droplet", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
      { id: "b3", title: "Civic Vanguard", description: "Reached over 200 contribution points", unlockedAt: "2026-06-15", icon: "Award", color: "bg-amber-100 text-amber-700 border-amber-200" }
    ]
  },
  {
    id: "user-2",
    name: "Marcus Chen",
    email: "marcus.c@metro.net",
    points: 165,
    reportsCreated: 7,
    verificationsCompleted: 11,
    resolvedContributed: 3,
    badges: [
      { id: "b1", title: "First Responder", description: "First to verify a newly created issue", unlockedAt: "2026-05-20", icon: "Flame", color: "bg-orange-100 text-orange-700 border-orange-200" },
      { id: "b4", title: "Bright Lights", description: "Reported more than 3 lighting hazards", unlockedAt: "2026-06-10", icon: "Lightbulb", color: "bg-yellow-100 text-yellow-700 border-yellow-200" }
    ]
  },
  {
    id: "user-3",
    name: "Sanya G.",
    email: "sanya.green@eco.com",
    points: 110,
    reportsCreated: 4,
    verificationsCompleted: 8,
    resolvedContributed: 2,
    badges: [
      { id: "b5", title: "Sanitation Sage", description: "Created 3 approved waste clean reports", unlockedAt: "2026-06-11", icon: "Trash2", color: "bg-green-100 text-green-700 border-green-200" }
    ]
  }
];

let issues: Issue[] = [
  {
    id: "issue-1001",
    title: "Severe Road Deformation and Deep Pothole",
    description: "Extremely deep pothole in the middle lane causing cars to swerve dangerously. Several drivers have damaged their suspensions here. This is located right after the intersection close to the school crossing.",
    category: "Roads & Potholes",
    severity: "High",
    latitude: 37.7749,
    longitude: -122.4194,
    address: "850 Mission St (near 5th St), San Francisco, CA",
    upvotes: 24,
    upvotedBy: ["user-2", "user-3"],
    flags: 0,
    flaggedBy: [],
    status: "Verified",
    createdAt: "2026-06-21T10:30:00Z",
    updatedAt: "2026-06-22T08:15:00Z",
    reporterName: "Marcus Chen",
    reporterId: "user-2",
    pledges: [
      { id: "pl-1", userId: "user-3", issueId: "issue-1001", name: "Sanya G.", resourceType: "Traffic Cones", quantity: 3, createdAt: "2026-06-22T08:00:00Z" }
    ],
    aiResponse: {
      summary: "High hazard road cavity in high-traffic lane near pedestrian/school crossing zone.",
      suggestedAction: "Mobilize pavement patch truck and set up safety cones immediately. Requires hot-mix asphalt filling.",
      targetDaysToResolve: 2,
      dispatchedTo: "Department of Public Works - Road Maintenance Team Block 4",
      alternativeImpact: "Resolving prevents vehicular alignment damage and mitigates collision risks at the major school crossing intersection."
    },
    comments: [
      {
        id: "c-1",
        issueId: "issue-1001",
        username: "Elena Rostova",
        userRole: "citizen",
        text: "I almost ran right into this last night! It has gotten much deeper because of the recent rainfall.",
        createdAt: "2026-06-21T12:00:00Z"
      },
      {
        id: "c-2",
        issueId: "issue-1001",
        username: "Marcus Chen",
        userRole: "citizen",
        text: "I placed a temporary neon orange trash bin in front of it so others can spot it in the dark.",
        createdAt: "2026-06-21T14:40:00Z"
      }
    ]
  },
  {
    id: "issue-1002",
    title: "Water Main Leak and Pipe Burst",
    description: "Significant water is gushing flat out of the sidewalk alignment near the public transit stop. Thousands of gallons are being wasted, making the curb slippery and flooding the gutter.",
    category: "Water & Leakage",
    severity: "Critical",
    latitude: 37.7849,
    longitude: -122.4094,
    address: "4th St & Market St Corner, San Francisco, CA",
    upvotes: 43,
    upvotedBy: ["user-1", "user-3"],
    flags: 0,
    flaggedBy: [],
    status: "In Progress",
    createdAt: "2026-06-22T06:00:00Z",
    updatedAt: "2026-06-22T09:30:00Z",
    reporterName: "Elena Rostova",
    reporterId: "user-1",
    acousticHz: 345,
    acousticDb: 68,
    pledges: [
      { id: "pl-2", userId: "user-2", issueId: "issue-1002", name: "Marcus Chen", resourceType: "Labor (Hours)", quantity: 4, createdAt: "2026-06-22T10:00:00Z" }
    ],
    aiResponse: {
      summary: "Sidewalk rupture connected to main culinary water line gushing public water directly on high-pedestrian commerce transit hub.",
      suggestedAction: "Deploy immediate utility valve isolation crew to intercept water loss. Assign pipeline repair technicians to excavate concrete and patch the burst section.",
      targetDaysToResolve: 1,
      dispatchedTo: "Water Authority Emergency Response Division",
      alternativeImpact: "Saves up to 15,000 gallons of treated municipal water daily. Prevents sidewalk structural destabilization (washouts) and ensures safety for transit commuters."
    },
    comments: [
      {
        id: "c-3",
        issueId: "issue-1002",
        username: "Muni Dispatcher",
        userRole: "official",
        text: "An emergency work order has been created. Crews are dispatched to shut off the trunk valve first.",
        createdAt: "2026-06-22T09:30:00Z"
      }
    ]
  },
  {
    id: "issue-1003",
    title: "Broken Streetlight at Pedestrian Island",
    description: "The street light in the middle island dividing the avenue has been completely dark for over a week. At night, drivers cannot spot pedestrians starting to cross. Extremely dangerous blackspot.",
    category: "Streetlights",
    severity: "High",
    latitude: 37.7649,
    longitude: -122.4294,
    address: "Castro St & 18th St, San Francisco, CA",
    upvotes: 18,
    upvotedBy: ["user-1"],
    flags: 0,
    flaggedBy: [],
    status: "Reported",
    createdAt: "2026-06-22T21:15:00Z",
    updatedAt: "2026-06-22T21:15:00Z",
    reporterName: "Elena Rostova",
    reporterId: "user-1",
    pledges: [],
    aiResponse: {
      summary: "Darkness corridor on pedestrian safety refuge island inside heavily transited commercial precinct.",
      suggestedAction: "Dispatch electrical service squad to replace burnt out 150W LED luminaire or check local junction circuit.",
      targetDaysToResolve: 3,
      dispatchedTo: "City Lighting & Bureau of Energy Control",
      alternativeImpact: "Drastically reduces collision likelihood of pedestrians crossing at dark hours by re-establishing overhead warning illuminate."
    },
    comments: []
  },
  {
    id: "issue-1004",
    title: "Illegal Trash Dumping in Community Park Corner",
    description: "Someone left two old non-functioning refrigerators and a stack of construction wood pallets right at the corner of Franklin Park, blocking the playground entrance trail.",
    category: "Sanitation & Waste",
    severity: "Medium",
    latitude: 37.7549,
    longitude: -122.4094,
    address: "Franklin Square Park, San Francisco, CA",
    upvotes: 12,
    upvotedBy: ["user-2"],
    flags: 0,
    flaggedBy: [],
    status: "Resolved",
    createdAt: "2026-06-20T08:00:00Z",
    updatedAt: "2026-06-21T16:00:00Z",
    reporterName: "Sanya G.",
    reporterId: "user-3",
    pledges: [
      { id: "pl-3", userId: "user-1", issueId: "issue-1004", name: "Elena Rostova", resourceType: "Sacks & Bins", quantity: 5, createdAt: "2026-06-20T12:00:00Z" }
    ],
    aiResponse: {
      summary: "Commercial and hazardous appliance litter obstructing secondary leisure entrance of family recreation park.",
      suggestedAction: "Deploy heavy debris loader or bulk junk vehicle to retrieve appliances. Check appliance compressors for toxic cooling gases before disposal.",
      targetDaysToResolve: 4,
      dispatchedTo: "Sanitation Department - Bulk Waste Extraction Team",
      alternativeImpact: "Reclaims kid-friendly corridor access space, eliminates hazards associated with trapped child entry in old doors, and improves surrounding visual ecology."
    },
    comments: [
      {
        id: "c-4",
        issueId: "issue-1004",
        username: "City Rec Services",
        userRole: "official",
        text: "Heavy extraction truck has cleared the appliances. The wood pallets have also been recycled.",
        createdAt: "2026-06-21T15:30:00Z"
      },
      {
        id: "c-5",
        issueId: "issue-1004",
        username: "Sanya G.",
        userRole: "citizen",
        text: "Looks totally clean now! Thank you so much for the quick response. Team is legendary!",
        createdAt: "2026-06-21T16:00:00Z"
      }
    ]
  },
  {
    id: "issue-1005",
    title: "Collapsed Guardrail at Steep Road Curve",
    description: "The metal safety guardrail has been crashed into and completely collapsed down into the ditch along the steep winding curve on Twin Peaks Boulevard. Any vehicle losing traction could crash off-road.",
    category: "Roads & Potholes",
    severity: "Critical",
    latitude: 37.7544,
    longitude: -122.4478,
    address: "Twin Peaks Blvd (Upper Curve near Overlook), San Francisco, CA",
    upvotes: 35,
    upvotedBy: ["user-1", "user-2", "user-3"],
    flags: 0,
    flaggedBy: [],
    status: "In Progress",
    createdAt: "2026-06-22T14:30:00Z",
    updatedAt: "2026-06-23T01:00:00Z",
    reporterName: "Marcus Chen",
    reporterId: "user-2",
    pledges: [],
    aiResponse: {
      summary: "Structural vehicle containment barrier failure on steep mountain scenic route. Vehicles are exposed to a 40-foot drop-off risk.",
      suggestedAction: "Erect heavy illuminated temporary concrete water barriers along the exposed segment immediately. Coordinate rapid welded repair of structural rail posts.",
      targetDaysToResolve: 2,
      dispatchedTo: "Department of Transportation Engineering and Highway Safety",
      alternativeImpact: "Guarantees life-safety protection for tourists and regional commuters driving in hazardous fog conditions on SF summits."
    },
    comments: [
      {
        id: "c-6",
        issueId: "issue-1005",
        username: "Metro Safety Team",
        userRole: "official",
        text: "Concrete delineator blocks have been positioned as an interim safety wall until heavy welding commences.",
        createdAt: "2026-06-23T01:00:00Z"
      }
    ]
  }
];

// Helper to calculate statistics
function calculateStats(): CityStats {
  const total = issues.length;
  const resolved = issues.filter(i => i.status === "Resolved").length;
  const progress = issues.filter(i => i.status === "In Progress").length;
  const reported = issues.filter(i => i.status === "Reported" || i.status === "Verified").length;

  // Static carbon offsets / saving estimates:
  // Water leaks resolved: saves gallons * kg co2 treating water
  // Potholes/roads repaired: avoids traffic slow-down carbon waste
  // Trash cleared: recycled items offset
  const leakResolvedCount = issues.filter(i => i.category === "Water & Leakage" && i.status === "Resolved").length + 2; // + offset
  const trashResolvedCount = issues.filter(i => i.category === "Sanitation & Waste" && i.status === "Resolved").length + 4;

  const co2Saved = (leakResolvedCount * 85) + (trashResolvedCount * 140) + 120; // Simulated accumulation
  const sortedPoints = mockUsers.reduce((acc, curr) => acc + curr.points, 0);

  // Safety Score starts at 74 and rises based on resolving critical issues, decreases for unresolved critical issues
  const openCriticalIssues = issues.filter(i => i.severity === "Critical" && i.status !== "Resolved").length;
  const openHighIssues = issues.filter(i => i.severity === "High" && i.status !== "Resolved").length;
  const basicSafety = Math.max(40, Math.min(100, 95 - (openCriticalIssues * 12) - (openHighIssues * 5) + (resolved * 3)));

  return {
    totalIssuesCount: total + 42, // Add historical simulation counts
    resolvedIssuesCount: resolved + 31,
    inProgressIssuesCount: progress,
    reportedIssuesCount: reported,
    averageResolutionTimeDays: 2.4,
    pointsDistributed: sortedPoints + 450,
    co2SavedKg: co2Saved,
    safetyScore: Math.round(basicSafety)
  };
}

// ------------------------------------------
// API ENDPOINTS
// ------------------------------------------

// 1. Get stats
app.get("/api/stats", (req, res) => {
  res.json(calculateStats());
});

// 2. Get list of issues
app.get("/api/issues", (req, res) => {
  res.json(issues);
});

// 3. Get single issue
app.get("/api/issues/:id", (req, res) => {
  const issue = issues.find(i => i.id === req.params.id);
  if (!issue) {
    return res.status(404).json({ error: "Civic issue not found" });
  }
  res.json(issue);
});

// 4. Create new issue with Optional Gemini analysis
app.post("/api/issues", async (req, res) => {
  const { title, description, category, severity, address, latitude, longitude, reporterName, reporterId, imageUrl } = req.body;

  if (!title || !description || !address) {
    return res.status(400).json({ error: "Please enter a title, description, and location of the issue." });
  }

  const newId = `issue-${Date.now()}`;
  const nowStr = new Date().toISOString();

  // Basic Rule-based analyzer as primary container or backup
  let finalCategory: IssueCategory = category || "Other";
  let finalSeverity: IssueSeverity = severity || "Medium";
  let fallbackAiResponse = {
    summary: "Report received and registered in queue.",
    suggestedAction: "Dispatched surveyor to evaluate reports and inspect municipal parameters physically.",
    targetDaysToResolve: 5,
    dispatchedTo: "Municipal Task Services Inspector Group",
    alternativeImpact: "Secures public thoroughfare safety and promotes high quality neighborhood standard."
  };

  // Rule-based categorizer for immediate fallback
  const dLower = (title + " " + description).toLowerCase();
  if (dLower.includes("pothole") || dLower.includes("road") || dLower.includes("street damage") || dLower.includes("asphalt") || dLower.includes("guardrail") || dLower.includes("pavement")) {
    finalCategory = "Roads & Potholes";
    finalSeverity = dLower.includes("dangerous") || dLower.includes("crash") || dLower.includes("accident") || dLower.includes("severe") ? "High" : "Medium";
    fallbackAiResponse = {
      summary: "Pavement or roadway structural structural anomaly reported near local corridor.",
      suggestedAction: "Erect warning caution signage. Schedule surface asphalt repair and grading crews.",
      targetDaysToResolve: 3,
      dispatchedTo: "Bureau of Highways & Transportation Services",
      alternativeImpact: "Stops vehicle wheel alignment deterioration, ensures smoother urban delivery access, and averts bicycle trips."
    };
  } else if (dLower.includes("water") || dLower.includes("leak") || dLower.includes("burst") || dLower.includes("flood") || dLower.includes("gush") || dLower.includes("pipe")) {
    finalCategory = "Water & Leakage";
    finalSeverity = dLower.includes("gush") || dLower.includes("flooding") || dLower.includes("burst") || dLower.includes("critical") ? "Critical" : "High";
    fallbackAiResponse = {
      summary: "Culinary or greywater system leakage/conduit integrity failure.",
      suggestedAction: "Locate main branch valve, isolate flows, and weld or slide-patch joint pipeline configurations.",
      targetDaysToResolve: 1,
      dispatchedTo: "Municipal Clean Water & Environmental Utilities",
      alternativeImpact: "Saves valuable drinking water units, checks pavement basement erosion, and keeps local traffic dry."
    };
  } else if (dLower.includes("light") || dLower.includes("lamp") || dLower.includes("dark") || dLower.includes("lantern") || dLower.includes("streetlight")) {
    finalCategory = "Streetlights";
    finalSeverity = dLower.includes("darkness") || dLower.includes("crossing") || dLower.includes("unsafe") ? "High" : "Medium";
    fallbackAiResponse = {
      summary: "Luminaire bulb burnout or secondary wiring electrical blackout status.",
      suggestedAction: "Deploy lighting technician bucket truck and replace electrical fixtures with efficient LEDs.",
      targetDaysToResolve: 3,
      dispatchedTo: "Lighting Operations & Power Distribution Systems",
      alternativeImpact: "Restores visual security line-of-sight for nighttime commuters and discourages vandalism."
    };
  } else if (dLower.includes("trash") || dLower.includes("garbage") || dLower.includes("dump") || dLower.includes("waste") || dLower.includes("litter") || dLower.includes("dumping")) {
    finalCategory = "Sanitation & Waste";
    finalSeverity = "Medium";
    fallbackAiResponse = {
      summary: "Accumulated general discard waste or unscheduled commercial spillover.",
      suggestedAction: "Coordinate waste recovery personnel and assign localized cleanup bins/pickup vehicles.",
      targetDaysToResolve: 4,
      dispatchedTo: "Solid Waste & Community Hygiene Department",
      alternativeImpact: "Averts pest infestation vectors, clears toxic leachates from surface gutters, and boosts property aesthetics."
    };
  } else if (dLower.includes("park") || dLower.includes("playground") || dLower.includes("bench") || dLower.includes("tree") || dLower.includes("weed") || dLower.includes("nature")) {
    finalCategory = "Parks & Public Spaces";
    finalSeverity = "Low";
    fallbackAiResponse = {
      summary: "Recreational resource degradation, vegetative overgrowth, or utility damage in public park.",
      suggestedAction: "Issue landscape ticket for municipal pruning, brush clearing, or asset repair.",
      targetDaysToResolve: 5,
      dispatchedTo: "Department of Parks, Recreation & Beautification Services",
      alternativeImpact: "Restores safety play zones for children and sustains community oxygen canopy parameters."
    };
  }

  let finalAiResponse = fallbackAiResponse;

  // Real Gemini Call if API is configured
  if (ai) {
    try {
      console.log(`Analyzing issue via Gemini: ${title}`);
      const prompt = `You are the ultimate expert Municipal AI Dispatcher for "Community Hero". Your role is to analyze a citizen's reported issue and classify it, estimate its severity, and plan a dispatch strategy.
      
      Citizen Report:
      - Title: "${title}"
      - Description: "${description}"
      - Category: "${category || 'unspecified'}"
      - Location Address: "${address}"
      
      Provide your analysis in clean JSON format matching this exact schema:
      {
        "category": "Roads & Potholes" | "Water & Leakage" | "Streetlights" | "Sanitation & Waste" | "Parks & Public Spaces" | "Other",
        "severity": "Low" | "Medium" | "High" | "Critical",
        "summary": "Brief 1-sentence engineering summary of what is wrong",
        "suggestedAction": "Brief 1-sentence recommended action for municipal teams",
        "targetDaysToResolve": number (e.g. 1 for critical water/safety, 2-3 for roads, 4-5 for parks),
        "dispatchedTo": "Name of local agency best equipped to fix it",
        "alternativeImpact": "1-sentence description of the positive social, environmental, or cost impact when resolved"
      }
      
      Choose CATEGORY and SEVERITY strictly from the permitted enum options. Be objective, realistic, and highly professional. Return ONLY JSON. Do not write any markdown codeblock markers unless they contain valid parsed content.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (text) {
        console.log("Raw Gemini Output:", text);
        const parsed = JSON.parse(text);
        if (parsed.category) finalCategory = parsed.category;
        if (parsed.severity) finalSeverity = parsed.severity;
        finalAiResponse = {
          summary: parsed.summary || fallbackAiResponse.summary,
          suggestedAction: parsed.suggestedAction || fallbackAiResponse.suggestedAction,
          targetDaysToResolve: Number(parsed.targetDaysToResolve) || fallbackAiResponse.targetDaysToResolve,
          dispatchedTo: parsed.dispatchedTo || fallbackAiResponse.dispatchedTo,
          alternativeImpact: parsed.alternativeImpact || fallbackAiResponse.alternativeImpact
        };
        console.log("Gemini successfully categorized and dispatched issue.");
      }
    } catch (err) {
      console.error("Gemini invocation failed, utilizing robust fallback:", err);
    }
  }

  // Create the complete issue model
  const newIssue: Issue = {
    id: newId,
    title,
    description,
    category: finalCategory,
    severity: finalSeverity,
    latitude: Number(latitude) || 37.7749 + (Math.random() - 0.5) * 0.05,
    longitude: Number(longitude) || -122.4194 + (Math.random() - 0.5) * 0.05,
    address,
    imageUrl: imageUrl || undefined, // Base64 representation from drag/drop or input
    reporterName: reporterName || "Anonymous Citizen",
    reporterId: reporterId || "citizen-temp",
    upvotes: 1,
    upvotedBy: [reporterId || "citizen-temp"],
    flags: 0,
    flaggedBy: [],
    status: "Reported",
    createdAt: nowStr,
    updatedAt: nowStr,
    acousticHz: Number(req.body.acousticHz) || undefined,
    acousticDb: Number(req.body.acousticDb) || undefined,
    pledges: [],
    aiResponse: finalAiResponse,
    comments: []
  };

  issues.unshift(newIssue);

  // Distribute Points to Citizen
  const activeUser = mockUsers.find(u => u.id === reporterId);
  if (activeUser) {
    activeUser.points += 20; // 20 points for submission
    activeUser.reportsCreated += 1;
    
    // Check dynamic Badge unlocks
    if (activeUser.reportsCreated === 1) {
      activeUser.badges.push({
        id: `badge-${Date.now()}`,
        title: "Initiator",
        description: "Reported your first neighborhood issue",
        unlockedAt: nowStr,
        icon: "Flag",
        color: "bg-purple-100 text-purple-700 border-purple-200"
      });
    }
  }

  res.status(201).json(newIssue);
});

// 5. Upvote issue (Community validation)
app.post("/api/issues/:id/upvote", (req, res) => {
  const { userId } = req.body;
  const issue = issues.find(i => i.id === req.params.id);
  
  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  if (issue.upvotedBy.includes(userId)) {
    // Retract upvote
    issue.upvotedBy = issue.upvotedBy.filter(id => id !== userId);
    issue.upvotes = Math.max(0, issue.upvotes - 1);
  } else {
    // Add upvote
    issue.upvotedBy.push(userId);
    issue.upvotes += 1;

    // Award minor point to active user
    const activeUser = mockUsers.find(u => u.id === userId);
    if (activeUser) {
      activeUser.points += 5; // 5 validation points
      activeUser.verificationsCompleted += 1;
    }
  }

  // Civic rule: If an issue gets 5+ upvotes, automatically upgrade its state to "Verified" if it is reported!
  if (issue.upvotes >= 5 && issue.status === "Reported") {
    issue.status = "Verified";
    issue.updatedAt = new Date().toISOString();
  }

  res.json(issue);
});

// 6. Post Citizen / Official Comment
app.post("/api/issues/:id/comments", (req, res) => {
  const { username, userRole, text } = req.body;
  const issue = issues.find(i => i.id === req.params.id);

  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Comment text is required" });
  }

  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    issueId: issue.id,
    username: username || "Citizen Helper",
    userRole: userRole || "citizen",
    text,
    createdAt: new Date().toISOString()
  };

  issue.comments.push(newComment);
  issue.updatedAt = new Date().toISOString();

  // If municipal official posts, we can allocate resolution helpers
  res.status(201).json(newComment);
});

// 6.5. Post Volunteer Pledge
app.post("/api/issues/:id/pledges", (req, res) => {
  const { userId, name, resourceType, quantity } = req.body;
  const issue = issues.find(i => i.id === req.params.id);

  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  if (!resourceType || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "Resource type and positive quantity are required to pledge" });
  }

  const newPledge = {
    id: `pledge-${Date.now()}`,
    userId: userId || "citizen-temp",
    issueId: issue.id,
    name: name || "Anonymous Hero",
    resourceType: resourceType,
    quantity: Number(quantity),
    createdAt: new Date().toISOString()
  };

  if (!issue.pledges) issue.pledges = [];
  issue.pledges.push(newPledge as any);

  // Award Civic XP points (30 points for community labor/resource pledge!)
  const activeUser = mockUsers.find(u => u.id === userId);
  if (activeUser) {
    activeUser.points += 30;
  }

  res.status(201).json(newPledge);
});

// 7. Change Issue Status (Municipal simulation)
app.post("/api/issues/:id/status", (req, res) => {
  const { status, officialComment, officialName } = req.body;
  const issue = issues.find(i => i.id === req.params.id);

  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  const allowedStatuses: IssueStatus[] = ["Reported", "Verified", "In Progress", "Resolved"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid health status string" });
  }

  issue.status = status;
  issue.updatedAt = new Date().toISOString();

  // Add an official log comment
  if (officialComment) {
    issue.comments.push({
      id: `comment-${Date.now()}`,
      issueId: issue.id,
      username: officialName || "City Engineer",
      userRole: "official",
      text: `[Status changed to ${status}] ${officialComment}`,
      createdAt: new Date().toISOString()
    });
  }

  // If changed to resolved, allocate points to reporter
  if (status === "Resolved") {
    const originalReporter = mockUsers.find(u => u.id === issue.reporterId);
    if (originalReporter) {
      originalReporter.points += 50; // Big bonus for verified fixing!
      originalReporter.resolvedContributed += 1;
    }
  }

  res.json(issue);
});

// 8. Get Profiles / Leaderboard
app.get("/api/users", (req, res) => {
  // Sort users by points
  const sorted = [...mockUsers].sort((a, b) => b.points - a.points);
  res.json(sorted);
});

// Create/Update profile
app.post("/api/users/profile", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  // Check if existing
  let user = mockUsers.find(u => u.email === email);
  if (!user) {
    user = {
      id: `user-${Date.now()}`,
      name,
      email,
      points: 20, // 20 bonus sign-up points
      reportsCreated: 0,
      verificationsCompleted: 0,
      resolvedContributed: 0,
      badges: [
        { id: "b-welcome", title: "Active Hero", description: "Registered to help clean Metro boundaries", unlockedAt: new Date().toISOString(), icon: "User", color: "bg-gray-100 text-gray-700 border-gray-200" }
      ]
    };
    mockUsers.push(user);
  }
  res.json(user);
});

// ==========================================
// NEW FEATURES: RWA DIGITAL GAP REMEDIES
// ==========================================

// Chat assistant with RWA and budget context
app.post("/api/assistant/chat", async (req, res) => {
  const { message, userId } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Compile full context list
  const pendingIssuesSummaryList = issues.filter(i => i.status !== "Resolved").map(i => `Incident Flat: "${i.address.split(',')[0]}", Title: "${i.title}", Category: "${i.category}", Status: "${i.status}", Severity: "${i.severity}"`).join("\n");
  
  const promptContext = `You are the local smart RWA (Resident Welfare Association) digital assistant for Golden Gate Coop.
We are a self-managed community with 24 flat units (101 to 403).
Below are the active issues:
${pendingIssuesSummaryList}

Budget / Maintenance Context:
- Monthly maintenance collected per flat: $120. (Total $2,880/mo).
- Expense payout this month includes: $1,200 (extra water tankers due to dry-spill leaks) and $650 (booster pump sealing updates). This explains why maintenance was elevated.
- Outstandings: Flat 204 owes $240, Flat 105 owes $110, Flat 403 owes $165. Total backlog: $515.
- Top Contractor vendors: AquaFlow Municipal Tankers, Apex Plumbing services.

The user is asking: "${message}"
Answer concisely, in 1-3 direct sentences. Speak strictly to our community numbers. Include friendly block emojis where applicable. Use Markdown styling.`;

  if (!ai) {
    // If no AI key, return rule-based matching reply
    let reply = "I am processing Golden Gate Coop spreadsheet registers: ";
    const t = message.toLowerCase();
    if (t.includes("maintenance") || t.includes("increase")) {
      reply = "**Budget Statement**: Maintenance increased by 12% this month due to emergency water tankers ($1,200) and booster pump seal renovations ($650).";
    } else if (t.includes("due") || t.includes("pending") || t.includes("owe")) {
      reply = "**Flat Backlogs Alert**: 3 flats have pending dues over $100: Flat 204 ($240), Flat 105 ($110), Flat 403 ($165). Total receivables are $515.";
    } else if (t.includes("vendor") || t.includes("cost")) {
      reply = "**Outflows**: Our highest cost contractors are AquaFlow Municipal Tankers ($4,800 total payments) and Apex Plumbing ($3,200 for water infrastructure fixes).";
    } else if (t.includes("tanker") || t.includes("water") || t.includes("predict")) {
      reply = "**Dynamic predictor**: Continued heatwaves and unsealed leaks will elevate water tanker demands by **24%** next month. We recommend immediate pipe joint insulation.";
    } else {
      reply = `I am analyzing Golden Gate records. Your query "${message}" matched RWA indicators. Let me know if you would like me to compile a full audit report printable file!`;
    }
    return res.json({ reply });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptContext,
    });
    return res.json({ reply: response.text });
  } catch (err) {
    console.error("Assistant chat error:", err);
    res.status(500).json({ error: "Failed to query AI assistant" });
  }
});

// Sound speech generation for voice resident support
app.post("/api/assistant/tts", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  if (!ai) {
    return res.status(400).json({ error: "No AI client initialized for Text-to-Speech" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audio: base64Audio });
    }
    throw new Error("No inline data in TTS response");
  } catch (err) {
    console.error("TTS generation failed:", err);
    res.status(500).json({ error: "Failed to generate TTS audio" });
  }
});

// Invoice OCR Scanner
app.post("/api/financials/ocr", async (req, res) => {
  const { image, username } = req.body;
  if (!image) {
    return res.status(400).json({ error: "Image data is required" });
  }

  const base64Raw = image.replace(/^data:image\/\w+;base64,/, "");

  if (!ai) {
    // Rule based fallback mock record
    const fallbackId = `rec-ocr-${Date.now()}`;
    return res.json({
      record: {
        id: fallbackId,
        date: new Date().toISOString().split('T')[0],
        type: 'Utility Tanker',
        description: `Water Supply Tanker Emergency Payout (Filed by ${username || 'RWA Supervisor'})`,
        amount: 450,
        category: 'expense',
        invoiceUrl: image
      }
    });
  }

  try {
    const imagePart = {
      inlineData: {
        mimeType: "image/png",
        data: base64Raw,
      },
    };
    const prompt = `Inspect this invoice or payment receipt image. Extract:
1. Payout Type (Must be one of: 'Maintenance Fee', 'Repair Payout', 'Security Fund', 'Utility Tanker', 'Event Spending').
2. Description of the repair or event.
3. Total amount charged (as a clean number, no $ symbols).
4. Category (Must be 'expense' or 'income').

Return the extracted values in a valid JSON response matching this schema exactly:
{
  "type": "Payout Type",
  "description": "Item description",
  "amount": number,
  "category": "expense"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text || "{}");
    const recordId = `rec-ocr-${Date.now()}`;
    return res.json({
      record: {
        id: recordId,
        date: new Date().toISOString().split('T')[0],
        type: data.type || 'Repair Payout',
        description: data.description || 'Verified Contractor Repair Invoice',
        amount: Number(data.amount) || 250,
        category: data.category || 'expense',
        invoiceUrl: image
      }
    });
  } catch (err) {
    console.error("OCR fails:", err);
    res.status(500).json({ error: "Failed to parse invoice images" });
  }
});

// 9. AI Predictive Forecast Engine (Generates dynamic predictive reports based on logged issues)
app.get("/api/insights/predictive", async (req, res) => {
  const baseInsights = [
    {
      id: "p1",
      hazardName: "High Wet-Seepage Leak Damage Vulnerability",
      location: "Financial District Hub (Market & 4th Corridor)",
      riskScore: 88,
      indicator: "Multiple high severity leakage logs on old civic castiron utility trunks.",
      recommendedActivity: "Schedule preventative ground acoustic sonar leak scan. Early valve replacements recommended within 30 days to avoid full sinkhole events.",
      estimatedDamageAvoidanceSavings: "$45,000"
    },
    {
      id: "p2",
      hazardName: "Night Pedestrian Blind Area Corridor Threat",
      location: "Lower Castro Winding Pedestrian Crossing Bridges",
      riskScore: 76,
      indicator: "3 distinct streetlamp outage reports clustered inside high density nightlife walkpaths.",
      recommendedActivity: "Install high-efficiency LED dusk-to-dawn sensors. Add emergency pedestrian solar flashers near transit spots.",
      estimatedDamageAvoidanceSavings: "$12,000"
    },
    {
      id: "p3",
      hazardName: "Road Degradation Acceleration Risk",
      location: "Upper Mission Transit Intersection Channels",
      riskScore: 64,
      indicator: "Pothole deep cavity clusters accelerating due to heavy diesel bus braking weight.",
      recommendedActivity: "Install concrete bus pad overlays on active bus stops rather than simple asphalt patching to block constant road shearing.",
      estimatedDamageAvoidanceSavings: "$80,000"
    }
  ];

  if (!ai) {
    // Return mock prediction
    return res.json({
      poweredByAI: false,
      insights: baseInsights,
      generatedAt: new Date().toISOString(),
      forecastSummary: "Rule-based structural predictive maintenance model loaded."
    });
  }

  try {
    const summaryList = issues.map(i => `Category: ${i.category}, Title: "${i.title}", Severity: ${i.severity}, Location: "${i.address}"`).join("\n");
    const prompt = `You are a high-level Municipal Infrastructure Planner & AI forecasting engine. Analyze this active log of community incidents to generate 3 preventative/predictive maintenance forecasts.

Active Incidents Data:
${summaryList}

Return a valid JSON response with this exact structure:
{
  "forecastSummary": "A solid 1-2 sentence overview summarizing our municipal risk landscape right now.",
  "insights": [
    {
      "id": "gen-1",
      "hazardName": "Name of forecasted hazard/vulnerability",
      "location": "Localized area vulnerable to failure",
      "riskScore": number (0-100 hazard probability),
      "indicator": "Detailed analytical reasoning of why this is predicted from reported issues",
      "recommendedActivity": "Actionable preventative prescription for civil work crews",
      "estimatedDamageAvoidanceSavings": "Estimated dollar savings from preventative fix (e.g. '$50,000')"
    }
  ]
}
Make exactly 3 distinct forecasted cards. Choose realistic infrastructure terms (soil liquefaction, sinkholes, blackout clusters, trash burning vectors). Return ONLY JSON. Do not write markdown tags unless they hold valid parsable data.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text);
      return res.json({
        poweredByAI: true,
        insights: parsed.insights || baseInsights,
        generatedAt: new Date().toISOString(),
        forecastSummary: parsed.forecastSummary || "Preventative analytics updated based on live reports."
      });
    }
  } catch (err) {
    console.error("Failed to generate predictive insights via Gemini, providing fallbacks:", err);
  }

  res.json({
    poweredByAI: false,
    insights: baseInsights,
    generatedAt: new Date().toISOString(),
    forecastSummary: "Temporary fallback maintenance calculations loaded."
  });
});

// Serve static resources in production, or mount Vite middleware in development
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static resources from /dist in production mode.");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Community Hero Server] Booted successfully on http://0.0.0.0:${PORT}`);
  });
};

startServer().catch(err => {
  console.error("Critical error while starting server:", err);
});
