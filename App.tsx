
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  MessageSquare, 
  Activity,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  Sparkles,
  Zap,
  Lock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  BankAccount, 
  Transaction, 
  GeminiCurrencyEnum, 
  AIChatMessage, 
  BankingInsight,
  InvestmentOpportunity,
  NeuromorphicStatus,
  QuantumStatus 
} from './types';
import { 
  getAIInsights, 
  scanInvestmentOpportunities, 
  chatWithAssistant 
} from './services/geminiService';

// --- Mock Data ---
const MOCK_ACCOUNTS: BankAccount[] = [
  { id: '1', accountNumber: '**** 8842', balance: 12450.65, currency: GeminiCurrencyEnum.Usd, accountType: 'Personal Checking', accountHolderName: 'James B. O\'Callaghan III', openedDate: '2022-04-12' },
  { id: '2', accountNumber: '**** 3321', balance: 85200.00, currency: GeminiCurrencyEnum.Usd, accountType: 'High-Yield Savings', accountHolderName: 'James B. O\'Callaghan III', openedDate: '2023-01-05' },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', amount: 150.00, currency: GeminiCurrencyEnum.Usd, description: 'Neuralink Subscription', transactionDate: '2024-05-18', transactionType: 'DEBIT', status: 'COMPLETED' },
  { id: 't2', amount: 3400.00, currency: GeminiCurrencyEnum.Usd, description: 'Monthly Dividends', transactionDate: '2024-05-17', transactionType: 'CREDIT', status: 'COMPLETED' },
  { id: 't3', amount: 12.50, currency: GeminiCurrencyEnum.Usd, description: 'Starbucks Cyber Cafe', transactionDate: '2024-05-16', transactionType: 'DEBIT', status: 'COMPLETED' },
];

const MOCK_CHART_DATA = [
  { name: 'Mon', balance: 95000 },
  { name: 'Tue', balance: 95200 },
  { name: 'Wed', balance: 94800 },
  { name: 'Thu', balance: 96000 },
  { name: 'Fri', balance: 97500 },
  { name: 'Sat', balance: 97300 },
  { name: 'Sun', balance: 97650 },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'invest' | 'security'>('dashboard');
  const [insights, setInsights] = useState<BankingInsight[]>([]);
  const [investments, setInvestments] = useState<InvestmentOpportunity[]>([]);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([
    { id: '0', sender: 'AI', content: 'Good morning, Mr. O\'Callaghan. Your neuromorphic nodes are synchronized. How can I assist you today?', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [neuroStatus] = useState<NeuromorphicStatus>({
    processorId: 'NP-77x-GEMINI',
    status: 'ONLINE',
    loadPercentage: 14.5,
    activeModels: 12
  });

  const [quantumStatus] = useState<QuantumStatus>({
    status: 'ENABLED',
    complianceRating: 'A+'
  });

  useEffect(() => {
    const loadAIContent = async () => {
      setIsAiLoading(true);
      const [aiInsights, aiInvest] = await Promise.all([
        getAIInsights(MOCK_TRANSACTIONS),
        scanInvestmentOpportunities()
      ]);
      setInsights(aiInsights);
      setInvestments(aiInvest);
      setIsAiLoading(false);
    };
    loadAIContent();
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: AIChatMessage = {
      id: Date.now().toString(),
      sender: 'USER',
      content: inputText,
      timestamp: new Date().toLocaleTimeString()
    };
    setChatMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsAiLoading(true);

    try {
      const history = chatMessages.map(m => ({
        role: m.sender === 'USER' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));
      
      const stream = await chatWithAssistant(history, inputText);
      
      let fullResponse = '';
      const aiId = (Date.now() + 1).toString();
      
      setChatMessages(prev => [...prev, { id: aiId, sender: 'AI', content: '', timestamp: new Date().toLocaleTimeString() }]);

      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setChatMessages(prev => 
          prev.map(m => m.id === aiId ? { ...m, content: fullResponse } : m)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden text-slate-200">
      {/* Sidebar */}
      <nav className="w-64 glass border-r border-slate-800 flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center neon-blue">
            <Sparkles className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            GEMINI BANK
          </h1>
        </div>

        <div className="flex-1 space-y-2">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem active={activeTab === 'accounts'} onClick={() => setActiveTab('accounts')} icon={<Wallet size={20} />} label="Accounts" />
          <NavItem active={activeTab === 'invest'} onClick={() => setActiveTab('invest')} icon={<TrendingUp size={20} />} label="Investments" />
          <NavItem active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<ShieldCheck size={20} />} label="Security" />
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition cursor-pointer">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold">JB</div>
            <div>
              <p className="text-sm font-medium">J. O'Callaghan</p>
              <p className="text-[10px] text-slate-500">Tier: Platinum Elite</p>
            </div>
            <LogOut size={16} className="ml-auto text-slate-500 hover:text-white" />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Top Header Stats */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <StatusBadge icon={<Cpu size={14} />} label="Neuro Processor" value={`${neuroStatus.loadPercentage}% Load`} color="emerald" />
            <StatusBadge icon={<Lock size={14} />} label="Quantum Encrypt" value={quantumStatus.status} color="sky" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 glass rounded-full hover:bg-slate-800 transition relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-sky-500 rounded-full"></span>
            </button>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search actions..." 
                className="bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 w-64 transition-all focus:w-80"
              />
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Total Balance Hero */}
            <div className="col-span-12 lg:col-span-8 glass p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[100px] pointer-events-none"></div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400 font-medium">Net Worth Portfolio</p>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-3 py-1 rounded-full">
                  <TrendingUp size={14} />
                  +4.2% (7d)
                </div>
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-8 mono">$97,650.65 <span className="text-xl text-slate-500 font-normal">USD</span></h2>
              
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_CHART_DATA}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <YAxis hide />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px'}} />
                    <Area type="monotone" dataKey="balance" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Insights Panel */}
            <div className="col-span-12 lg:col-span-4 glass p-6 rounded-2xl flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <Zap size={20} className="text-amber-400" />
                <h3 className="font-bold text-lg">AI Banking Insights</h3>
              </div>
              <div className="space-y-4 flex-1">
                {isAiLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-20 bg-slate-800 rounded-xl"></div>
                    <div className="h-20 bg-slate-800 rounded-xl"></div>
                    <div className="h-20 bg-slate-800 rounded-xl"></div>
                  </div>
                ) : (
                  insights.map(insight => (
                    <div key={insight.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition cursor-default">
                      <p className="text-[10px] uppercase tracking-wider text-sky-400 font-bold mb-1">{insight.type}</p>
                      <h4 className="text-sm font-semibold mb-2">{insight.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{insight.description}</p>
                    </div>
                  ))
                )}
              </div>
              <button className="mt-6 w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20">
                Execute Recommended Strategy
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Accounts Preview */}
            <div className="col-span-12 lg:col-span-6 glass p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Your Accounts</h3>
                <button onClick={() => setActiveTab('accounts')} className="text-xs text-sky-400 hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {MOCK_ACCOUNTS.map(acc => (
                  <div key={acc.id} className="p-4 rounded-xl border border-slate-800 flex items-center justify-between group hover:bg-slate-800/20 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 glass rounded-lg flex items-center justify-center group-hover:bg-sky-500/10 transition">
                        <Wallet size={20} className="text-sky-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{acc.accountType}</p>
                        <p className="text-xs text-slate-500 mono">{acc.accountNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm mono">${acc.balance.toLocaleString()}</p>
                      <p className="text-[10px] text-emerald-400 uppercase font-bold">Verified</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions Preview */}
            <div className="col-span-12 lg:col-span-6 glass p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Neural Transaction Log</h3>
                <Activity size={20} className="text-slate-500" />
              </div>
              <div className="space-y-4">
                {MOCK_TRANSACTIONS.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${tx.transactionType === 'CREDIT' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                      <div>
                        <p className="text-sm font-medium">{tx.description}</p>
                        <p className="text-[10px] text-slate-500">{tx.transactionDate}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-bold mono ${tx.transactionType === 'CREDIT' ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {tx.transactionType === 'CREDIT' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invest' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Gemini Investment AI</h2>
              <p className="text-slate-400">Our deep-learning models have scanned the global financial layer to find your next opportunity.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isAiLoading ? (
                <div className="col-span-2 text-center py-20">
                  <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400 animate-pulse">Scanning high-frequency trading data...</p>
                </div>
              ) : (
                investments.map(inv => (
                  <div key={inv.id} className="glass p-8 rounded-3xl border-t-4 border-t-sky-500 hover:scale-[1.02] transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">{inv.name}</h3>
                      <div className="bg-slate-800 px-3 py-1 rounded-full text-[10px] font-bold text-sky-400 border border-sky-500/20 uppercase tracking-tighter">
                        AI Confidence: {(inv.confidenceScore * 100).toFixed(0)}%
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">{inv.description}</p>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-900/50 p-4 rounded-2xl">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Projected Return</p>
                        <p className="text-xl font-bold text-emerald-400 mono">+{inv.projectedReturn}%</p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-2xl">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Risk Profile</p>
                        <p className={`text-xl font-bold mono ${inv.riskLevel === 'LOW' ? 'text-sky-400' : inv.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'}`}>
                          {inv.riskLevel}
                        </p>
                      </div>
                    </div>
                    <button className="w-full py-4 bg-slate-800 hover:bg-sky-500 hover:text-white transition rounded-2xl font-bold border border-slate-700">
                      Initialize Position
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Floating Chat Widget */}
        <div className={`fixed bottom-8 right-8 z-50 flex flex-col items-end transition-all ${isChatOpen ? 'w-96' : 'w-auto'}`}>
          {isChatOpen && (
            <div className="w-full glass rounded-2xl border border-slate-700 shadow-2xl mb-4 overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 bg-sky-500 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Gemini AI Support</h4>
                    <p className="text-white/60 text-[10px]">Real-time Intelligent Assistance</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-white hover:bg-white/10 rounded-full p-1 transition">
                  <ChevronRight size={20} className="rotate-90" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900/80">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'USER' 
                        ? 'bg-sky-500 text-white rounded-tr-none' 
                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                    }`}>
                      {msg.content || (isAiLoading && <div className="flex gap-1 py-1"><div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></div><div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></div></div>)}
                    </div>
                    <span className="text-[9px] text-slate-600 mt-1">{msg.timestamp}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-800 flex gap-2">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask Gemini anything..."
                  className="flex-1 bg-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none ring-1 ring-slate-700 focus:ring-sky-500 transition-all"
                />
                <button 
                  onClick={handleSendMessage}
                  className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-xl transition shadow-lg shadow-sky-500/30"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
          
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-16 h-16 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center shadow-xl shadow-sky-500/30 transition-transform active:scale-90 group"
          >
            {isChatOpen ? <ChevronRight size={24} className="rotate-90 text-white" /> : <MessageSquare size={24} className="text-white group-hover:scale-110 transition-transform" />}
          </button>
        </div>
      </main>
    </div>
  );
};

// --- Helper Components ---

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
      active 
        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-sky-400'} transition-colors`}>{icon}</span>
    <span className="font-medium text-sm">{label}</span>
    {active && <ChevronRight size={14} className="ml-auto" />}
  </button>
);

const StatusBadge: React.FC<{ icon: React.ReactNode, label: string, value: string, color: 'emerald' | 'sky' | 'amber' }> = ({ icon, label, value, color }) => {
  const colorClasses = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${colorClasses[color]} glass-blur`}>
      <span className="opacity-70">{icon}</span>
      <div className="flex flex-col">
        <span className="text-[8px] uppercase font-bold tracking-widest opacity-60 leading-none">{label}</span>
        <span className="text-xs font-bold leading-tight">{value}</span>
      </div>
    </div>
  );
};

export default App;
