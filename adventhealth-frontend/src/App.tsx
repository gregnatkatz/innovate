import React, { useState, useEffect } from 'react';
import { 
  Home, Lightbulb, TrendingUp, Settings, Bell, Search, Plus, 
  Filter, ChevronDown, ChevronRight, X, XCircle, ThumbsUp, 
  DollarSign, Target, CheckCircle, 
  BarChart3, FileText, Brain,
  User, LogOut, HelpCircle, Sparkles, Rocket, Trophy,
  Activity, BookOpen, Users, Layers, Share2, Flag, Clock, Zap, MessageSquare,
  Gift, Coffee, ShoppingBag, Award, Star, Upload, Download
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Idea {
  id: string;
  title: string;
  submitter_name: string;
  hospital: string;
  category: string;
  problem_statement: string;
  proposed_solution: string;
  expected_benefit: string;
  track: string;
  quadrant: string;
  phase: string;
  status: string;
  upvotes: number;
  estimated_value: number;
  estimated_roi: number;
  feasibility_score: number;
  business_value_score: number;
  // Additional fields for Sarah's demo idea
  comments_count?: number;
  roi?: number;
  value?: number;
  timeline_weeks?: number;
  investment?: number;
  collaborators?: number;
  description?: string;
  department?: string;
  created_at?: string;
}

interface Dashboard {
  total_ideas: number;
  approved_ideas: number;
  total_value: number;
  total_value_formatted: string;
  average_roi: number;
  active_challenges: number;
  ideas_by_track: { [key: string]: number };
  ideas_by_quadrant: { [key: string]: number };
  ideas_by_status: { [key: string]: number };
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  ideas_count: number;
  approved_count: number;
  total_value: number;
  total_upvotes: number;
  points: number;
}

interface FragmentComment {
  id: string;
  author_name: string;
  author_role: string | null;
  content: string;
  created_at: string;
  upvotes: number;
  is_building_on: boolean;
}

interface Fragment {
  id: string;
  submitter_name: string;
  title: string;
  rough_thought: string;
  category: string | null;
  hospital: string | null;
  comments: FragmentComment[];
  upvotes: number;
  maturity_score: number;
  status: string;
  created_at: string;
  promoted_to_idea_id: string | null;
}

const NOTIFICATIONS = [
  { id: 1, type: 'comment', text: 'Dr. Kim commented on your idea', time: '5 min ago', unread: true },
  { id: 2, type: 'approval', text: 'Your idea was approved for pilot', time: '2 hours ago', unread: true },
  { id: 3, type: 'upvote', text: '10 people upvoted your idea', time: '1 day ago', unread: false },
];

const getHeadshot = (name: string): string => {
  if (!name) return '/images/headshots/male-caucasian-1.png';
  const nameLower = name.toLowerCase();
  const firstName = name.split(' ')[0].toLowerCase();
  const lastName = name.split(' ').slice(-1)[0].toLowerCase();
  
  const femaleFirstNames = ['sarah', 'jennifer', 'amanda', 'lisa', 'michelle', 'patricia', 'maria', 'nancy', 'linda', 'elizabeth', 'susan', 'jessica', 'karen', 'betty', 'helen', 'sandra', 'donna', 'carol', 'ruth', 'sharon', 'margaret', 'ashley', 'emily', 'kimberly', 'deborah', 'stephanie', 'rebecca', 'laura', 'helen', 'anna', 'samantha', 'katherine', 'christine', 'debra', 'rachel', 'carolyn', 'janet', 'catherine', 'maria', 'heather', 'diane', 'olivia', 'julie', 'joyce', 'virginia', 'victoria', 'kelly', 'lauren', 'christina', 'joan', 'evelyn', 'judith', 'megan', 'andrea', 'cheryl', 'hannah', 'jacqueline', 'martha', 'gloria', 'teresa', 'ann', 'sara', 'madison', 'frances', 'kathryn', 'janice', 'jean', 'abigail', 'alice', 'judy', 'sophia', 'grace', 'denise', 'amber', 'doris', 'marilyn', 'danielle', 'beverly', 'isabella', 'theresa', 'diana', 'natalie', 'brittany', 'charlotte', 'marie', 'kayla', 'alexis', 'lori'];
  
  const isFemale = femaleFirstNames.includes(firstName);
  
  const asianLastNames = ['chen', 'kim', 'park', 'lee', 'wong', 'wu', 'liu', 'huang', 'lin', 'yang', 'wang', 'zhang', 'li', 'zhao', 'zhou', 'sun', 'ma', 'zhu', 'hu', 'guo', 'he', 'luo', 'gao', 'zheng', 'xie', 'han', 'tang', 'feng', 'yu', 'dong', 'xiao', 'cheng', 'cao', 'yuan', 'deng', 'xu', 'fu', 'shen', 'peng', 'lu', 'su', 'jiang', 'cai', 'wei', 'tan', 'du', 'ding', 'pan', 'wan', 'ye', 'nguyen', 'tran', 'pham', 'hoang', 'phan', 'vu', 'vo', 'dang', 'bui', 'do', 'ho', 'ngo', 'duong', 'ly', 'le', 'truong', 'huynh', 'lam', 'mai', 'dao'];
  const hispanicLastNames = ['garcia', 'rodriguez', 'martinez', 'hernandez', 'lopez', 'gonzalez', 'perez', 'sanchez', 'ramirez', 'torres', 'flores', 'rivera', 'gomez', 'diaz', 'reyes', 'morales', 'jimenez', 'ruiz', 'alvarez', 'mendoza', 'castillo', 'romero', 'herrera', 'medina', 'aguilar', 'vargas', 'castro', 'cruz', 'ortiz', 'gutierrez', 'chavez', 'ramos', 'gonzales', 'santos', 'santiago', 'guerrero', 'estrada', 'moreno', 'munoz', 'vasquez', 'delgado', 'soto', 'vega', 'contreras', 'sandoval', 'fernandez', 'rojas', 'silva', 'nunez', 'cabrera'];
  const southAsianLastNames = ['patel', 'sharma', 'kumar', 'singh', 'gupta', 'reddy', 'rao', 'nair', 'iyer', 'menon', 'pillai', 'das', 'mukherjee', 'chatterjee', 'banerjee', 'ghosh', 'bose', 'sen', 'roy', 'dutta', 'joshi', 'desai', 'shah', 'mehta', 'gandhi', 'modi', 'thakur', 'verma', 'mishra', 'pandey', 'tiwari', 'yadav', 'chauhan', 'agarwal', 'jain', 'saxena', 'kapoor', 'malhotra', 'khanna', 'chopra', 'bhatia', 'sinha', 'prasad', 'rajan', 'krishnan', 'subramaniam', 'venkatesh', 'naidu', 'choudhury', 'khan', 'ali', 'ahmed', 'hussain', 'rahman', 'begum', 'akhtar', 'ansari', 'qureshi', 'siddiqui', 'mirza'];
  const africanAmericanIndicators = ['washington', 'jefferson', 'jackson', 'williams', 'johnson', 'brown', 'jones', 'davis', 'wilson', 'moore', 'taylor', 'anderson', 'thomas', 'harris', 'martin', 'thompson', 'white', 'lewis', 'walker', 'hall', 'allen', 'young', 'king', 'wright', 'scott', 'green', 'baker', 'adams', 'nelson', 'hill', 'campbell', 'mitchell', 'roberts', 'carter', 'phillips', 'evans', 'turner', 'parker', 'collins', 'edwards', 'stewart', 'morris', 'murphy', 'cook', 'rogers', 'morgan', 'peterson', 'cooper', 'reed', 'bailey', 'bell', 'howard', 'ward', 'cox', 'richardson', 'wood', 'watson', 'brooks', 'bennett', 'gray', 'james', 'price', 'jenkins', 'perry', 'powell', 'long', 'patterson', 'hughes', 'flores', 'washington', 'butler', 'simmons', 'foster', 'bryant', 'alexander', 'russell', 'griffin', 'hayes', 'henry', 'coleman', 'jenkins', 'perry', 'powell'];
  
  const isAsian = asianLastNames.includes(lastName);
  const isHispanic = hispanicLastNames.includes(lastName);
  const isSouthAsian = southAsianLastNames.includes(lastName);
  
  if (isFemale) {
    if (isAsian) return '/images/headshots/female-latina.png';
    if (isHispanic) return '/images/headshots/female-latina.png';
    if (isSouthAsian) return '/images/headshots/female-south-asian.png';
    if (nameLower.includes('senior') || nameLower.includes('vp') || nameLower.includes('director')) {
      return '/images/headshots/female-caucasian-gray-hair.png';
    }
    const femaleOptions = [
      '/images/headshots/female-caucasian-brunette.png',
      '/images/headshots/female-caucasian-blonde.png',
      '/images/headshots/female-caucasian-brown.png'
    ];
    return femaleOptions[Math.abs(name.length) % femaleOptions.length];
  } else {
    if (isAsian) return '/images/headshots/male-south-asian.png';
    if (isSouthAsian) return '/images/headshots/male-south-asian.png';
    if (africanAmericanIndicators.includes(lastName)) {
      const maleAfricanOptions = [
        '/images/headshots/male-african-american-1.png',
        '/images/headshots/male-african-american-2.png',
        '/images/headshots/male-african-american-3.png',
        '/images/headshots/male-african-american-4.png'
      ];
      return maleAfricanOptions[Math.abs(name.length) % maleAfricanOptions.length];
    }
    const maleOptions = [
      '/images/headshots/male-caucasian-1.png',
      '/images/headshots/male-caucasian-blonde.png'
    ];
    return maleOptions[Math.abs(name.length) % maleOptions.length];
  }
};

// Demo Users for 2-minute demo
const DEMO_USERS = {
  sarah: {
    name: 'Sarah Chen',
    role: 'Registered Nurse',
    hospital: 'ContosoHealth Orlando',
    department: 'Nursing',
    ideasSubmitted: 1,
    ideasApproved: 1,
    totalUpvotes: 24,
    points: 100, // Initial state, becomes 650 after scaling
    tier: 'bronze', // Initial state, becomes 'gold' after scaling
    rank: 'Rising Innovator'
  },
  michael: {
    name: 'Dr. Michael Chen',
    role: 'Chief Innovation Officer',
    hospital: 'ContosoHealth Corporate',
    department: 'Innovation',
    ideasSubmitted: 0,
    ideasApproved: 0,
    totalUpvotes: 0,
    points: 2500,
    tier: 'platinum',
    rank: 'Executive Sponsor'
  }
};

const USER_PROFILE = {
  name: 'Gregory Katz',
  role: 'Director, Cloud & AI Platforms',
  hospital: 'Microsoft Corporation (ContosoHealth)',
  ideasSubmitted: 3,
  ideasApproved: 2,
  totalUpvotes: 445,
  rank: 'Innovation Champion'
};

// Sarah's Demo Idea - AI-Powered Nurse Scheduling
const SARAH_DEMO_IDEA = {
  id: 'demo-sarah-1',
  title: 'AI-Powered Nurse Scheduling',
  description: 'Machine learning model that predicts staffing needs based on historical data, patient census forecasts, and staff availability. System auto-generates optimized schedules that minimize overtime while maintaining quality care.',
  problem: 'Manual scheduling takes 20 hours per week and frequently results in overtime costs due to inefficient shift coverage predictions.',
  solution: 'ML model predicts staffing needs, auto-generates schedules using Azure ML + Epic + Kronos integration.',
  submitter: 'Sarah Chen',
  submitterRole: 'Registered Nurse',
  department: 'Nursing',
  hospital: 'ContosoHealth Orlando',
  category: 'Team Members',
  track: 'Quick Win',
  status: 'approved',
  phase: 'Define',
  value: 12000000,
  investment: 350000,
  roi: 34.3,
  feasibility: 8.7,
  timeline: '12 weeks',
  upvotes: 23,
  comments: 8,
  collaborators: 5,
  quadrant: 'Quick Win',
  systems: 'Epic, Kronos, Azure ML',
  createdAt: '2025-12-01',
  aiAgentResults: {
    systemContext: 'Detected: Epic (EHR), Kronos (scheduling), Azure ML. Integration complexity: Medium.',
    feasibility: 'Overall: 8.7/10. Technical: 9/10, Financial: 9/10, Strategic: 8/10, Organizational: 8/10.',
    similarity: 'Found 2 similar ideas. Replication savings: $8.4M vs building from scratch.',
    architecture: 'Azure ML → Azure Functions → Epic API → Kronos API. Diagram generated.',
    resources: 'Team: Data Scientist, Epic Analyst, Kronos Expert, Nurse Manager. Budget: $350K.',
    roi: 'Projected: $12M over 5 years. Break-even: 3 months. ROI: 34:1.'
  },
  // 6 months later data (Scene 4)
  pilotResults: {
    overtimeReduction: 30, // target was 25%
    staffSatisfaction: 95, // target was 85%
    realizedSavings: 1200000, // $1.2M in 6 months
    projectedSavings: 12000000, // $12M over 5 years
    roiValidated: true
  }
};

// Demo comments for Sarah's idea
const SARAH_IDEA_COMMENTS = [
  { id: 1, author: 'Maria Rodriguez', role: 'Nurse Manager, Tampa', text: 'Love this! We have the exact same problem in Tampa. Our scheduling takes 25+ hours per week. Can we pilot this together?', timestamp: '4 hours ago', avatar: getHeadshot('Maria Rodriguez') },
  { id: 2, author: 'Dr. James Johnson', role: 'ICU Director', text: 'This would be transformational for ICU. Can we pilot in ICU first? We have the most complex scheduling needs.', timestamp: '3 hours ago', avatar: getHeadshot('Dr. James Johnson') },
  { id: 3, author: 'Alex Kumar', role: 'IT Architect', text: 'Epic integration will be the key success factor. We have existing APIs we can leverage. I can help architect this.', timestamp: '2 hours ago', avatar: getHeadshot('Alex Kumar') },
  { id: 4, author: 'Dr. Michael Chen', role: 'Chief Innovation Officer', text: 'Excellent ROI and strategic fit. Fast-tracking this for approval. Jennifer Jury will be the executive sponsor.', timestamp: '1 hour ago', avatar: getHeadshot('Dr. Michael Chen') }
];

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [persona, setPersona] = useState<'executive' | 'innovator'>('innovator');
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
    const handlePersonaChange = (newPersona: 'executive' | 'innovator') => {
      setPersona(newPersona);
      setCurrentView('dashboard');
      setShowPersonaMenu(false);
    };
  
    const showMonetary = persona === 'executive';
    const [filters, setFilters] = useState({
      track: 'all',
      status: 'all',
      category: 'all',
      hospital: 'all',
      quadrant: 'all',
      sortBy: 'upvotes'
    });

  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [agentResult, setAgentResult] = useState<any>(null);
    const [agentLoading, setAgentLoading] = useState(false);
    const [coachQuestion, setCoachQuestion] = useState('');
    const [showIdeaDrawer, setShowIdeaDrawer] = useState(false);
    // Use Sarah's demo comments for the demo idea, otherwise use default comments
    const [ideaComments, setIdeaComments] = useState<{id: number; author: string; role: string; text: string; timestamp: string; avatar: string}[]>(SARAH_IDEA_COMMENTS);
    
    // Demo user data available for persona switching (used in console for debugging)
    console.debug('Demo users loaded:', Object.keys(DEMO_USERS).length);
    const [newComment, setNewComment] = useState('');
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [fragments, setFragments] = useState<Fragment[]>([]);
    const [selectedFragment, setSelectedFragment] = useState<Fragment | null>(null);
    const [showFragmentDrawer, setShowFragmentDrawer] = useState(false);
    const [newFragmentComment, setNewFragmentComment] = useState('');
    const [isBuildingOn, setIsBuildingOn] = useState(false);
      const [showFragmentModal, setShowFragmentModal] = useState(false);
            const [rewards, setRewards] = useState<any>(null);
            const [userRewards, setUserRewards] = useState<any>(null);
      const [fullAnalysisLoading, setFullAnalysisLoading] = useState(false);
      const [fullAnalysisResult, setFullAnalysisResult] = useState<any>(null);
      const [rubricScores, setRubricScores] = useState<{[key: string]: number}>({
        emotional_needs: 5,
        drastic_change: 5,
        revenue_impact: 5,
        pilot_complexity: 5,
        people_build: 5,
        technology_capex: 5
      });
      const [rubricLoading, setRubricLoading] = useState(false);
      const [rubricResult, setRubricResult] = useState<any>(null);

      const fetchAIRubric = async (ideaId: string) => {
        setRubricLoading(true);
        try {
          const res = await fetch(`${API_URL}/api/v1/rubric/${ideaId}/ai-recommend`, { method: 'POST' });
          const data = await res.json();
          if (data.ai_scores) {
            const newScores: {[key: string]: number} = {};
            Object.entries(data.ai_scores).forEach(([key, val]: [string, any]) => {
              newScores[key] = val.score || 5;
            });
            setRubricScores(newScores);
          }
          setRubricResult(data);
        } catch (e) { console.error(e); }
        setRubricLoading(false);
      };

      const calculateRubricQuadrant = () => {
        const valueWeights = { emotional_needs: 0.20, revenue_impact: 0.25 };
        const effortWeights = { drastic_change: 0.15, pilot_complexity: 0.15, people_build: 0.10, technology_capex: 0.15 };
        
        const valueSum = Object.entries(valueWeights).reduce((sum, [k, w]) => sum + (rubricScores[k] || 5) * w, 0);
        const effortSum = Object.entries(effortWeights).reduce((sum, [k, w]) => sum + (rubricScores[k] || 5) * w, 0);
        
        const valueScore = valueSum / 0.45;
        const effortScore = effortSum / 0.55;
        
        const highValue = valueScore >= 6.5;
        const highEffort = effortScore >= 6.0;
        
        let quadrant = 'Low Priority';
        if (highValue && !highEffort) quadrant = 'Quick Wins';
        else if (highValue && highEffort) quadrant = 'Big Bets';
        else if (!highValue && highEffort) quadrant = 'Parking Lot';
        
        return { valueScore: valueScore.toFixed(1), effortScore: effortScore.toFixed(1), quadrant };
      };

      useEffect(() => {
      fetchDashboard();
      fetchIdeas();
      fetchLeaderboard();
      fetchFragments();
      fetchRewards();
    }, []);

        const fetchRewards = async () => {
          try {
            const [catalogRes, userRes] = await Promise.all([
              fetch(`${API_URL}/api/v1/rewards/catalog`),
              fetch(`${API_URL}/api/v1/rewards/user/user-1`)
            ]);
            const catalogData = await catalogRes.json();
            const userData = await userRes.json();
            setRewards(catalogData);
            setUserRewards(userData);
          } catch (e) { console.error(e); }
        };

    const runFullAnalysis = async (ideaId: string) => {
      setFullAnalysisLoading(true);
      setFullAnalysisResult(null);
      try {
        const res = await fetch(`${API_URL}/api/v1/agents/run-all-analysis?idea_id=${ideaId}`, { method: 'POST' });
        const data = await res.json();
        setFullAnalysisResult(data);
      } catch (e) { console.error(e); }
      setFullAnalysisLoading(false);
    };

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/analytics/dashboard`);
      const data = await res.json();
      setDashboard(data);
    } catch (e) { console.error(e); }
  };

  const fetchIdeas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/ideas`);
      const data = await res.json();
      // Add Sarah's demo idea at the top for the 2-minute demo
      const sarahIdeaForList = {
        id: SARAH_DEMO_IDEA.id,
        title: SARAH_DEMO_IDEA.title,
        description: SARAH_DEMO_IDEA.description,
        submitter_name: SARAH_DEMO_IDEA.submitter,
        department: SARAH_DEMO_IDEA.department,
        hospital: SARAH_DEMO_IDEA.hospital,
        category: SARAH_DEMO_IDEA.category,
        track: SARAH_DEMO_IDEA.track,
        status: SARAH_DEMO_IDEA.status,
        value: SARAH_DEMO_IDEA.value,
        roi: SARAH_DEMO_IDEA.roi,
        feasibility_score: SARAH_DEMO_IDEA.feasibility,
        upvotes: SARAH_DEMO_IDEA.upvotes,
        comments_count: SARAH_DEMO_IDEA.comments,
        collaborators: SARAH_DEMO_IDEA.collaborators,
        quadrant: SARAH_DEMO_IDEA.quadrant,
        created_at: SARAH_DEMO_IDEA.createdAt,
        problem_statement: SARAH_DEMO_IDEA.problem,
        proposed_solution: SARAH_DEMO_IDEA.solution,
        timeline_weeks: 12,
        investment: SARAH_DEMO_IDEA.investment
      };
      const allIdeas = [sarahIdeaForList, ...data.ideas];
      setIdeas(allIdeas);
      if (allIdeas.length > 0 && !selectedIdea) {
        setSelectedIdea(allIdeas[0]);
      }
    } catch (e) { console.error(e); }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/leaderboard`);
      const data = await res.json();
      setLeaderboard(data.leaderboard);
    } catch (e) { console.error(e); }
  };

  const fetchFragments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/fragments`);
      const data = await res.json();
      setFragments(data.fragments);
    } catch (e) { console.error(e); }
  };

  const addFragmentComment = async (fragmentId: string, content: string, isBuildingOn: boolean) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/fragments/${fragmentId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: USER_PROFILE.name,
          author_role: USER_PROFILE.role,
          content,
          is_building_on: isBuildingOn
        })
      });
      const data = await res.json();
      // Refresh the fragment to get updated comments and maturity score
      const fragRes = await fetch(`${API_URL}/api/v1/fragments/${fragmentId}`);
      const updatedFragment = await fragRes.json();
      setSelectedFragment(updatedFragment);
      setFragments(prev => prev.map(f => f.id === fragmentId ? updatedFragment : f));
      return data;
    } catch (e) { console.error(e); }
  };

  const upvoteFragment = async (fragmentId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/fragments/${fragmentId}/upvote`, { method: 'POST' });
      const data = await res.json();
      setFragments(prev => prev.map(f => f.id === fragmentId ? { ...f, upvotes: data.upvotes, maturity_score: data.maturity_score, status: data.status } : f));
      if (selectedFragment?.id === fragmentId) {
        setSelectedFragment(prev => prev ? { ...prev, upvotes: data.upvotes, maturity_score: data.maturity_score, status: data.status } : null);
      }
    } catch (e) { console.error(e); }
  };

  const promoteFragment = async (fragmentId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/fragments/${fragmentId}/promote`, { method: 'POST' });
      const data = await res.json();
      // Refresh fragments and ideas
      fetchFragments();
      fetchIdeas();
      setShowFragmentDrawer(false);
      alert(`Fragment promoted to idea ${data.idea_id}! You can now run AI agents on it.`);
    } catch (e) { console.error(e); }
  };

  const runAgent = async (agentType: string) => {
    if (!selectedIdea) return;
    setAgentLoading(true);
    setAgentResult(null);
    try {
      let url = `${API_URL}/api/v1/agents/${agentType}?idea_id=${selectedIdea.id}`;
      if (agentType === 'coaching' && coachQuestion) {
        url += `&question=${encodeURIComponent(coachQuestion)}&phase=${selectedIdea.phase}`;
      }
      const res = await fetch(url, { method: 'POST' });
      const data = await res.json();
      setAgentResult(data);
    } catch (e) { console.error(e); }
    setAgentLoading(false);
  };

  const Sidebar = () => {
    const navItems = [
      { id: 'dashboard', icon: Home, label: 'Dashboard', badge: null, personas: ['executive', 'innovator'] },
      { id: 'pipeline', icon: Layers, label: 'Design Center', badge: '6', personas: ['executive'] },
      { id: 'fragments', icon: MessageSquare, label: 'Idea Fragments', badge: String(fragments.length), personas: ['innovator'] },
      { id: 'ideas', icon: Lightbulb, label: 'All Ideas', badge: String(ideas.length), personas: ['executive', 'innovator'] },
      { id: 'challenges', icon: Flag, label: 'Challenges', badge: 'New', personas: ['executive', 'innovator'] },
      { id: 'value-tracker', icon: DollarSign, label: '$100M Tracker', badge: null, personas: ['executive'] },
      { id: 'analytics', icon: TrendingUp, label: 'Analytics', badge: null, personas: ['executive'] },
      { id: 'leaderboard', icon: Trophy, label: 'Leaderboard', badge: null, personas: ['innovator'] },
      { id: 'rewards', icon: Gift, label: 'Rewards', badge: userRewards?.tier || 'Bronze', personas: ['innovator'] },
      { id: 'events', icon: Activity, label: 'Events & Summits', badge: '3', personas: ['executive', 'innovator'] },
      { id: 'bulk-import', icon: Upload, label: 'Bulk Import', badge: null, personas: ['executive'] },
      { id: 'timeline', icon: BarChart3, label: 'Portfolio Timeline', badge: null, personas: ['executive'] },
      { id: 'resources', icon: BookOpen, label: 'Resources', badge: null, personas: ['innovator'] },
      { id: 'settings', icon: Settings, label: 'Settings', badge: null, personas: ['executive', 'innovator'] },
    ].filter(item => item.personas.includes(persona));

    return (
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-lg">Innovation Hub</div>
              <div className="text-xs text-gray-400">ContosoHealth</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                currentView === item.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && <span className="px-2 py-0.5 bg-gray-700 rounded-full text-xs">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          {showMonetary ? (
            <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-lg p-4 border border-green-700/50">
              <div className="text-xs text-gray-400 mb-1">Total Innovation Value</div>
              <div className="text-2xl font-bold text-white">{dashboard?.total_value_formatted || '$0'}</div>
              <div className="text-xs text-green-400 mt-1">Target: 3 years</div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-700/50">
              <div className="text-xs text-gray-400 mb-1">Your Impact</div>
              <div className="text-2xl font-bold text-white">2,847 Upvotes</div>
              <div className="text-xs text-purple-400 mt-1">Top 5% Contributor</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const Header = () => (
    <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ideas, people, or systems..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            onClick={() => setShowPersonaMenu(!showPersonaMenu)} 
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition ${
              persona === 'executive' 
                ? 'bg-purple-900/30 border-purple-700/50 text-purple-300' 
                : 'bg-green-900/30 border-green-700/50 text-green-300'
            }`}
          >
            <span className="text-sm font-medium">View as:</span>
            <span className="font-semibold">{persona === 'executive' ? 'Executive' : 'Innovator'}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {showPersonaMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
              <button 
                onClick={() => handlePersonaChange('innovator')} 
                className={`w-full px-4 py-3 text-left hover:bg-gray-700 rounded-t-lg flex items-center justify-between ${persona === 'innovator' ? 'bg-green-900/20' : ''}`}
              >
                <div>
                  <div className="font-semibold text-white">Innovator</div>
                  <div className="text-xs text-gray-400">Submit ideas, collaborate</div>
                </div>
                {persona === 'innovator' && <CheckCircle className="w-5 h-5 text-green-400" />}
              </button>
              <button 
                onClick={() => handlePersonaChange('executive')} 
                className={`w-full px-4 py-3 text-left hover:bg-gray-700 rounded-b-lg flex items-center justify-between ${persona === 'executive' ? 'bg-purple-900/20' : ''}`}
              >
                <div>
                  <div className="font-semibold text-white">Executive</div>
                  <div className="text-xs text-gray-400">Portfolio, metrics, ROI</div>
                </div>
                {persona === 'executive' && <CheckCircle className="w-5 h-5 text-purple-400" />}
              </button>
            </div>
          )}
        </div>

        <button onClick={() => setShowSubmitModal(true)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition">
          <Plus className="w-5 h-5" />
          <span>Submit Idea</span>
        </button>

        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold text-white">Notifications</h3>
                <button className="text-sm text-blue-400 hover:text-blue-300">Mark all read</button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {NOTIFICATIONS.map(notif => (
                  <div key={notif.id} className={`p-4 border-b border-gray-700 hover:bg-gray-750 cursor-pointer ${notif.unread ? 'bg-blue-900/10' : ''}`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${notif.unread ? 'bg-blue-500' : 'bg-gray-600'}`} />
                      <div className="flex-1">
                        <p className="text-sm text-white">{notif.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition">
            <img src={getHeadshot(USER_PROFILE.name)} alt={USER_PROFILE.name} className="w-8 h-8 rounded-full object-cover" />
            <div className="text-left">
              <div className="text-sm font-medium text-white">{USER_PROFILE.name}</div>
              <div className="text-xs text-gray-400">{USER_PROFILE.role}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <img src={getHeadshot(USER_PROFILE.name)} alt={USER_PROFILE.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-white">{USER_PROFILE.name}</div>
                    <div className="text-xs text-gray-400">{USER_PROFILE.hospital}</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div><div className="text-lg font-bold text-white">{USER_PROFILE.ideasSubmitted}</div><div className="text-xs text-gray-400">Ideas</div></div>
                  <div><div className="text-lg font-bold text-green-400">{USER_PROFILE.ideasApproved}</div><div className="text-xs text-gray-400">Approved</div></div>
                  <div><div className="text-lg font-bold text-blue-400">{USER_PROFILE.totalUpvotes}</div><div className="text-xs text-gray-400">Upvotes</div></div>
                </div>
              </div>
              <div className="p-2">
                <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 rounded flex items-center space-x-2"><User className="w-4 h-4" /><span>My Profile</span></button>
                <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 rounded flex items-center space-x-2"><Settings className="w-4 h-4" /><span>Settings</span></button>
                <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 rounded flex items-center space-x-2"><HelpCircle className="w-4 h-4" /><span>Help & Support</span></button>
                <div className="border-t border-gray-700 my-2" />
                <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 rounded flex items-center space-x-2"><LogOut className="w-4 h-4" /><span>Sign Out</span></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-800/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Gregory!</h1>
            <p className="text-gray-300">You have {ideas.length} ideas in the system and {dashboard?.approved_ideas || 0} approved</p>
          </div>
          <button onClick={() => setShowSubmitModal(true)} className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center space-x-2">
            <Rocket className="w-5 h-5" />
            <span>Submit New Idea</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {(showMonetary ? [
          { label: 'Total Ideas', value: String(dashboard?.total_ideas || 0), change: '+12', icon: Lightbulb, color: 'text-blue-400' },
          { label: 'Approved', value: String(dashboard?.approved_ideas || 0), change: '+3', icon: CheckCircle, color: 'text-green-400' },
          { label: 'Total Value', value: dashboard?.total_value_formatted || '$0', change: '+$15M', icon: DollarSign, color: 'text-purple-400' },
          { label: 'Avg ROI', value: `${dashboard?.average_roi || 0}:1`, change: '+0.3', icon: Target, color: 'text-yellow-400' },
        ] : [
          { label: 'Total Ideas', value: String(dashboard?.total_ideas || 0), change: '+12', icon: Lightbulb, color: 'text-blue-400' },
          { label: 'Approved', value: String(dashboard?.approved_ideas || 0), change: '+3', icon: CheckCircle, color: 'text-green-400' },
          { label: 'Total Upvotes', value: '2,847', change: '+156', icon: ThumbsUp, color: 'text-purple-400' },
          { label: 'Collaborations', value: '423', change: '+28', icon: Users, color: 'text-yellow-400' },
        ]).map((metric, idx) => (
          <div key={idx} className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <metric.icon className={`w-6 h-6 ${metric.color}`} />
              <span className="text-sm text-green-400">{metric.change}</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
            <div className="text-sm text-gray-400">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Strategic Fit Matrix</h2>
        <div className="grid grid-cols-2 gap-4" style={{ height: '300px' }}>
                    {[
                      { title: 'Quick Wins', quadrantKey: 'quick-wins', count: dashboard?.ideas_by_quadrant?.['quick-wins'] || 0, bgColor: 'bg-green-900/20', borderColor: 'border-green-700/50', textColor: 'text-green-300' },
                      { title: 'Big Bets', quadrantKey: 'big-bets', count: dashboard?.ideas_by_quadrant?.['big-bets'] || 0, bgColor: 'bg-purple-900/20', borderColor: 'border-purple-700/50', textColor: 'text-purple-300' },
                      { title: 'Low Priority', quadrantKey: 'low-priority', count: 0, bgColor: 'bg-gray-900/20', borderColor: 'border-gray-700/50', textColor: 'text-gray-300' },
                      { title: 'Parking Lot', quadrantKey: 'parking-lot', count: 0, bgColor: 'bg-red-900/20', borderColor: 'border-red-700/50', textColor: 'text-red-300' },
                    ].map((quadrant, idx) => (
                      <button key={idx} onClick={() => { setFilters(prev => ({ ...prev, quadrant: quadrant.quadrantKey })); setCurrentView('ideas'); }} className={`${quadrant.bgColor} border-2 ${quadrant.borderColor} rounded-lg p-6 hover:opacity-80 transition cursor-pointer`}>
                        <div className="text-left">
                          <h3 className={`text-lg font-bold ${quadrant.textColor} mb-2`}>{quadrant.title}</h3>
                          <div className="text-4xl font-bold text-white mb-2">{quadrant.count}</div>
                          <div className="text-sm text-gray-400">ideas</div>
                        </div>
                      </button>
                    ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Trending Ideas</h2>
          <button onClick={() => setCurrentView('ideas')} className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {ideas.slice(0, 3).map(idea => (
            <IdeaCard key={idea.id} idea={idea} onClick={() => { setSelectedIdea(idea); setShowIdeaDrawer(true); setHasUpvoted(false); }} />
          ))}
        </div>
      </div>
    </div>
  );

  const IdeasView = () => {
                const filteredIdeas = ideas.filter(idea => {
                  if (searchQuery && !idea.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                  if (filters.track !== 'all' && idea.track !== filters.track) return false;
                  if (filters.status !== 'all' && idea.status !== filters.status) return false;
                  if (filters.category !== 'all' && idea.category !== filters.category) return false;
                  if (filters.hospital !== 'all' && idea.hospital !== filters.hospital) return false;
                  if (filters.quadrant !== 'all' && idea.quadrant !== filters.quadrant) return false;
                  return true;
                });

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
              <option value="upvotes">Most Upvoted</option>
              <option value="recent">Most Recent</option>
              <option value="value">Highest Value</option>
            </select>
          </div>
          <div className="text-sm text-gray-400">Showing {filteredIdeas.length} of {ideas.length} ideas</div>
        </div>

                {showFilters && (
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-6">
                    <div className="grid grid-cols-5 gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Track</label>
                        <select value={filters.track} onChange={(e) => setFilters({ ...filters, track: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm">
                          <option value="all">All Tracks</option>
                          <option value="design-center">Design Center</option>
                          <option value="innovation-launchpad">Innovation Launchpad</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Status</label>
                        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm">
                          <option value="all">All Status</option>
                          <option value="in-review">In Review</option>
                          <option value="approved">Approved</option>
                          <option value="in-progress">In Progress</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Quadrant</label>
                        <select value={filters.quadrant} onChange={(e) => setFilters({ ...filters, quadrant: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm">
                          <option value="all">All Quadrants</option>
                          <option value="quick-wins">Quick Wins</option>
                          <option value="big-bets">Big Bets</option>
                          <option value="low-priority">Low Priority</option>
                          <option value="parking-lot">Parking Lot</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Category</label>
                        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm">
                          <option value="all">All Categories</option>
                          <option value="Clinical Excellence">Clinical Excellence</option>
                          <option value="Consumer Network">Consumer Network</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Hospital</label>
                        <select value={filters.hospital} onChange={(e) => setFilters({ ...filters, hospital: e.target.value })} className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm">
                          <option value="all">All Hospitals</option>
                          <option value="Orlando">Orlando</option>
                          <option value="Tampa">Tampa</option>
                        </select>
                      </div>
                    </div>
                    <button onClick={() => setFilters({ track: 'all', status: 'all', category: 'all', hospital: 'all', quadrant: 'all', sortBy: filters.sortBy })} className="text-sm text-blue-400 hover:text-blue-300">Clear All Filters</button>
                  </div>
                )}

        <div className="grid grid-cols-2 gap-4">
          {filteredIdeas.map(idea => (
            <IdeaCard key={idea.id} idea={idea} onClick={() => { setSelectedIdea(idea); setShowIdeaDrawer(true); setHasUpvoted(false); }} />
          ))}
        </div>
      </div>
    );
  };

  const IdeaCard = ({ idea, onClick }: { idea: Idea; onClick: () => void }) => (
    <div onClick={onClick} className="bg-gray-800/50 rounded-lg p-5 border border-gray-700 hover:border-blue-600 transition cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{idea.title}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <img src={getHeadshot(idea.submitter_name)} alt={idea.submitter_name} className="w-6 h-6 rounded-full object-cover" />
            <span>{idea.submitter_name}</span>
            <span>-</span>
            <span>{idea.hospital}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {showMonetary ? (
          <>
                        <div className="bg-gray-900/50 rounded p-2">
                          <div className="text-xs text-gray-400">Value</div>
                          <div className="text-sm font-bold text-white">${((idea.value || idea.estimated_value || 0) / 1000000).toFixed(1)}M</div>
                        </div>
                        <div className="bg-gray-900/50 rounded p-2">
                          <div className="text-xs text-gray-400">ROI</div>
                          <div className="text-sm font-bold text-green-400">{idea.roi || idea.estimated_roi || 'N/A'}:1</div>
                        </div>
            <div className="bg-gray-900/50 rounded p-2">
              <div className="text-xs text-gray-400">Score</div>
              <div className="text-sm font-bold text-blue-400">{idea.feasibility_score}/10</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gray-900/50 rounded p-2">
              <div className="text-xs text-gray-400">Upvotes</div>
              <div className="text-sm font-bold text-purple-400">{idea.upvotes}</div>
            </div>
                        <div className="bg-gray-900/50 rounded p-2">
                          <div className="text-xs text-gray-400">Comments</div>
                          <div className="text-sm font-bold text-blue-400">{idea.comments_count || Math.floor(idea.upvotes / 3)}</div>
            </div>
            <div className="bg-gray-900/50 rounded p-2">
              <div className="text-xs text-gray-400">Score</div>
              <div className="text-sm font-bold text-green-400">{idea.feasibility_score}/10</div>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-3 text-gray-400">
          <div className="flex items-center space-x-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{idea.upvotes}</span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          idea.status === 'approved' ? 'bg-green-900/30 text-green-300' :
          idea.status === 'in-progress' ? 'bg-blue-900/30 text-blue-300' :
          'bg-yellow-900/30 text-yellow-300'
        }`}>{idea.status}</span>
      </div>
    </div>
  );

  const AgentsView = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">AI Agents</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Select Idea</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {ideas.map(idea => (
              <div key={idea.id} onClick={() => { setSelectedIdea(idea); setAgentResult(null); }} className={`p-3 rounded-lg cursor-pointer transition ${selectedIdea?.id === idea.id ? 'bg-blue-600/30 border border-blue-500' : 'bg-gray-800/50 border border-transparent hover:border-gray-600'}`}>
                <p className="text-sm font-medium text-white">{idea.title}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <img src={getHeadshot(idea.submitter_name)} alt={idea.submitter_name} className="w-5 h-5 rounded-full object-cover" />
                  <p className="text-xs text-gray-400">{idea.submitter_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Run Agent</h2>
          <div className="space-y-2">
                        {[
                          { id: 'system-context', name: 'System Context Engine', desc: 'Detect integrated systems', icon: Activity },
                          { id: 'solution-architecture', name: 'Solution Architecture', desc: 'Technical diagrams & estimates', icon: Layers },
                          { id: 'feasibility', name: 'Feasibility Scorer', desc: '5-dimensional analysis', icon: Target },
                          { id: 'similarity-matcher', name: 'Similarity Matcher', desc: 'Find similar solutions (55 hospitals)', icon: Share2 },
                          { id: 'strategic-fit', name: 'Strategic Fit Classifier', desc: '2x2 matrix classification', icon: BarChart3 },
                          { id: 'resource-optimization', name: 'Resource Optimizer', desc: 'Team & budget allocation (RL)', icon: Users },
                          { id: 'brd-generate', name: 'BRD Generator', desc: 'Auto-generate documents', icon: FileText },
                          { id: 'coaching', name: 'AI Coach', desc: 'Just-in-time guidance', icon: Brain },
                          { id: 'notification-intel', name: 'Notification Intelligence', desc: 'Smart timing & channels', icon: Bell },
                        ].map(agent => (
              <button key={agent.id} onClick={() => runAgent(agent.id)} disabled={!selectedIdea || agentLoading} className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-left hover:border-blue-500 transition disabled:opacity-50 flex items-center space-x-3">
                <agent.icon className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-white">{agent.name}</p>
                  <p className="text-xs text-gray-400">{agent.desc}</p>
                </div>
              </button>
            ))}
          </div>
          <input type="text" value={coachQuestion} onChange={(e) => setCoachQuestion(e.target.value)} placeholder="Ask the AI Coach a question..." className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500" />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Results</h2>
          {agentLoading && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-400">Running AI Agent...</p>
            </div>
          )}
          {agentResult && !agentLoading && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 max-h-[500px] overflow-y-auto">
              <pre className="text-xs text-gray-300 whitespace-pre-wrap">{JSON.stringify(agentResult, null, 2)}</pre>
            </div>
          )}
          {!agentResult && !agentLoading && selectedIdea && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <p className="text-sm text-gray-400">Selected: <span className="text-white font-medium">{selectedIdea.title}</span></p>
              <p className="text-xs text-gray-500 mt-2">Click an AI Agent to analyze this idea</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const AnalyticsView = () => {
    const [timeRange, setTimeRange] = useState('YTD');

    const allIdeasOverTime = [
      { month: 'Jan', submitted: 8, approved: 3, value: 45, quarter: 'Q1' },
      { month: 'Feb', submitted: 12, approved: 5, value: 67, quarter: 'Q1' },
      { month: 'Mar', submitted: 15, approved: 8, value: 89, quarter: 'Q1' },
      { month: 'Apr', submitted: 10, approved: 4, value: 52, quarter: 'Q2' },
      { month: 'May', submitted: 18, approved: 9, value: 103, quarter: 'Q2' },
      { month: 'Jun', submitted: 14, approved: 7, value: 78, quarter: 'Q2' },
      { month: 'Jul', submitted: 16, approved: 6, value: 71, quarter: 'Q3' },
      { month: 'Aug', submitted: 11, approved: 5, value: 62, quarter: 'Q3' },
      { month: 'Sep', submitted: 13, approved: 7, value: 85, quarter: 'Q3' },
      { month: 'Oct', submitted: 19, approved: 10, value: 112, quarter: 'Q4' },
      { month: 'Nov', submitted: 22, approved: 12, value: 143, quarter: 'Q4' },
      { month: 'Dec', submitted: 7, approved: 4, value: 41, quarter: 'Q4' },
    ];

    const ideasOverTime = timeRange === 'YTD' 
      ? allIdeasOverTime 
      : allIdeasOverTime.filter(d => d.quarter === timeRange);

    const filteredTotals = ideasOverTime.reduce((acc, d) => ({
      submitted: acc.submitted + d.submitted,
      approved: acc.approved + d.approved,
      value: acc.value + d.value
    }), { submitted: 0, approved: 0, value: 0 });

    const kpiData = {
      totalIdeas: timeRange === 'YTD' ? (dashboard?.total_ideas || 100) : filteredTotals.submitted,
      approved: timeRange === 'YTD' ? (dashboard?.approved_ideas || 51) : filteredTotals.approved,
      inProgress: timeRange === 'YTD' ? 38 : Math.round(38 * (filteredTotals.submitted / 100)),
      inReview: timeRange === 'YTD' ? 11 : Math.round(11 * (filteredTotals.submitted / 100)),
      totalValue: timeRange === 'YTD' ? 648000000 : filteredTotals.value * 1000000,
      avgROI: timeRange === 'YTD' ? (dashboard?.average_roi || 26.3) : (20 + Math.random() * 10).toFixed(1),
      avgTimeToApproval: 14,
      employeeEngagement: timeRange === 'YTD' ? 89 : (80 + Math.floor(Math.random() * 15)),
      replicationSavings: timeRange === 'YTD' ? 23000000 : Math.round(23000000 * (filteredTotals.value / 948)),
      aiProcessingTime: 2.3,
    };

    const valueByCategory = [
      { name: 'Clinical Excellence', value: 189, ideas: 28, color: '#3B82F6' },
      { name: 'Consumer Network', value: 234, ideas: 35, color: '#22D3EE' },
      { name: 'Whole Person Care', value: 98, ideas: 15, color: '#A855F7' },
      { name: 'Team Members', value: 76, ideas: 12, color: '#FB923C' },
      { name: 'Growth', value: 51, ideas: 10, color: '#22C55E' },
    ];

    const statusData = [
      { name: 'Approved', value: dashboard?.approved_ideas || 51, color: '#22C55E' },
      { name: 'In Progress', value: 38, color: '#3B82F6' },
      { name: 'In Review', value: 11, color: '#FACC15' },
    ];

    const agentPerformance = [
      { agent: 'Feasibility', accuracy: 94, speed: 98, usage: 100 },
      { agent: 'Architecture', accuracy: 89, speed: 95, usage: 87 },
      { agent: 'Similarity', accuracy: 92, speed: 99, usage: 100 },
      { agent: 'Strategic Fit', accuracy: 88, speed: 97, usage: 100 },
      { agent: 'BRD Gen', accuracy: 91, speed: 85, usage: 78 },
      { agent: 'RL Optimizer', accuracy: 86, speed: 72, usage: 65 },
    ];

    const hospitalData = [
      { hospital: 'Orlando', ideas: 28, value: 156 },
      { hospital: 'Tampa', ideas: 22, value: 134 },
      { hospital: 'Corporate', ideas: 31, value: 198 },
      { hospital: 'Celebration', ideas: 11, value: 87 },
      { hospital: 'Other', ideas: 8, value: 73 },
    ];

    const roiDistribution = [
      { range: '0-5:1', count: 8 },
      { range: '5-10:1', count: 12 },
      { range: '10-20:1', count: 18 },
      { range: '20-30:1', count: 24 },
      { range: '30+:1', count: 38 },
    ];

    const formatCurrency = (value: number) => {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
      return `$${value}`;
    };

    return (
      <div style={{ width: '100%', minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', padding: '30px', fontFamily: 'Arial, sans-serif', color: '#fff' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px 0', background: 'linear-gradient(135deg, #3B82F6 0%, #22D3EE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Innovation Analytics Dashboard
            </h1>
            <p style={{ margin: 0, color: '#94A3B8', fontSize: '16px' }}>
              Real-time insights - 9 AI Agents - 55 Hospitals - December 2025
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['YTD', 'Q4', 'Q3', 'Q2'].map(range => (
              <button key={range} onClick={() => setTimeRange(range)} style={{ padding: '10px 20px', background: timeRange === range ? '#3B82F6' : '#1E293B', border: timeRange === range ? '2px solid #3B82F6' : '2px solid #334155', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Top KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Ideas</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{kpiData.totalIdeas}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>+23% vs Q3</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Approved</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{kpiData.approved}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>51% approval rate</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Value</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{formatCurrency(kpiData.totalValue)}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>Pipeline value</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #FACC15 0%, #CA8A04 100%)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', color: '#1E293B' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Avg ROI</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{kpiData.avgROI}:1</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>Industry: 8:1</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #22D3EE 0%, #0891B2 100%)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Engagement</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{kpiData.employeeEngagement}%</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>89K active users</div>
          </div>
        </div>

        {/* Middle Row - 2 Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: '#1E293B', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#fff' }}>Ideas & Value Trend (Last 8 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={ideasOverTime}>
                <defs>
                  <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '8px' }} labelStyle={{ color: '#fff' }} />
                <Legend />
                <Area type="monotone" dataKey="submitted" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSubmitted)" name="Submitted" />
                <Area type="monotone" dataKey="approved" stroke="#22C55E" fillOpacity={1} fill="url(#colorApproved)" name="Approved" />
                <Area type="monotone" dataKey="value" stroke="#A855F7" fillOpacity={1} fill="url(#colorValue)" name="Value ($M)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: '#1E293B', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#fff' }}>Ideas by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Third Row - Value by Category & Hospital Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: '#1E293B', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#fff' }}>Value by Vision 2030 Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={valueByCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94A3B8" />
                <YAxis dataKey="name" type="category" width={150} stroke="#94A3B8" />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '8px' }} formatter={(value) => `$${value}M`} />
                <Legend />
                <Bar dataKey="value" name="Value ($M)">
                  {valueByCategory.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: '#1E293B', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#fff' }}>Ideas & Value by Hospital</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hospitalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hospital" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="ideas" fill="#3B82F6" name="Ideas" />
                <Bar dataKey="value" fill="#A855F7" name="Value ($M)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fourth Row - AI Agent Performance & ROI Distribution */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: '#1E293B', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#fff' }}>AI Agent Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={agentPerformance}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="agent" stroke="#94A3B8" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94A3B8" />
                <Radar name="Accuracy" dataKey="accuracy" stroke="#22C55E" fill="#22C55E" fillOpacity={0.3} />
                <Radar name="Speed" dataKey="speed" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Radar name="Usage" dataKey="usage" stroke="#A855F7" fill="#A855F7" fillOpacity={0.3} />
                <Legend />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: '#1E293B', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#fff' }}>ROI Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roiDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="range" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#FACC15" name="Number of Ideas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row - Key Insights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', padding: '20px', borderRadius: '12px', border: '2px solid #22D3EE' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚡</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>{kpiData.avgTimeToApproval} days</div>
            <div style={{ fontSize: '14px', color: '#94A3B8' }}>Avg Time to Approval</div>
            <div style={{ fontSize: '12px', color: '#22C55E', marginTop: '8px' }}>-70% vs manual</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', padding: '20px', borderRadius: '12px', border: '2px solid #22C55E' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>{formatCurrency(kpiData.replicationSavings)}</div>
            <div style={{ fontSize: '14px', color: '#94A3B8' }}>Replication Savings</div>
            <div style={{ fontSize: '12px', color: '#22C55E', marginTop: '8px' }}>From similarity detection</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', padding: '20px', borderRadius: '12px', border: '2px solid #A855F7' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🤖</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>{kpiData.aiProcessingTime} min</div>
            <div style={{ fontSize: '14px', color: '#94A3B8' }}>AI Processing Time</div>
            <div style={{ fontSize: '12px', color: '#22C55E', marginTop: '8px' }}>Per idea analyzed</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', padding: '20px', borderRadius: '12px', border: '2px solid #FACC15' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>38</div>
            <div style={{ fontSize: '14px', color: '#94A3B8' }}>High ROI Ideas (30+:1)</div>
            <div style={{ fontSize: '12px', color: '#22C55E', marginTop: '8px' }}>38% of portfolio</div>
          </div>
        </div>
      </div>
    );
  };

    const LeaderboardView = () => (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Innovation Leaderboard</h1>
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Innovator</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Ideas</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Approved</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Total Value</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Upvotes</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((person, idx) => (
                <tr key={person.name} className="border-t border-gray-700 hover:bg-gray-900/30">
                  <td className="px-6 py-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-400 text-black' : idx === 2 ? 'bg-orange-600 text-white' : 'bg-gray-700 text-white'}`}>{person.rank}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={getHeadshot(person.name)} alt={person.name} className="w-10 h-10 rounded-full object-cover border-2 border-gray-600" />
                      <span className="font-medium text-white">{person.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-semibold">{person.ideas_count}</td>
                  <td className="px-6 py-4 text-green-400 font-semibold">{person.approved_count}</td>
                  <td className="px-6 py-4 text-white font-semibold">${(person.total_value / 1000000).toFixed(1)}M</td>
                  <td className="px-6 py-4 text-blue-400 font-semibold">{person.total_upvotes}</td>
                  <td className="px-6 py-4 text-yellow-400 font-semibold">{person.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    const RewardsView = () => {
      const tierColors: Record<string, string> = {
        'Bronze': 'from-orange-700 to-orange-900',
        'Silver': 'from-gray-400 to-gray-600',
        'Gold': 'from-yellow-500 to-yellow-700',
        'Platinum': 'from-purple-500 to-purple-700'
      };
    
      const giftCards = rewards?.rewards?.filter((r: any) => r.category === 'gift_card') || [];
      const experiences = rewards?.rewards?.filter((r: any) => r.category !== 'gift_card') || [];
    
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Innovation Rewards</h1>
            <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${tierColors[userRewards?.tier || 'Bronze']} text-white font-semibold flex items-center space-x-2`}>
              <Award className="w-5 h-5" />
              <span>{userRewards?.tier || 'Bronze'} Tier</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-700/50">
              <div className="flex items-center space-x-3 mb-2">
                <Star className="w-8 h-8 text-yellow-400" />
                <div>
                  <div className="text-3xl font-bold text-white">{userRewards?.total_points || 0}</div>
                  <div className="text-sm text-gray-400">Total Points</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-400">
                {userRewards?.points_to_next_tier || 100} points to {userRewards?.next_tier || 'Silver'}
              </div>
              <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${Math.min(100, ((userRewards?.total_points || 0) / (userRewards?.points_to_next_tier || 100 + (userRewards?.total_points || 0))) * 100)}%` }} />
              </div>
            </div>
          
            <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 rounded-xl p-6 border border-green-700/50">
              <div className="flex items-center space-x-3 mb-2">
                <Gift className="w-8 h-8 text-green-400" />
                <div>
                  <div className="text-3xl font-bold text-white">{userRewards?.redemptions_count || 0}</div>
                  <div className="text-sm text-gray-400">Rewards Redeemed</div>
                </div>
              </div>
            </div>
          
            <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-xl p-6 border border-orange-700/50">
              <div className="flex items-center space-x-3 mb-2">
                <Trophy className="w-8 h-8 text-orange-400" />
                <div>
                  <div className="text-3xl font-bold text-white">#{userRewards?.rank || '-'}</div>
                  <div className="text-sm text-gray-400">Leaderboard Rank</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Coffee className="w-6 h-6 mr-2 text-green-400" />
              <ShoppingBag className="w-6 h-6 mr-2 text-orange-400" />
              Gift Cards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {giftCards.map((reward: any) => (
                <div key={reward.id} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-blue-500/50 transition">
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={reward.brand === 'Starbucks' ? '/images/starbucks-card.png' : '/images/amazon-card.png'} 
                      alt={`${reward.brand} Gift Card`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{reward.brand} Gift Card</h3>
                    <span className="text-2xl font-bold text-white">${reward.value}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{reward.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-semibold">{reward.points_required} pts</span>
                    <button 
                      disabled={(userRewards?.total_points || 0) < reward.points_required}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${(userRewards?.total_points || 0) >= reward.points_required ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Award className="w-6 h-6 mr-2 text-purple-400" />
              Premium Experiences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {experiences.map((reward: any) => (
                <div key={reward.id} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-purple-500/50 transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-purple-900/50 flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-400" />
                    </div>
                    {reward.value > 0 && <span className="text-lg font-bold text-gray-400">${reward.value} value</span>}
                  </div>
                  <h3 className="font-semibold text-white mb-1">{reward.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{reward.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-semibold">{reward.points_required} pts</span>
                    <button 
                      disabled={(userRewards?.total_points || 0) < reward.points_required}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${(userRewards?.total_points || 0) >= reward.points_required ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">How to Earn Points</h2>
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Activity</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-400">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {rewards?.points_activities && Object.entries(rewards.points_activities).map(([key, value]: [string, any]) => (
                    <tr key={key} className="border-t border-gray-700">
                      <td className="px-6 py-3 text-white">{value.description}</td>
                      <td className="px-6 py-3 text-right text-yellow-400 font-semibold">+{value.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    };

    const PipelineView = () => {
      const stages = [
        { id: 'define', name: 'DEFINE', description: 'Problem framing & opportunity identification', color: 'from-blue-600 to-blue-700', icon: Target, deliverables: ['Problem Statement', 'Stakeholder Map', 'Opportunity Brief'] },
        { id: 'research', name: 'RESEARCH', description: 'User research & market analysis', color: 'from-purple-600 to-purple-700', icon: Search, deliverables: ['User Interviews', 'Market Analysis', 'Competitive Landscape'] },
        { id: 'co-create', name: 'CO-CREATE', description: 'Ideation & collaborative design', color: 'from-pink-600 to-pink-700', icon: Users, deliverables: ['Design Workshop', 'Concept Sketches', 'User Feedback'] },
        { id: 'design-value', name: 'DESIGN VALUE', description: 'Business case & value proposition', color: 'from-orange-600 to-orange-700', icon: DollarSign, deliverables: ['Business Case', 'ROI Model', 'Value Proposition'] },
        { id: 'prototype', name: 'PROTOTYPE', description: 'Build & test MVP', color: 'from-green-600 to-green-700', icon: Layers, deliverables: ['MVP Build', 'User Testing', 'Technical Spec'] },
        { id: 'pilot', name: 'PILOT', description: 'Real-world validation & scale prep', color: 'from-teal-600 to-teal-700', icon: Rocket, deliverables: ['Pilot Plan', 'Success Metrics', 'Scale Roadmap'] }
      ];

      const getIdeasInStage = (stageId: string) => {
        return ideas.filter(idea => idea.phase?.toLowerCase().replace(' ', '-') === stageId || 
          (stageId === 'define' && !idea.phase) ||
          (stageId === 'design-value' && idea.phase === 'design value'));
      };

      const totalPipelineValue = ideas.reduce((sum, idea) => sum + (idea.estimated_value || 0), 0);
      const [selectedStage, setSelectedStage] = useState<string | null>(null);
      const [pendingApprovals] = useState([
        { id: 1, title: 'AI Clinical Documentation', fromStage: 'Research', toStage: 'Co-Create', submitter: 'Dr. Michael Thompson', requestedDate: '2025-12-01' },
        { id: 2, title: 'Smart Room IoT', fromStage: 'Co-Create', toStage: 'Design Value', submitter: 'Jennifer Adams', requestedDate: '2025-11-28' },
        { id: 3, title: 'Patient Portal 2.0', fromStage: 'Design Value', toStage: 'Prototype', submitter: 'David Chen', requestedDate: '2025-11-25' },
      ]);

      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Design Center Pipeline</h1>
              <p className="text-gray-400">6-stage innovation workflow with gate approvals</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800/50 rounded-lg px-4 py-2 border border-gray-700">
                <div className="text-xs text-gray-400">Pipeline Value</div>
                <div className="text-xl font-bold text-green-400">${(totalPipelineValue / 1000000).toFixed(1)}M</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg px-4 py-2 border border-gray-700">
                <div className="text-xs text-gray-400">Active Projects</div>
                <div className="text-xl font-bold text-blue-400">{ideas.length}</div>
              </div>
              <div className="bg-yellow-900/30 rounded-lg px-4 py-2 border border-yellow-700/50">
                <div className="text-xs text-yellow-400">Pending Approvals</div>
                <div className="text-xl font-bold text-yellow-400">{pendingApprovals.length}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between overflow-x-auto pb-2">
              {stages.map((stage, index) => {
                const stageIdeas = getIdeasInStage(stage.id);
                const StageIcon = stage.icon;
                const isSelected = selectedStage === stage.id;
                return (
                  <div key={stage.id} className="flex items-center">
                    <div 
                      onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                      className={`flex flex-col items-center cursor-pointer transition-all ${isSelected ? 'scale-105' : 'hover:scale-102'}`} 
                      style={{ minWidth: '140px' }}
                    >
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-lg border-4 ${isSelected ? 'border-white' : 'border-gray-900'}`}>
                        <StageIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="mt-2 text-center">
                        <div className="text-xs font-bold text-white">{stage.name}</div>
                        <div className="text-lg font-bold text-white">{stageIdeas.length}</div>
                      </div>
                    </div>
                    {index < stages.length - 1 && (
                      <div className="mx-2 flex flex-col items-center">
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                        <div className="text-xs text-gray-500 mt-1">Gate {index + 1}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-6 gap-3">
            {stages.map(stage => {
              const stageIdeas = getIdeasInStage(stage.id);
              const StageIcon = stage.icon;
              return (
                <div key={stage.id} className="bg-gray-800/50 rounded-xl border border-gray-700 flex flex-col" style={{ minHeight: '400px' }}>
                  <div className={`p-3 rounded-t-xl bg-gradient-to-r ${stage.color}`}>
                    <div className="flex items-center space-x-2">
                      <StageIcon className="w-4 h-4 text-white" />
                      <span className="text-sm font-bold text-white">{stage.name}</span>
                    </div>
                    <div className="text-xs text-white/80 mt-1">{stageIdeas.length} projects</div>
                  </div>
                  <div className="p-2 flex-1 overflow-y-auto space-y-2">
                    {stageIdeas.slice(0, 6).map(idea => (
                      <div 
                        key={idea.id} 
                        onClick={() => { setSelectedIdea(idea); setShowIdeaDrawer(true); }} 
                        className="p-2 bg-gray-900/70 rounded-lg border border-gray-700 hover:border-blue-500/50 cursor-pointer transition text-xs"
                        draggable
                      >
                        <div className="font-medium text-white line-clamp-2 mb-1">{idea.title}</div>
                        <div className="flex items-center space-x-1">
                          <img src={getHeadshot(idea.submitter_name)} alt="" className="w-4 h-4 rounded-full" />
                          <span className="text-gray-400 truncate">{idea.submitter_name?.split(' ')[0] || 'Unknown'}</span>
                        </div>
                      </div>
                    ))}
                    {stageIdeas.length === 0 && <div className="text-center text-gray-500 py-4 text-xs">No projects</div>}
                  </div>
                  <div className="p-2 border-t border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Deliverables:</div>
                    {stage.deliverables.map((d, i) => (
                      <div key={i} className="flex items-center space-x-1 text-xs text-gray-500">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Pending Gate Approvals</h3>
              <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-sm font-medium">{pendingApprovals.length} awaiting review</span>
            </div>
            <div className="space-y-3">
              {pendingApprovals.map(approval => (
                <div key={approval.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={getHeadshot(approval.submitter)} alt="" className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="text-white font-medium">{approval.title}</div>
                      <div className="text-sm text-gray-400">{approval.submitter} • Requested {approval.requestedDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-gray-400">{approval.fromStage} → {approval.toStage}</div>
                    <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 rounded-lg text-sm font-medium flex items-center space-x-1">
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/50 rounded-lg text-sm font-medium">
                      Request Info
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    const ChallengesView = () => {
      const innovatorChallenges = [
        { id: 1, title: 'Best Patient Safety Idea', theme: 'Clinical Safety Innovations', status: 'active', deadline: 'Dec 31, 2025', prize: '$500 Amazon Gift Card', submissions: 23, participants: 45, winner: null, audience: 'innovator' },
        { id: 2, title: 'Most Creative Solution', theme: 'Out-of-the-Box Thinking', status: 'active', deadline: 'Dec 31, 2025', prize: '$300 Starbucks Gift Card', submissions: 18, participants: 32, winner: null, audience: 'innovator' },
        { id: 3, title: 'Community Choice Award', theme: 'Peer-Voted Excellence', status: 'completed', deadline: 'Nov 30, 2025', prize: '$400 Amazon Gift Card', submissions: 31, participants: 52, winner: { name: 'Dr. Sarah Chen', idea: 'AI-Powered Patient Communication', hospital: 'ContosoHealth Orlando' }, audience: 'innovator' },
        { id: 4, title: 'January Team Collaboration Challenge', theme: 'Cross-Department Innovation', status: 'upcoming', deadline: 'Jan 31, 2026', prize: '$500 Amazon Gift Card', submissions: 0, participants: 12, winner: null, audience: 'innovator' }
      ];
      
      const executiveChallenges = [
        { id: 5, title: 'Highest ROI Initiative', theme: 'Financial Impact Excellence', status: 'active', deadline: 'Dec 31, 2025', prize: 'Executive Recognition + $1000 Donation to Charity', submissions: 15, participants: 28, winner: null, audience: 'executive' },
        { id: 6, title: 'Strategic Alignment Award', theme: 'Mission-Driven Innovation', status: 'active', deadline: 'Dec 31, 2025', prize: 'Board Presentation Opportunity', submissions: 12, participants: 22, winner: null, audience: 'executive' },
        { id: 7, title: 'Cost Reduction Champion', theme: 'Operational Efficiency', status: 'completed', deadline: 'Nov 30, 2025', prize: 'Executive Spotlight + $500 Amazon Gift Card', submissions: 28, participants: 41, winner: { name: 'Marcus Johnson', idea: 'AI-Powered Supply Chain Optimization', hospital: 'ContosoHealth Tampa' }, audience: 'executive' },
        { id: 8, title: 'Q1 Portfolio Excellence', theme: 'Best Portfolio Performance', status: 'upcoming', deadline: 'Mar 31, 2026', prize: 'Innovation Summit Keynote', submissions: 0, participants: 8, winner: null, audience: 'executive' }
      ];
      
      const challenges = persona === 'innovator' ? innovatorChallenges : executiveChallenges;

      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Innovation Challenges</h1>
              <p className="text-gray-400">Monthly themed challenges with prizes for top innovators</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create Challenge</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-xl p-5 border border-green-700/50">
              <div className="text-sm text-gray-400 mb-1">Active Challenges</div>
              <div className="text-3xl font-bold text-green-400">{challenges.filter(c => c.status === 'active').length}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-5 border border-purple-700/50">
              <div className="text-sm text-gray-400 mb-1">Total Submissions</div>
              <div className="text-3xl font-bold text-purple-400">{challenges.reduce((sum, c) => sum + c.submissions, 0)}</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-xl p-5 border border-yellow-700/50">
              <div className="text-sm text-gray-400 mb-1">Total Participants</div>
              <div className="text-3xl font-bold text-yellow-400">{challenges.reduce((sum, c) => sum + c.participants, 0)}</div>
            </div>
          </div>

          <div className="space-y-4">
            {challenges.map(challenge => (
              <div key={challenge.id} className={`bg-gray-800/50 rounded-xl p-6 border ${challenge.status === 'active' ? 'border-green-700/50' : challenge.status === 'upcoming' ? 'border-blue-700/50' : 'border-gray-700'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        challenge.status === 'active' ? 'bg-green-900/50 text-green-300' :
                        challenge.status === 'upcoming' ? 'bg-blue-900/50 text-blue-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {challenge.status.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-sm">Deadline: {challenge.deadline}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{challenge.title}</h3>
                    <p className="text-gray-400 mb-3">Theme: {challenge.theme}</p>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300">{challenge.submissions} submissions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300">{challenge.participants} participants</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Gift className="w-4 h-4 text-green-400" />
                        <span className="text-green-300 font-semibold">{challenge.prize}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {challenge.status === 'active' && (
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold text-sm">
                        Submit Idea
                      </button>
                    )}
                    {challenge.status === 'completed' && challenge.winner && (
                      <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-700/50 text-right">
                        <div className="text-xs text-yellow-400 mb-1 flex items-center justify-end space-x-1">
                          <Trophy className="w-3 h-3" />
                          <span>WINNER</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <img src={getHeadshot(challenge.winner.name)} alt={challenge.winner.name} className="w-8 h-8 rounded-full" />
                          <div>
                            <div className="text-sm font-semibold text-white">{challenge.winner.name}</div>
                            <div className="text-xs text-gray-400">{challenge.winner.hospital}</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-300 mt-1">{challenge.winner.idea}</div>
                      </div>
                    )}
                    {challenge.status === 'upcoming' && (
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm">
                        Register Interest
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    const ValueTrackerView = () => {
      const totalTarget = 100000000;
      const pipelineStages = [
        { name: 'Submitted', value: 647900000, count: 100, color: 'blue', percentage: 100 },
        { name: 'Approved', value: 312500000, count: 51, color: 'purple', percentage: 48.2 },
        { name: 'In Progress', value: 185000000, count: 30, color: 'yellow', percentage: 28.5 },
        { name: 'Realized', value: 42500000, count: 12, color: 'green', percentage: 6.6 }
      ];
      const realizedValue = 42500000;
      const progressToTarget = (realizedValue / totalTarget) * 100;

      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">$100M Value Tracker</h1>
              <p className="text-gray-400">Track innovation value from submission to realization</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Target</div>
              <div className="text-3xl font-bold text-green-400">$100M</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-xl p-6 border border-green-700/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-400">Realized Value</div>
                <div className="text-4xl font-bold text-green-400">${(realizedValue / 1000000).toFixed(1)}M</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Progress to $100M Target</div>
                <div className="text-2xl font-bold text-white">{progressToTarget.toFixed(1)}%</div>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-400 h-4 rounded-full transition-all duration-500" style={{ width: `${progressToTarget}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>$0</span>
              <span>$25M</span>
              <span>$50M</span>
              <span>$75M</span>
              <span>$100M</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {pipelineStages.map(stage => (
              <div key={stage.name} className={`bg-gray-800/50 rounded-xl p-5 border border-${stage.color}-700/50`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold bg-${stage.color}-900/50 text-${stage.color}-300`}>
                    {stage.name}
                  </span>
                  <span className="text-sm text-gray-400">{stage.count} ideas</span>
                </div>
                <div className={`text-2xl font-bold text-${stage.color}-400`}>${(stage.value / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-gray-400 mt-1">{stage.percentage}% of submitted</div>
              </div>
            ))}
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Value Pipeline Flow</h3>
            <div className="flex items-center justify-between">
              {pipelineStages.map((stage, index) => (
                <div key={stage.name} className="flex items-center">
                  <div className="text-center">
                    <div className={`w-20 h-20 rounded-full bg-${stage.color}-900/50 border-4 border-${stage.color}-500 flex items-center justify-center mb-2`}>
                      <div>
                        <div className={`text-lg font-bold text-${stage.color}-400`}>{stage.count}</div>
                        <div className="text-xs text-gray-400">ideas</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-white">{stage.name}</div>
                    <div className={`text-sm text-${stage.color}-400`}>${(stage.value / 1000000).toFixed(0)}M</div>
                  </div>
                  {index < pipelineStages.length - 1 && (
                    <div className="mx-4 flex flex-col items-center">
                      <ChevronRight className="w-8 h-8 text-gray-500" />
                      <div className="text-xs text-gray-500">{Math.round((pipelineStages[index + 1].count / stage.count) * 100)}%</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Top Realized Projects</h3>
              <div className="space-y-3">
                {[
                  { name: 'AI Clinical Documentation', value: 12500000, hospital: 'ContosoHealth Corporate' },
                  { name: 'Revenue Cycle Optimization', value: 8500000, hospital: 'ContosoHealth Orlando' },
                  { name: 'Predictive Sepsis Detection', value: 7200000, hospital: 'ContosoHealth Tampa' },
                  { name: 'ED Triage AI Assistant', value: 6800000, hospital: 'ContosoHealth Altamonte' },
                  { name: 'Supply Chain AI', value: 7500000, hospital: 'ContosoHealth Corporate' }
                ].map((project, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-white">{project.name}</div>
                      <div className="text-xs text-gray-400">{project.hospital}</div>
                    </div>
                    <div className="text-green-400 font-semibold">${(project.value / 1000000).toFixed(1)}M</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Value by Category</h3>
              <div className="space-y-3">
                {[
                  { category: 'Consumer Network', value: 125000000, color: 'blue' },
                  { category: 'Clinical Excellence', value: 98000000, color: 'green' },
                  { category: 'Operational Efficiency', value: 87000000, color: 'purple' },
                  { category: 'IT/Digital', value: 156000000, color: 'yellow' },
                  { category: 'Team Member Promise', value: 45000000, color: 'pink' }
                ].map((cat, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-${cat.color}-500`} />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{cat.category}</span>
                        <span className="text-white font-semibold">${(cat.value / 1000000).toFixed(0)}M</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                        <div className={`bg-${cat.color}-500 h-2 rounded-full`} style={{ width: `${(cat.value / 156000000) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    };

    const EventsView = () => {
      const [events, setEvents] = useState([
        { id: 1, title: 'Q1 Innovation Summit 2026', type: 'summit', date: 'Jan 15-16, 2026', location: 'ContosoHealth Corporate HQ, Orlando', description: 'Annual innovation showcase featuring top ideas from across the system', attendees: 250, capacity: 300, speakers: ['Dr. Sarah Mitchell, CIO', 'Gregory Katz, VP Innovation', 'Dr. Amanda Chen, CMO'], status: 'upcoming', registrationOpen: true, registered: false },
        { id: 2, title: 'AI in Healthcare Workshop', type: 'workshop', date: 'Dec 12, 2025', location: 'Virtual (Teams)', description: 'Hands-on workshop on implementing AI solutions in clinical workflows', attendees: 85, capacity: 100, speakers: ['Dr. Michael Thompson', 'Lisa Rodriguez'], status: 'upcoming', registrationOpen: true, registered: false },
        { id: 3, title: 'Design Thinking Bootcamp', type: 'bootcamp', date: 'Dec 18-19, 2025', location: 'ContosoHealth Tampa', description: 'Two-day intensive on human-centered design for healthcare innovation', attendees: 40, capacity: 50, speakers: ['Tom Wilson, Design Lead'], status: 'upcoming', registrationOpen: true, registered: false },
        { id: 4, title: 'November Innovation Showcase', type: 'showcase', date: 'Nov 20, 2025', location: 'Virtual', description: 'Monthly showcase of approved innovations and their impact', attendees: 312, capacity: 500, speakers: ['Various Innovators'], status: 'completed', registrationOpen: false, registered: true },
        { id: 5, title: 'Epic Integration Deep Dive', type: 'workshop', date: 'Jan 8, 2026', location: 'ContosoHealth Orlando', description: 'Technical workshop on FHIR APIs and Epic integration patterns', attendees: 45, capacity: 60, speakers: ['Robert Kim, Integration Architect'], status: 'upcoming', registrationOpen: true, registered: false }
      ]);
      const [showRegistrationModal, setShowRegistrationModal] = useState(false);
      const [showDetailsModal, setShowDetailsModal] = useState(false);
      const [selectedEvent, setSelectedEventForReg] = useState<any>(null);
      const [registrationStep, setRegistrationStep] = useState(1);

      const handleRegister = (event: any) => {
        setSelectedEventForReg(event);
        setShowRegistrationModal(true);
        setRegistrationStep(1);
      };

      const handleViewDetails = (event: any) => {
        setSelectedEventForReg(event);
        setShowDetailsModal(true);
      };

      const completeRegistration = () => {
        if (selectedEvent) {
          setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, registered: true, attendees: e.attendees + 1 } : e));
        }
        setShowRegistrationModal(false);
        setSelectedEventForReg(null);
      };

      const typeColors: Record<string, string> = {
        summit: 'bg-purple-900/50 text-purple-300 border-purple-700/50',
        workshop: 'bg-blue-900/50 text-blue-300 border-blue-700/50',
        bootcamp: 'bg-orange-900/50 text-orange-300 border-orange-700/50',
        showcase: 'bg-green-900/50 text-green-300 border-green-700/50'
      };

      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Innovation Events & Summits</h1>
              <p className="text-gray-400">Workshops, bootcamps, and showcases to accelerate innovation</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create Event</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-5 border border-purple-700/50">
              <div className="text-sm text-gray-400 mb-1">Upcoming Events</div>
              <div className="text-3xl font-bold text-purple-400">{events.filter(e => e.status === 'upcoming').length}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-5 border border-blue-700/50">
              <div className="text-sm text-gray-400 mb-1">Total Registrations</div>
              <div className="text-3xl font-bold text-blue-400">{events.reduce((sum, e) => sum + e.attendees, 0)}</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-xl p-5 border border-green-700/50">
              <div className="text-sm text-gray-400 mb-1">Your Registrations</div>
              <div className="text-3xl font-bold text-green-400">{events.filter(e => e.registered).length}</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-xl p-5 border border-yellow-700/50">
              <div className="text-sm text-gray-400 mb-1">Next Summit</div>
              <div className="text-lg font-bold text-yellow-400">Jan 15, 2026</div>
            </div>
          </div>

          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className={`bg-gray-800/50 rounded-xl p-6 border ${event.registered ? 'border-green-700/50' : event.status === 'upcoming' ? 'border-blue-700/50' : 'border-gray-700'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${typeColors[event.type]}`}>
                        {event.type.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${event.status === 'upcoming' ? 'bg-green-900/50 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                        {event.status.toUpperCase()}
                      </span>
                      {event.registered && (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-900/50 text-green-300 border border-green-700/50 flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>REGISTERED</span>
                        </span>
                      )}
                      {showMonetary && event.attendees >= 100 && (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-900/50 text-yellow-300 border border-yellow-700/50 flex items-center space-x-1">
                          <Zap className="w-3 h-3" />
                          <span>HIGH REGISTRATION</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                    <p className="text-gray-400 mb-3">{event.description}</p>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300">{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-300">{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">{event.attendees}/{event.capacity} registered</span>
                      </div>
                    </div>
                    <div className="mt-2 w-48">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className={`h-2 rounded-full ${event.attendees / event.capacity > 0.9 ? 'bg-red-500' : event.attendees / event.capacity > 0.7 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${(event.attendees / event.capacity) * 100}%` }} />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{Math.round((event.attendees / event.capacity) * 100)}% capacity</div>
                    </div>
                    <div className="mt-3 flex items-center space-x-2">
                      <span className="text-xs text-gray-400">Speakers:</span>
                      {event.speakers.slice(0, 3).map((speaker, idx) => (
                        <div key={idx} className="flex items-center space-x-1">
                          <img src={getHeadshot(speaker)} alt={speaker} className="w-6 h-6 rounded-full" />
                          <span className="text-xs text-gray-300">{speaker.split(',')[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {event.registered ? (
                      <div className="flex flex-col items-end space-y-2">
                        <span className="px-4 py-2 bg-green-900/30 text-green-400 rounded-lg text-sm font-medium flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>You're Registered!</span>
                        </span>
                        <button className="text-red-400 hover:text-red-300 text-sm">Cancel Registration</button>
                      </div>
                    ) : event.registrationOpen ? (
                      <button onClick={() => handleRegister(event)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm">
                        Register Now
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg text-sm">Registration Closed</span>
                    )}
                    <button onClick={() => handleViewDetails(event)} className="text-blue-400 hover:text-blue-300 text-sm">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showDetailsModal && selectedEvent && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Event Details</h2>
                  <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-white">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded text-sm font-semibold border ${typeColors[selectedEvent.type]}`}>{selectedEvent.type.toUpperCase()}</span>
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${selectedEvent.status === 'upcoming' ? 'bg-green-900/50 text-green-300' : 'bg-gray-700 text-gray-300'}`}>{selectedEvent.status.toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedEvent.title}</h3>
                    <p className="text-gray-400">{selectedEvent.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center space-x-2 text-blue-400 mb-2"><Clock className="w-5 h-5" /><span className="font-semibold">Date & Time</span></div>
                      <div className="text-white">{selectedEvent.date}</div>
                      <div className="text-sm text-gray-400 mt-1">9:00 AM - 5:00 PM EST</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center space-x-2 text-purple-400 mb-2"><Target className="w-5 h-5" /><span className="font-semibold">Location</span></div>
                      <div className="text-white">{selectedEvent.location}</div>
                      <div className="text-sm text-gray-400 mt-1">{selectedEvent.location.includes('Virtual') ? 'Teams link will be sent' : 'Parking available'}</div>
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center space-x-2 text-green-400 mb-3"><Users className="w-5 h-5" /><span className="font-semibold">Registration Status</span></div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white">{selectedEvent.attendees} / {selectedEvent.capacity} registered</span>
                      <span className={`text-sm ${selectedEvent.attendees / selectedEvent.capacity > 0.9 ? 'text-red-400' : selectedEvent.attendees / selectedEvent.capacity > 0.7 ? 'text-yellow-400' : 'text-green-400'}`}>{Math.round((selectedEvent.attendees / selectedEvent.capacity) * 100)}% capacity</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div className={`h-3 rounded-full ${selectedEvent.attendees / selectedEvent.capacity > 0.9 ? 'bg-red-500' : selectedEvent.attendees / selectedEvent.capacity > 0.7 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${(selectedEvent.attendees / selectedEvent.capacity) * 100}%` }} />
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <div className="font-semibold text-white mb-3">Speakers & Presenters</div>
                    <div className="space-y-3">
                      {selectedEvent.speakers.map((speaker: string, idx: number) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <img src={getHeadshot(speaker)} alt={speaker} className="w-10 h-10 rounded-full" />
                          <div>
                            <div className="text-white font-medium">{speaker.split(',')[0]}</div>
                            <div className="text-sm text-gray-400">{speaker.includes(',') ? speaker.split(',')[1].trim() : 'Speaker'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <div className="font-semibold text-white mb-3">Agenda</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-400">9:00 AM</span><span className="text-white">Registration & Networking</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">9:30 AM</span><span className="text-white">Opening Keynote</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">10:30 AM</span><span className="text-white">Breakout Sessions</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">12:00 PM</span><span className="text-white">Lunch & Innovation Showcase</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">1:30 PM</span><span className="text-white">Hands-on Workshops</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">4:00 PM</span><span className="text-white">Closing & Next Steps</span></div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    {selectedEvent.registrationOpen && !selectedEvent.registered && (
                      <button onClick={() => { setShowDetailsModal(false); handleRegister(selectedEvent); }} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold">Register Now</button>
                    )}
                    {selectedEvent.registered && (
                      <div className="flex-1 py-3 bg-green-900/30 text-green-400 rounded-lg font-semibold text-center flex items-center justify-center space-x-2">
                        <CheckCircle className="w-5 h-5" /><span>You're Registered!</span>
                      </div>
                    )}
                    <button onClick={() => setShowDetailsModal(false)} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold">Close</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showRegistrationModal && selectedEvent && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Event Registration</h2>
                  <button onClick={() => setShowRegistrationModal(false)} className="text-gray-400 hover:text-white">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex items-center justify-center mb-6">
                  {[1, 2, 3].map(step => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${registrationStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                        {registrationStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                      </div>
                      {step < 3 && <div className={`w-16 h-1 ${registrationStep > step ? 'bg-blue-600' : 'bg-gray-700'}`} />}
                    </div>
                  ))}
                </div>
                {registrationStep === 1 && (
                  <div className="space-y-4">
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-2">{selectedEvent.title}</h3>
                      <div className="text-sm text-gray-400">{selectedEvent.date} • {selectedEvent.location}</div>
                    </div>
                    <div className="space-y-3">
                      <div><label className="text-sm text-gray-400">Full Name</label><input type="text" defaultValue="Gregory Katz" className="w-full mt-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" /></div>
                      <div><label className="text-sm text-gray-400">Email</label><input type="email" defaultValue="gregory.katz@contosohealth.com" className="w-full mt-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" /></div>
                      <div><label className="text-sm text-gray-400">Department</label><input type="text" defaultValue="Cloud & AI Platforms" className="w-full mt-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" /></div>
                    </div>
                    <button onClick={() => setRegistrationStep(2)} className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold">Continue</button>
                  </div>
                )}
                {registrationStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div><label className="text-sm text-gray-400">Dietary Requirements</label><select className="w-full mt-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"><option>None</option><option>Vegetarian</option><option>Vegan</option><option>Gluten-Free</option><option>Kosher</option><option>Halal</option></select></div>
                      <div><label className="text-sm text-gray-400">Accessibility Needs</label><textarea className="w-full mt-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" rows={2} placeholder="Any accessibility requirements..." /></div>
                      <div className="flex items-center space-x-2"><input type="checkbox" id="virtual" className="rounded" /><label htmlFor="virtual" className="text-sm text-gray-300">I'll attend virtually (if available)</label></div>
                    </div>
                    <div className="flex space-x-3">
                      <button onClick={() => setRegistrationStep(1)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold">Back</button>
                      <button onClick={() => setRegistrationStep(3)} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold">Continue</button>
                    </div>
                  </div>
                )}
                {registrationStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 text-center">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                      <h3 className="text-lg font-semibold text-white">Ready to Register!</h3>
                      <p className="text-sm text-gray-400 mt-1">You'll receive a confirmation email with calendar invite</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-gray-400">Event</span><span className="text-white">{selectedEvent.title}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-400">Date</span><span className="text-white">{selectedEvent.date}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-400">Location</span><span className="text-white">{selectedEvent.location}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-400">Attendee</span><span className="text-white">Gregory Katz</span></div>
                    </div>
                    <button onClick={completeRegistration} className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold flex items-center justify-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Complete Registration</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    };

    const BulkImportView = () => {
      const [importHistory] = useState([
        { id: 1, filename: 'Q4_Strategic_Initiatives.xlsx', uploadedBy: 'Gregory Katz', uploadedAt: 'Nov 28, 2025', ideasImported: 15, status: 'completed', department: 'Executive' },
        { id: 2, filename: 'Nursing_Innovation_Ideas.xlsx', uploadedBy: 'Dr. Sarah Mitchell', uploadedAt: 'Nov 25, 2025', ideasImported: 23, status: 'completed', department: 'Nursing' },
        { id: 3, filename: 'IT_Modernization_Projects.xlsx', uploadedBy: 'Robert Kim', uploadedAt: 'Nov 20, 2025', ideasImported: 8, status: 'completed', department: 'IT' },
        { id: 4, filename: 'Pharmacy_Efficiency_Ideas.xlsx', uploadedBy: 'Dr. Michael Thompson', uploadedAt: 'Nov 15, 2025', ideasImported: 12, status: 'completed', department: 'Pharmacy' }
      ]);

      const templateColumns = [
        { name: 'Title', required: true, description: 'Brief title for the innovation idea' },
        { name: 'Description', required: true, description: 'Detailed description of the problem and solution' },
        { name: 'Department', required: true, description: 'Originating department (Nursing, IT, Pharmacy, etc.)' },
        { name: 'Hospital', required: true, description: 'Hospital location (e.g., ContosoHealth Orlando)' },
        { name: 'Submitter Name', required: true, description: 'Name of the person submitting the idea' },
        { name: 'Submitter Email', required: true, description: 'Email address for follow-up' },
        { name: 'Estimated Value ($)', required: false, description: 'Projected annual value/savings' },
        { name: 'Estimated ROI', required: false, description: 'Expected return on investment ratio' },
        { name: 'Priority', required: false, description: 'High, Medium, or Low' },
        { name: 'Category', required: false, description: 'Clinical, Operational, Financial, or Patient Experience' }
      ];

      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Excel Bulk Import</h1>
              <p className="text-gray-400">Import multiple ideas at once from Excel spreadsheets</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-blue-400" />
                <span>Upload Excel File</span>
              </h2>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500/50 transition cursor-pointer">
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Drag and drop your Excel file here</p>
                <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold">
                  Select File
                </button>
                <p className="text-gray-500 text-xs mt-4">Supports .xlsx and .xls files up to 10MB</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300">
                  <Download className="w-4 h-4" />
                  <span>Download Template</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-gray-300">
                  <FileText className="w-4 h-4" />
                  <span>View Sample Data</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <span>Template Columns</span>
              </h2>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {templateColumns.map((col, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-2 rounded bg-gray-900/50">
                    <div className={`w-2 h-2 rounded-full mt-2 ${col.required ? 'bg-red-400' : 'bg-gray-500'}`} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{col.name}</span>
                        {col.required && <span className="text-xs text-red-400">Required</span>}
                      </div>
                      <p className="text-gray-400 text-xs">{col.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-400" />
              <span>Import History</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                    <th className="pb-3">File Name</th>
                    <th className="pb-3">Uploaded By</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Ideas Imported</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {importHistory.map(item => (
                    <tr key={item.id} className="border-b border-gray-700/50">
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-green-400" />
                          <span className="text-white">{item.filename}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <img src={getHeadshot(item.uploadedBy)} alt={item.uploadedBy} className="w-6 h-6 rounded-full" />
                          <span className="text-gray-300">{item.uploadedBy}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-300">{item.department}</td>
                      <td className="py-3 text-gray-400">{item.uploadedAt}</td>
                      <td className="py-3">
                        <span className="text-blue-400 font-semibold">{item.ideasImported}</span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-900/50 text-green-300">
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    };

    const PortfolioTimelineView = () => {
      const quarters = [
        { year: 2024, q: 4 },
        { year: 2025, q: 1 },
        { year: 2025, q: 2 },
        { year: 2025, q: 3 },
        { year: 2025, q: 4 },
        { year: 2026, q: 1 },
      ];
      const totalQuarters = quarters.length;
      const getQuarterIndex = (year: number, q: number) => quarters.findIndex(t => t.year === year && t.q === q);

      const projects = [
        { id: 1, name: 'AI-Powered Patient Triage', owner: 'Dr. Sarah Mitchell', lane: 'Clinical Excellence', start: { year: 2024, q: 4 }, end: { year: 2025, q: 2 }, status: 'in-progress', color: '#22C55E', value: '$12.5M', milestones: [{ label: 'Pilot Go-Live', year: 2025, q: 1 }] },
        { id: 2, name: 'Smart Room of the Future', owner: 'Dr. Michael Thompson', lane: 'Consumer Experience', start: { year: 2025, q: 1 }, end: { year: 2025, q: 3 }, status: 'in-progress', color: '#3B82F6', value: '$18.2M', milestones: [{ label: 'Design Complete', year: 2025, q: 2 }] },
        { id: 3, name: 'Primary Care, The ContosoHealth Way', owner: 'Lisa Rodriguez', lane: 'Strategic', start: { year: 2025, q: 2 }, end: { year: 2025, q: 4 }, status: 'planned', color: '#F97316', value: '$25.0M', milestones: [] },
        { id: 4, name: 'Heart Failure + Coalition Clinical Value', owner: 'Jennifer Adams', lane: 'Clinical Excellence', start: { year: 2024, q: 4 }, end: { year: 2025, q: 3 }, status: 'in-progress', color: '#EC4899', value: '$15.8M', milestones: [{ label: 'CAB Approval', year: 2025, q: 1 }] },
        { id: 5, name: 'PX/HX Transformation', owner: 'Robert Kim', lane: 'Consumer Experience', start: { year: 2025, q: 1 }, end: { year: 2025, q: 4 }, status: 'in-progress', color: '#8B5CF6', value: '$22.1M', milestones: [{ label: 'Phase 1', year: 2025, q: 2 }, { label: 'Phase 2', year: 2025, q: 3 }] },
        { id: 6, name: 'Increasing Consumer Access', owner: 'David Chen', lane: 'Growth', start: { year: 2025, q: 3 }, end: { year: 2026, q: 1 }, status: 'planned', color: '#06B6D4', value: '$9.8M', milestones: [] },
        { id: 7, name: 'Spiritual Care Pilot', owner: 'Maria Garcia', lane: 'Whole Person Care', start: { year: 2024, q: 4 }, end: { year: 2025, q: 2 }, status: 'completed', color: '#10B981', value: '$5.2M', milestones: [{ label: 'Complete', year: 2025, q: 2 }] },
        { id: 8, name: 'AHMG Pilot', owner: 'Tom Wilson', lane: 'Strategic', start: { year: 2024, q: 4 }, end: { year: 2025, q: 1 }, status: 'completed', color: '#EAB308', value: '$6.5M', milestones: [] }
      ];

      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">2025 Portfolio Roadmap</h1>
              <p className="text-sm text-gray-400">Executive view of Design Center projects across quarters</p>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-300">
              <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-green-500" /><span>Completed</span></span>
              <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-blue-500" /><span>In Progress</span></span>
              <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-purple-500" /><span>Planned</span></span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-5 border border-blue-700/50">
              <div className="text-sm text-gray-400 mb-1">Active Projects</div>
              <div className="text-3xl font-bold text-blue-400">{projects.filter(p => p.status === 'in-progress').length}</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-xl p-5 border border-green-700/50">
              <div className="text-sm text-gray-400 mb-1">Completed</div>
              <div className="text-3xl font-bold text-green-400">{projects.filter(p => p.status === 'completed').length}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-5 border border-purple-700/50">
              <div className="text-sm text-gray-400 mb-1">Planned</div>
              <div className="text-3xl font-bold text-purple-400">{projects.filter(p => p.status === 'planned').length}</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-xl p-5 border border-yellow-700/50">
              <div className="text-sm text-gray-400 mb-1">Total Value</div>
              <div className="text-2xl font-bold text-yellow-400">$115.1M</div>
            </div>
          </div>

          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6 shadow-xl overflow-x-auto">
            <div style={{ display: 'grid', gridTemplateColumns: `250px repeat(${totalQuarters}, 1fr)`, minWidth: '900px' }}>
              <div style={{ gridRow: 1, gridColumn: 1, padding: '8px 12px', borderBottom: '1px solid #374151' }}>
                <span className="text-sm font-semibold text-gray-400">Project</span>
              </div>
              {quarters.map((q, idx) => (
                <div key={idx} style={{ gridRow: 1, gridColumn: idx + 2, textAlign: 'center', padding: '8px 0', borderBottom: '1px solid #374151', borderLeft: '1px solid #374151' }}>
                  <div className="text-sm font-semibold text-gray-300">Q{q.q}</div>
                  <div className="text-xs text-gray-500">{q.year}</div>
                </div>
              ))}

              {projects.map((project, rowIndex) => {
                const startIdx = getQuarterIndex(project.start.year, project.start.q);
                const endIdx = getQuarterIndex(project.end.year, project.end.q);
                const barStartCol = startIdx + 2;
                const barEndCol = endIdx + 3;

                return (
                  <React.Fragment key={project.id}>
                    <div style={{ gridRow: rowIndex + 2, gridColumn: 1, padding: '12px', borderBottom: '1px solid #1F2937' }}>
                      <div className="text-sm font-semibold text-white">{project.name}</div>
                      <div className="text-xs text-gray-400">{project.lane} • {project.owner}</div>
                    </div>
                    {quarters.map((_, qIdx) => (
                      <div key={qIdx} style={{ gridRow: rowIndex + 2, gridColumn: qIdx + 2, borderLeft: '1px solid #374151', borderBottom: '1px solid #1F2937', position: 'relative', minHeight: '50px' }} />
                    ))}
                    <div style={{ gridRow: rowIndex + 2, gridColumn: `${barStartCol} / ${barEndCol}`, position: 'relative', display: 'flex', alignItems: 'center', padding: '8px 4px', zIndex: 10 }}>
                      <div style={{ width: '100%', height: '28px', borderRadius: '14px', background: `linear-gradient(90deg, ${project.color}, ${project.color}CC)`, boxShadow: '0 2px 8px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', paddingLeft: '12px', fontSize: '11px', color: '#fff', fontWeight: 600, position: 'relative' }}>
                        {project.value}
                        {project.milestones?.map((m, mIdx) => {
                          const mQIdx = getQuarterIndex(m.year, m.q);
                          const spanQuarters = Math.max(1, endIdx - startIdx + 1);
                          const relPos = (mQIdx - startIdx + 0.5) / spanQuarters;
                          return (
                            <div key={mIdx} title={m.label} style={{ position: 'absolute', left: `${relPos * 100}%`, top: '-4px', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #FACC15', backgroundColor: '#1F2937', transform: 'translateX(-50%)' }} />
                          );
                        })}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-bold text-white mb-4">Launchpad vs Design Center</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Criteria</th>
                    <th className="text-center py-3 px-4 text-blue-400 font-semibold">Innovation Launchpad</th>
                    <th className="text-center py-3 px-4 text-purple-400 font-semibold">Design Center</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700/50"><td className="py-3 px-4 text-white">Focus</td><td className="py-3 px-4 text-center text-gray-300">Foster culture of innovation</td><td className="py-3 px-4 text-center text-gray-300">2030 Aspiration Projects</td></tr>
                  <tr className="border-b border-gray-700/50"><td className="py-3 px-4 text-white">Scope</td><td className="py-3 px-4 text-center text-gray-300">Bottom-up ideas from all staff</td><td className="py-3 px-4 text-center text-gray-300">Strategic, cabinet-sponsored</td></tr>
                  <tr className="border-b border-gray-700/50"><td className="py-3 px-4 text-white">Duration</td><td className="py-3 px-4 text-center text-gray-300">Ongoing submissions</td><td className="py-3 px-4 text-center text-gray-300">4-12 month engagements</td></tr>
                  <tr className="border-b border-gray-700/50"><td className="py-3 px-4 text-white">Budget</td><td className="py-3 px-4 text-center text-gray-300">$0-$50K quick wins</td><td className="py-3 px-4 text-center text-gray-300">$350K-$750K+ projects</td></tr>
                  <tr className="border-b border-gray-700/50"><td className="py-3 px-4 text-white">Approval</td><td className="py-3 px-4 text-center text-gray-300">Department level</td><td className="py-3 px-4 text-center text-gray-300">Corporate Cabinet</td></tr>
                  <tr><td className="py-3 px-4 text-white">AI Support</td><td className="py-3 px-4 text-center text-gray-300">9 AI Agents for analysis</td><td className="py-3 px-4 text-center text-gray-300">Full service design team</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    };

    const FragmentCard= ({ fragment, onClick }: { fragment: Fragment; onClick: () => void }) => {
    const statusColors: Record<string, string> = {
      'incubating': 'bg-blue-900/30 text-blue-300 border-blue-700/50',
      'maturing': 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50',
      'ready-to-promote': 'bg-green-900/30 text-green-300 border-green-700/50',
      'promoted': 'bg-purple-900/30 text-purple-300 border-purple-700/50'
    };
    
    return (
      <div onClick={onClick} className="bg-gray-800/50 rounded-lg p-5 border border-gray-700 hover:border-blue-500/50 cursor-pointer transition">
        <div className="flex items-start justify-between mb-3">
          <span className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[fragment.status] || statusColors['incubating']}`}>
            {fragment.status.replace('-', ' ')}
          </span>
          <div className="flex items-center space-x-2 text-gray-400">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">{fragment.comments.length}</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{fragment.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{fragment.rough_thought}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={getHeadshot(fragment.submitter_name)} alt={fragment.submitter_name} className="w-6 h-6 rounded-full object-cover" />
            <span className="text-sm text-gray-400">{fragment.submitter_name}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-blue-400">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm font-medium">{fragment.upvotes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${fragment.maturity_score >= 80 ? 'bg-green-500' : fragment.maturity_score >= 40 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                  style={{ width: `${fragment.maturity_score}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{fragment.maturity_score}%</span>
            </div>
          </div>
        </div>
        {fragment.category && (
          <div className="mt-3 flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">{fragment.category}</span>
            {fragment.hospital && <span className="text-xs text-gray-500">{fragment.hospital}</span>}
          </div>
        )}
      </div>
    );
  };

  const FragmentsView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Idea Fragments</h1>
          <p className="text-gray-400 mt-1">Rough thoughts and ideas being crowdsourced by the community</p>
        </div>
        <button onClick={() => setShowFragmentModal(true)} className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-semibold transition">
          <Plus className="w-5 h-5" />
          <span>Share a Thought</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Incubating', count: fragments.filter(f => f.status === 'incubating').length, color: 'text-blue-400', bg: 'bg-blue-900/20' },
          { label: 'Maturing', count: fragments.filter(f => f.status === 'maturing').length, color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
          { label: 'Ready to Promote', count: fragments.filter(f => f.status === 'ready-to-promote').length, color: 'text-green-400', bg: 'bg-green-900/20' },
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.bg} rounded-lg p-4 border border-gray-700`}>
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.count}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {fragments.map(fragment => (
          <FragmentCard 
            key={fragment.id} 
            fragment={fragment} 
            onClick={() => { setSelectedFragment(fragment); setShowFragmentDrawer(true); }} 
          />
        ))}
      </div>
    </div>
  );

  const FragmentDetailDrawer = () => {
    if (!selectedFragment || !showFragmentDrawer) return null;

    const handleAddFragmentComment = async () => {
      if (!newFragmentComment.trim()) return;
      await addFragmentComment(selectedFragment.id, newFragmentComment, isBuildingOn);
      setNewFragmentComment('');
      setIsBuildingOn(false);
    };

    const handlePromote = async () => {
      if (selectedFragment.maturity_score < 40) {
        alert('This fragment needs more community input before it can be promoted. Keep the conversation going!');
        return;
      }
      await promoteFragment(selectedFragment.id);
    };

    return (
      <div className="fixed inset-0 z-50 flex">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFragmentDrawer(false)} />
        <div className="absolute right-0 top-0 bottom-0 w-[650px] bg-gray-900 border-l border-gray-700 overflow-y-auto">
          <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between z-10">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 text-orange-400" />
              <h2 className="text-xl font-bold text-white">Idea Fragment</h2>
            </div>
            <button onClick={() => setShowFragmentDrawer(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedFragment.status === 'ready-to-promote' ? 'bg-green-900/50 text-green-300' :
                selectedFragment.status === 'maturing' ? 'bg-yellow-900/50 text-yellow-300' :
                selectedFragment.status === 'promoted' ? 'bg-purple-900/50 text-purple-300' :
                'bg-blue-900/50 text-blue-300'
              }`}>
                {selectedFragment.status.replace('-', ' ')}
              </span>
              <div className="flex items-center space-x-4">
                <button onClick={() => upvoteFragment(selectedFragment.id)} className="flex items-center space-x-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                  <ThumbsUp className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">{selectedFragment.upvotes}</span>
                </button>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{selectedFragment.title}</h1>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <img src={getHeadshot(selectedFragment.submitter_name)} alt={selectedFragment.submitter_name} className="w-6 h-6 rounded-full object-cover" />
                <span>by {selectedFragment.submitter_name}</span>
                {selectedFragment.hospital && <span>at {selectedFragment.hospital}</span>}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">The Rough Thought</h3>
              <p className="text-white">{selectedFragment.rough_thought}</p>
            </div>

            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-700/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">Maturity Score</h3>
                <span className="text-2xl font-bold text-white">{selectedFragment.maturity_score}%</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${selectedFragment.maturity_score >= 80 ? 'bg-green-500' : selectedFragment.maturity_score >= 40 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                  style={{ width: `${selectedFragment.maturity_score}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {selectedFragment.maturity_score >= 80 ? 'Ready to promote to a full idea for AI analysis!' :
                 selectedFragment.maturity_score >= 40 ? 'Getting there! More community input will help refine this idea.' :
                 'Just getting started. Add comments to help build this idea.'}
              </p>
            </div>

            {selectedFragment.status !== 'promoted' && (
              <button 
                onClick={handlePromote}
                disabled={selectedFragment.maturity_score < 40}
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition ${
                  selectedFragment.maturity_score >= 80 
                    ? 'bg-green-600 hover:bg-green-500 text-white' 
                    : selectedFragment.maturity_score >= 40
                    ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Rocket className="w-5 h-5" />
                <span>{selectedFragment.maturity_score >= 80 ? 'Promote to Full Idea' : selectedFragment.maturity_score >= 40 ? 'Promote Early (Needs More Input)' : 'Needs More Community Input'}</span>
              </button>
            )}

            {selectedFragment.status === 'promoted' && selectedFragment.promoted_to_idea_id && (
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700/50">
                <div className="flex items-center space-x-2 text-purple-300">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Promoted to Idea</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">This fragment has been promoted to idea {selectedFragment.promoted_to_idea_id}. You can now run AI agents on it!</p>
              </div>
            )}

            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Crowdsourcing Conversation</h3>
                <span className="text-sm text-gray-400">{selectedFragment.comments.length} comments</span>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-4">
                <textarea
                  value={newFragmentComment}
                  onChange={(e) => setNewFragmentComment(e.target.value)}
                  placeholder="Add your thoughts to help build this idea..."
                  className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isBuildingOn}
                      onChange={(e) => setIsBuildingOn(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-400">This builds on the idea (+15 maturity)</span>
                  </label>
                  <button 
                    onClick={handleAddFragmentComment}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition"
                  >
                    Add Comment
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {selectedFragment.comments.map(comment => (
                  <div key={comment.id} className={`rounded-lg p-4 border ${comment.is_building_on ? 'bg-green-900/20 border-green-700/50' : 'bg-gray-800/50 border-gray-700'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <img src={getHeadshot(comment.author_name)} alt={comment.author_name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="font-medium text-white">{comment.author_name}</div>
                          {comment.author_role && <div className="text-xs text-gray-400">{comment.author_role}</div>}
                        </div>
                      </div>
                      {comment.is_building_on && (
                        <span className="px-2 py-0.5 bg-green-900/50 text-green-300 text-xs rounded-full">Building on idea</span>
                      )}
                    </div>
                    <p className="text-gray-300 mb-2">{comment.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <button className="flex items-center space-x-1 hover:text-blue-400 transition">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{comment.upvotes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SubmitFragmentModal = () => {
    const [title, setTitle] = useState('');
    const [roughThought, setRoughThought] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = async () => {
      if (!title.trim() || !roughThought.trim()) return;
      try {
        await fetch(`${API_URL}/api/v1/fragments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            rough_thought: roughThought,
            submitter_name: USER_PROFILE.name,
            category: category || null,
            hospital: USER_PROFILE.hospital
          })
        });
        fetchFragments();
        setShowFragmentModal(false);
        setTitle('');
        setRoughThought('');
        setCategory('');
      } catch (e) { console.error(e); }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowFragmentModal(false)} />
        <div className="relative bg-gray-900 rounded-xl p-8 border border-gray-700 max-w-2xl w-full">
          <button onClick={() => setShowFragmentModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Share a Thought</h2>
              <p className="text-sm text-gray-400">Start with a rough idea - the community will help refine it</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">What's on your mind?</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" 
                placeholder="e.g., What if we could predict patient falls?" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your rough thought</label>
              <textarea 
                value={roughThought}
                onChange={(e) => setRoughThought(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" 
                rows={4} 
                placeholder="Share your initial thinking - it doesn't need to be polished. The community will help build on it..." 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category (optional)</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
                <option value="">Select a category</option>
                <option value="Nursing">Nursing</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Consumer Network">Consumer Network</option>
                <option value="Team Member Promise">Team Member Promise</option>
                <option value="Whole Person Care">Whole Person Care</option>
                <option value="IT/Digital">IT/Digital</option>
                <option value="Operations">Operations</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button 
              onClick={handleSubmit}
              className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-semibold transition"
            >
              Share for Crowdsourcing
            </button>
          </div>
        </div>
      </div>
    );
  };

    const IdeaDetailDrawer = () => {
      if (!selectedIdea || !showIdeaDrawer) return null;
    
      const handleUpvote = async () => {
        try {
          await fetch(`${API_URL}/api/v1/ideas/${selectedIdea.id}/upvote`, { method: 'POST' });
          setHasUpvoted(true);
          fetchIdeas();
        } catch (e) { console.error(e); }
      };

      const handleAddComment = () => {
        if (!newComment.trim()) return;
        setIdeaComments([
          { id: Date.now(), author: USER_PROFILE.name, role: USER_PROFILE.role, text: newComment, timestamp: 'Just now', avatar: '👤' },
          ...ideaComments
        ]);
        setNewComment('');
      };

      return (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowIdeaDrawer(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[600px] bg-gray-900 border-l border-gray-700 overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">Idea Details</h2>
              <button onClick={() => setShowIdeaDrawer(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
          
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${selectedIdea.track === 'design-center' ? 'bg-purple-900/30 text-purple-300' : 'bg-blue-900/30 text-blue-300'}`}>
                      {selectedIdea.track === 'design-center' ? 'Design Center' : 'Innovation Launchpad'}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedIdea.title}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-400">
                      <img src={getHeadshot(selectedIdea.submitter_name)} alt={selectedIdea.submitter_name} className="w-8 h-8 rounded-full object-cover border-2 border-gray-600" />
                      <span className="font-medium text-gray-200">{selectedIdea.submitter_name}</span>
                      <span>-</span>
                      <span>{selectedIdea.hospital}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${selectedIdea.status === 'approved' ? 'bg-green-900/30 text-green-300' : selectedIdea.status === 'in-progress' ? 'bg-blue-900/30 text-blue-300' : 'bg-yellow-900/30 text-yellow-300'}`}>{selectedIdea.status}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-6">
                  {showMonetary ? (
                    <>
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-1" />
                                              <div className="text-lg font-bold text-white">${((selectedIdea.value || selectedIdea.estimated_value || 0) / 1000000).toFixed(1)}M</div>
                                              <div className="text-xs text-gray-400">Value</div>
                                            </div>
                                            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                                              <Target className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                                              <div className="text-lg font-bold text-white">{selectedIdea.roi || selectedIdea.estimated_roi || 'N/A'}:1</div>
                        <div className="text-xs text-gray-400">ROI</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <ThumbsUp className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{selectedIdea.upvotes}</div>
                        <div className="text-xs text-gray-400">Upvotes</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <MessageSquare className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                                                <div className="text-lg font-bold text-white">{selectedIdea.comments_count || Math.floor(selectedIdea.upvotes / 3)}</div>
                                                <div className="text-xs text-gray-400">Comments</div>
                      </div>
                    </>
                  )}
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <Clock className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">16 wks</div>
                    <div className="text-xs text-gray-400">Timeline</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">{selectedIdea.feasibility_score}/10</div>
                    <div className="text-xs text-gray-400">Feasibility</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center"><Flag className="w-4 h-4 mr-2" />Problem Statement</h4>
                  <p className="text-gray-300 bg-gray-800/30 rounded-lg p-4">{selectedIdea.problem_statement}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center"><Lightbulb className="w-4 h-4 mr-2" />Proposed Solution</h4>
                  <p className="text-gray-300 bg-gray-800/30 rounded-lg p-4">{selectedIdea.proposed_solution}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center"><TrendingUp className="w-4 h-4 mr-2" />Expected Benefit</h4>
                  <p className="text-gray-300 bg-gray-800/30 rounded-lg p-4">{selectedIdea.expected_benefit}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-5 border border-blue-700/50">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-400" />
                  Deliverable Artifacts
                  <span className="ml-2 text-xs text-gray-400">(7 documents)</span>
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { id: 'charter', name: 'Charter', icon: '📋', color: 'blue' },
                    { id: 'pov', name: 'POV', icon: '🎯', color: 'purple' },
                    { id: 'concepts', name: 'Strategic Concepts', icon: '💡', color: 'yellow' },
                    { id: 'business-case', name: 'Business Case', icon: '💰', color: 'green' },
                    { id: 'architecture', name: 'Architecture', icon: '🏗️', color: 'orange' },
                    { id: 'service-plan', name: 'Service Plan', icon: '📊', color: 'pink' },
                    { id: 'brd', name: 'BRD', icon: '📝', color: 'teal' }
                  ].map(artifact => (
                    <button
                      key={artifact.id}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-2 ${
                        artifact.id === 'charter' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <span>{artifact.icon}</span>
                      <span>{artifact.name}</span>
                    </button>
                  ))}
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-white">Project Charter</h5>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-green-900/50 text-green-300 text-xs rounded">AI Generated</span>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">Download PDF</button>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-gray-400 text-xs uppercase mb-1">Project Name</div>
                      <div className="text-white">{selectedIdea.title}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs uppercase mb-1">Executive Sponsor</div>
                      <div className="text-white">Dr. Sarah Mitchell, Chief Innovation Officer</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs uppercase mb-1">Project Lead</div>
                      <div className="text-white">{selectedIdea.submitter_name}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs uppercase mb-1">Strategic Alignment</div>
                      <div className="text-white">{selectedIdea.category || 'Consumer Network'}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs uppercase mb-1">Success Metrics</div>
                      <div className="text-white">ROI: {selectedIdea.roi || selectedIdea.estimated_roi || 'N/A'}:1 | Value: ${((selectedIdea.value || selectedIdea.estimated_value || 0) / 1000000).toFixed(1)}M | Timeline: {selectedIdea.timeline_weeks || 16} weeks</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs uppercase mb-1">Key Stakeholders</div>
                      <div className="text-white">IT, Clinical Operations, Finance, Compliance</div>
                    </div>
                  </div>
                </div>
              </div>

                            <div className="flex items-center space-x-4 py-4 border-t border-b border-gray-700">
                              <button onClick={handleUpvote} disabled={hasUpvoted} className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition ${hasUpvoted ? 'bg-green-900/30 text-green-300' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
                                <ThumbsUp className="w-5 h-5" />
                                <span>{hasUpvoted ? 'Upvoted!' : 'Upvote'}</span>
                                <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{selectedIdea.upvotes + (hasUpvoted ? 1 : 0)}</span>
                              </button>
                              <button onClick={() => runFullAnalysis(selectedIdea.id)} disabled={fullAnalysisLoading} className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white rounded-lg font-semibold transition disabled:opacity-50">
                                <Sparkles className="w-5 h-5" />
                                <span>{fullAnalysisLoading ? 'Analyzing...' : 'Run Full AI Analysis'}</span>
                              </button>
                              <button onClick={() => { setSelectedIdea(selectedIdea); setShowIdeaDrawer(false); setCurrentView('agents'); }} className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition">
                                <Brain className="w-5 h-5" />
                                <span>Individual Agents</span>
                              </button>
                            </div>

                            {fullAnalysisResult && (
                              <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-xl p-5 border border-green-700/50">
                                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                                  <Sparkles className="w-5 h-5 mr-2 text-green-400" />
                                  Full AI Analysis Results
                                  <span className="ml-2 text-xs text-gray-400">({Object.keys(fullAnalysisResult.agents_results || {}).length} agents)</span>
                                  {fullAnalysisResult.codex_powered && <span className="ml-2 px-2 py-0.5 bg-green-900/50 text-green-300 text-xs rounded">GPT-5.1 Codex</span>}
                                </h4>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div className="bg-gray-800/50 rounded-lg p-3">
                                    <div className="text-sm text-gray-400 mb-1">Feasibility Score</div>
                                    <div className="text-2xl font-bold text-green-400">{fullAnalysisResult.overall_recommendation?.feasibility_score?.toFixed(1) || fullAnalysisResult.agents_results?.feasibility?.overall_score?.toFixed(1) || 'N/A'}/10</div>
                                  </div>
                                  <div className="bg-gray-800/50 rounded-lg p-3">
                                    <div className="text-sm text-gray-400 mb-1">Strategic Fit</div>
                                    <div className="text-2xl font-bold text-purple-400">{fullAnalysisResult.overall_recommendation?.strategic_quadrant || fullAnalysisResult.agents_results?.strategic_fit?.quadrant || 'N/A'}</div>
                                  </div>
                                  <div className="bg-gray-800/50 rounded-lg p-3">
                                    <div className="text-sm text-gray-400 mb-1">Similar Solutions</div>
                                    <div className="text-2xl font-bold text-blue-400">{fullAnalysisResult.agents_results?.similarity_matcher?.total_matches || 0}</div>
                                  </div>
                                  <div className="bg-gray-800/50 rounded-lg p-3">
                                    <div className="text-sm text-gray-400 mb-1">Recommended Team</div>
                                    <div className="text-lg font-bold text-yellow-400">{fullAnalysisResult.agents_results?.resource_optimizer?.recommended_team?.length || 'N/A'} people</div>
                                  </div>
                                </div>
                                <div className="text-sm text-gray-300">
                                  <strong>AI Recommendation:</strong> {fullAnalysisResult.overall_recommendation?.decision} - {fullAnalysisResult.overall_recommendation?.reasoning || 'Analysis complete. Review individual agent results for details.'}
                                </div>
                                <div className="mt-3 text-xs text-gray-500">
                                  Models used: {fullAnalysisResult.models_used?.join(', ') || 'Multiple AI models'}
                                </div>
                                {fullAnalysisResult.sora_eligible && (
                                  <div className="mt-3 p-3 bg-purple-900/30 rounded-lg border border-purple-700/50">
                                    <div className="text-sm text-purple-300 font-semibold">Sora Video Eligible</div>
                                    <div className="text-xs text-gray-400 mt-1">{fullAnalysisResult.sora_prompt_suggestion?.substring(0, 100)}...</div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-5 border border-purple-700/50">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-white flex items-center">
                                  <Target className="w-5 h-5 mr-2 text-purple-400" />
                                  Strategic Fit Rubric
                                </h4>
                                <button 
                                  onClick={() => selectedIdea && fetchAIRubric(selectedIdea.id)}
                                  disabled={rubricLoading}
                                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold flex items-center space-x-1"
                                >
                                  <Sparkles className="w-4 h-4" />
                                  <span>{rubricLoading ? 'Analyzing...' : 'AI Recommend'}</span>
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-1 gap-3 mb-4">
                                <div className="text-xs text-purple-300 font-semibold mb-1">VALUE DIMENSIONS</div>
                                {[
                                  { key: 'emotional_needs', label: 'Emotional Needs', desc: 'Patient/staff experience impact' },
                                  { key: 'revenue_impact', label: 'Revenue Impact', desc: '$250K to $10M+ potential' }
                                ].map(dim => (
                                  <div key={dim.key} className="bg-gray-800/50 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-2">
                                      <div>
                                        <span className="text-sm font-medium text-white">{dim.label}</span>
                                        <span className="text-xs text-gray-500 ml-2">{dim.desc}</span>
                                      </div>
                                      <span className="text-lg font-bold text-purple-400">{rubricScores[dim.key]}/10</span>
                                    </div>
                                    <input 
                                      type="range" 
                                      min="1" 
                                      max="10" 
                                      value={rubricScores[dim.key]} 
                                      onChange={(e) => setRubricScores({...rubricScores, [dim.key]: parseInt(e.target.value)})}
                                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                    />
                                  </div>
                                ))}
                                
                                <div className="text-xs text-orange-300 font-semibold mb-1 mt-2">EFFORT DIMENSIONS</div>
                                {[
                                  { key: 'drastic_change', label: 'Drastic Change', desc: 'Organizational change needed' },
                                  { key: 'pilot_complexity', label: 'Pilot Complexity', desc: 'Implementation difficulty' },
                                  { key: 'people_build', label: 'People/Build', desc: 'Team & skill requirements' },
                                  { key: 'technology_capex', label: 'Technology/CAPEX', desc: 'Investment required' }
                                ].map(dim => (
                                  <div key={dim.key} className="bg-gray-800/50 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-2">
                                      <div>
                                        <span className="text-sm font-medium text-white">{dim.label}</span>
                                        <span className="text-xs text-gray-500 ml-2">{dim.desc}</span>
                                      </div>
                                      <span className="text-lg font-bold text-orange-400">{rubricScores[dim.key]}/10</span>
                                    </div>
                                    <input 
                                      type="range" 
                                      min="1" 
                                      max="10" 
                                      value={rubricScores[dim.key]} 
                                      onChange={(e) => setRubricScores({...rubricScores, [dim.key]: parseInt(e.target.value)})}
                                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                    />
                                  </div>
                                ))}
                              </div>
                              
                              <div className="bg-gray-800/70 rounded-lg p-4 mt-4">
                                <div className="text-sm font-semibold text-white mb-3">2x2 Strategic Fit Preview</div>
                                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                                  <div className={`p-3 rounded-lg ${calculateRubricQuadrant().quadrant === 'Quick Wins' ? 'bg-green-600/50 border-2 border-green-400' : 'bg-gray-700/50'}`}>
                                    <div className="font-semibold text-green-300">Quick Wins</div>
                                    <div className="text-gray-400">High Value, Low Effort</div>
                                  </div>
                                  <div className={`p-3 rounded-lg ${calculateRubricQuadrant().quadrant === 'Big Bets' ? 'bg-blue-600/50 border-2 border-blue-400' : 'bg-gray-700/50'}`}>
                                    <div className="font-semibold text-blue-300">Big Bets</div>
                                    <div className="text-gray-400">High Value, High Effort</div>
                                  </div>
                                  <div className={`p-3 rounded-lg ${calculateRubricQuadrant().quadrant === 'Low Priority' ? 'bg-gray-600/50 border-2 border-gray-400' : 'bg-gray-700/50'}`}>
                                    <div className="font-semibold text-gray-300">Low Priority</div>
                                    <div className="text-gray-400">Low Value, Low Effort</div>
                                  </div>
                                  <div className={`p-3 rounded-lg ${calculateRubricQuadrant().quadrant === 'Parking Lot' ? 'bg-red-600/50 border-2 border-red-400' : 'bg-gray-700/50'}`}>
                                    <div className="font-semibold text-red-300">Parking Lot</div>
                                    <div className="text-gray-400">Low Value, High Effort</div>
                                  </div>
                                </div>
                                <div className="flex justify-between mt-3 text-sm">
                                  <div><span className="text-gray-400">Value Score:</span> <span className="text-purple-400 font-bold">{calculateRubricQuadrant().valueScore}</span></div>
                                  <div><span className="text-gray-400">Effort Score:</span> <span className="text-orange-400 font-bold">{calculateRubricQuadrant().effortScore}</span></div>
                                  <div><span className="text-gray-400">Quadrant:</span> <span className="text-white font-bold">{calculateRubricQuadrant().quadrant}</span></div>
                                </div>
                              </div>
                              
                              {rubricResult?.codex_powered && (
                                <div className="mt-3 text-xs text-gray-500 flex items-center">
                                  <span className="px-2 py-0.5 bg-green-900/50 text-green-300 rounded mr-2">GPT-5.1 Codex</span>
                                  AI-recommended scores based on idea analysis
                                </div>
                              )}
                            </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center"><MessageSquare className="w-5 h-5 mr-2" />Discussion & Crowdsourcing ({ideaComments.length})</h4>
              
                <div className="mb-4">
                  <div className="flex space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">GK</div>
                    <div className="flex-1">
                      <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your thoughts, expertise, or offer to help..." className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 resize-none" rows={3} />
                      <div className="flex justify-end mt-2">
                        <button onClick={handleAddComment} disabled={!newComment.trim()} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-semibold text-sm">Post Comment</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {ideaComments.map(comment => (
                    <div key={comment.id} className="flex space-x-3 bg-gray-800/30 rounded-lg p-4">
                      <img src={getHeadshot(comment.author)} alt={comment.author} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-white">{comment.author}</span>
                          <span className="text-xs text-gray-500">{comment.role}</span>
                          <span className="text-xs text-gray-500">- {comment.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{comment.text}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <button className="hover:text-blue-400 flex items-center space-x-1"><ThumbsUp className="w-3 h-3" /><span>Like</span></button>
                          <button className="hover:text-blue-400">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const SubmitIdeaModal = () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSubmitModal(false)} />
        <div className="relative bg-gray-900 rounded-xl p-8 border border-gray-700 max-w-2xl w-full">
          <button onClick={() => setShowSubmitModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
          <h2 className="text-2xl font-bold text-white mb-6">Submit New Idea</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-2">Idea Title</label><input type="text" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" placeholder="What's your innovation?" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">Problem Statement</label><textarea className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" rows={3} placeholder="What problem are you solving?" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">Proposed Solution</label><textarea className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" rows={3} placeholder="How will you solve it?" /></div>
            <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold">Submit for AI Analysis</button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'pipeline' && <PipelineView />}
          {currentView === 'fragments' && <FragmentsView />}
          {currentView === 'ideas' && <IdeasView />}
          {currentView === 'agents' && <AgentsView />}
          {currentView === 'challenges' && <ChallengesView />}
                    {currentView === 'value-tracker' && <ValueTrackerView />}
                                        {currentView === 'events' && <EventsView />}
                                                                                {currentView === 'bulk-import' && <BulkImportView />}
                                                                                {currentView === 'timeline' && <PortfolioTimelineView />}
                                                                                {currentView === 'analytics' && <AnalyticsView />}
                    {currentView === 'leaderboard' && <LeaderboardView />}
                    {currentView === 'rewards' && <RewardsView />}
                    {currentView === 'resources' && <div className="p-6"><h1 className="text-2xl font-bold text-white mb-4">Resources & Guides</h1><p className="text-gray-400">Innovation playbooks and toolkits coming soon...</p></div>}
          {currentView === 'settings' && <div className="p-6"><h1 className="text-2xl font-bold text-white mb-4">Settings</h1><p className="text-gray-400">Account settings coming soon...</p></div>}
        </div>
      </div>
      {showSubmitModal && <SubmitIdeaModal />}
      {showIdeaDrawer && <IdeaDetailDrawer />}
      {showFragmentDrawer && <FragmentDetailDrawer />}
      {showFragmentModal && <SubmitFragmentModal />}
    </div>
  );
};

export default App;
