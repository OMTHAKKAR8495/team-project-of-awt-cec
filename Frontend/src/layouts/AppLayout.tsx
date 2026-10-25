import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Globe,
  Sun,
  Moon,
  ArrowRight,
  ArrowRightLeft,
  Menu,
  X,
  Building2,
  Sparkles,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { fetchHealthStatus, HealthCheckResponse, getJobs } from '../services/api';
import { Job } from '../types/job';

interface NavItem {
  to: string;
  label: string;
  badge?: string;
  badgeColor?: string;
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('US');

  const location = useLocation();
  const navigate = useNavigate();

  // Detect whether current route is in the Recruiter space
  const isRecruiterPath = location.pathname.startsWith('/recruiter');

  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const data = await fetchHealthStatus();
        if (isMounted) {
          setHealthStatus(data);
          setIsHealthLoading(false);
        }
      } catch {
        if (isMounted) {
          setHealthStatus(null);
          setIsHealthLoading(false);
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Quick search handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await getJobs({ search: searchQuery.trim(), limit: 5 });
        setSearchResults(res.data);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Candidate Navigation items matching Reference Screenshot 1
  const navItems: NavItem[] = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/divisions', label: 'Divisions' },
    { to: '/careers', label: 'Careers', badge: 'HIRING', badgeColor: 'bg-amber-400 text-slate-950 font-bold' },
    { to: '/analyze-resume', label: 'Resume Analyzer', badge: 'AI', badgeColor: 'bg-cyan-400/90 text-slate-950 font-bold' },
    { to: '/job-matches', label: 'Job Matches' },
    { to: '/interview-studio', label: 'Interview Studio' },
    { to: '/database', label: 'Database' },
    { to: '/contact', label: 'Contact' },
  ];

  // Recruiter specific links
  const recruiterLinks: NavItem[] = [
    { to: '/recruiter/dashboard', label: 'Dashboard' },
    { to: '/recruiter/jobs', label: 'Manage Jobs' },
    { to: '/recruiter/candidates', label: 'Candidate Pool' },
    { to: '/recruiter/jobs/new', label: 'Post Opportunity' },
    { to: '/jobs', label: 'Talent View' },
  ];

  const handleToggleMode = () => {
    if (isRecruiterPath) {
      navigate('/jobs');
    } else {
      navigate('/recruiter/dashboard');
    }
    setMobileMenuOpen(false);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <div className={`min-h-screen bg-[#070913] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white ${isDarkMode ? 'dark' : ''}`}>
      {/* 1. TOP ANNOUNCEMENT BAR (From Screenshot 1) */}
      <div className="bg-[#0b0f24] border-b border-indigo-900/30 text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0">
              NEXUS AI 2026
            </span>
            <span className="text-slate-300 text-xs tracking-tight truncate">
              Unified Portal with AI Resume Analyzer, ATS Evaluation &amp; Job Matching.
            </span>
          </div>

          <Link
            to="/analyze-resume"
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold text-xs shrink-0 transition-colors"
          >
            <span>Launch Resume Analyzer</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Recruiter Active Notification banner if on recruiter routes */}
      {isRecruiterPath && (
        <div className="bg-purple-950/40 border-b border-purple-800/40 px-4 py-1.5 text-center text-xs text-purple-200 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
          <span className="font-medium">
            Recruiter Enterprise Mode Active &mdash; Administrative Candidate Review &amp; Job Pipeline
          </span>
        </div>
      )}

      {/* 2. MAIN NAVBAR (From Screenshot 1) */}
      <header className="sticky top-0 z-40 bg-[#070913]/90 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                    NEXUS
                  </span>
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-cyan-400">
                    DYNAMICS
                  </span>
                </div>
                <span className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold block -mt-1">
                  Global Enterprise Group
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {(isRecruiterPath ? recruiterLinks : navItems).map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `relative px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-indigo-600/30 text-white border border-indigo-500/50 shadow-sm shadow-indigo-500/20 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase leading-tight ${item.badgeColor || 'bg-cyan-400 text-slate-950'}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right Action Icons & Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Search Icon */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                title="Search Positions & Intelligence"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Region Selector */}
              <button
                type="button"
                onClick={() => setRegionModalOpen(!regionModalOpen)}
                className="hidden sm:flex items-center gap-1 px-2.5 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer"
                title="Global Region Selector"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{selectedRegion}</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                title="Toggle Visual Theme"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              </button>

              {/* Analyze CV CTA Button (from Screenshot 1) */}
              <Link
                to="/analyze-resume"
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-md shadow-indigo-600/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>Analyze CV</span>
              </Link>

              {/* Mode Switcher */}
              <button
                type="button"
                onClick={handleToggleMode}
                className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/60 hover:text-white transition-colors cursor-pointer"
                title="Switch between Candidate and Recruiter portal"
              >
                <ArrowRightLeft className="w-3 h-3" />
                <span>{isRecruiterPath ? 'Talent Portal' : 'Recruiter Mode'}</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden w-8 h-8 rounded-lg bg-white/5 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#0a0d1e] border-b border-indigo-900/40 px-4 py-4 space-y-2 shadow-2xl">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pb-1 border-b border-white/5">
              {isRecruiterPath ? 'Recruiter Navigation' : 'Enterprise Navigation'}
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-2">
              {(isRecruiterPath ? recruiterLinks : navItems).map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600/30 text-white font-bold border border-indigo-500/40'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase ${item.badgeColor || 'bg-cyan-400 text-slate-950'}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
              <Link
                to="/analyze-resume"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch AI Resume Analyzer</span>
              </Link>
              <button
                type="button"
                onClick={handleToggleMode}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-medium"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Switch to {isRecruiterPath ? 'Candidate Portal' : 'Recruiter Mode'}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Region Selector Modal */}
      {regionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#0f142e] border border-indigo-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Select Enterprise Region</span>
              </div>
              <button
                type="button"
                onClick={() => setRegionModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Nexus Dynamics maintains 65+ strategic operations hubs across North America, EMEA, and APAC.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { code: 'US', label: 'North America (HQ: New York)' },
                { code: 'UK', label: 'EMEA (HQ: London)' },
                { code: 'SG', label: 'APAC (HQ: Singapore)' },
                { code: 'CH', label: 'Zurich (R&D Center)' },
                { code: 'IN', label: 'Bengaluru (Innovation Hub)' },
                { code: 'JP', label: 'Tokyo (Innovation Hub)' },
              ].map(r => (
                <button
                  key={r.code}
                  type="button"
                  onClick={() => {
                    setSelectedRegion(r.code);
                    setRegionModalOpen(false);
                  }}
                  className={`text-left p-3 rounded-xl border text-xs transition-all ${
                    selectedRegion === r.code
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 font-semibold'
                      : 'border-white/10 hover:border-white/20 bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="font-bold">{r.code}</div>
                  <div className="text-[11px] text-slate-400">{r.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0c1026] border border-indigo-500/30 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <Search className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search open positions, enterprise divisions, skills (e.g. React, AI, Python)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto space-y-2">
              {isSearching ? (
                <div className="py-8 text-center text-xs text-slate-400">Searching global enterprise directory...</div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    Matched Opportunities ({searchResults.length})
                  </div>
                  {searchResults.map(job => (
                    <Link
                      key={job._id}
                      to={`/jobs/${job._id}`}
                      onClick={() => setSearchModalOpen(false)}
                      className="block p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-sm">{job.title}</span>
                        <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-full">
                          {job.employmentType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{job.company} &bull; {job.location}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.requiredSkills.slice(0, 4).map(skill => (
                          <span key={skill} className="text-[10px] bg-indigo-950/80 text-indigo-300 px-2 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No matching enterprise positions found for &quot;{searchQuery}&quot;.
                </div>
              ) : (
                <div className="py-4 space-y-3">
                  <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    Quick Navigation
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Link
                      to="/careers"
                      onClick={() => setSearchModalOpen(false)}
                      className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-between"
                    >
                      <span>Explore Open Careers</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    </Link>
                    <Link
                      to="/analyze-resume"
                      onClick={() => setSearchModalOpen(false)}
                      className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-between"
                    >
                      <span>AI Resume Analyzer</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    </Link>
                    <Link
                      to="/divisions"
                      onClick={() => setSearchModalOpen(false)}
                      className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-between"
                    >
                      <span>Enterprise Divisions</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    </Link>
                    <Link
                      to="/interview-studio"
                      onClick={() => setSearchModalOpen(false)}
                      className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-between"
                    >
                      <span>Interview Studio</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Page Area */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* 3. FOOTER & NEWSLETTER (From Screenshot 3) */}
      <footer className="border-t border-indigo-950/60 bg-[#050711] text-slate-300 pt-16 pb-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Executive Insights Newsletter Container (Screenshot 3) */}
          <div className="nexus-glass-card rounded-3xl p-6 sm:p-10 border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-[#0d1233] to-slate-900/60 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" />
                <span>NEXUS GLOBAL EXECUTIVE INSIGHTS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Stay Ahead of Industry Transformation
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Subscribe to quarterly reports on enterprise AI, clean tech infrastructure, and global career opportunities.
              </p>
            </div>

            <form
              onSubmit={handleNewsletterSubmit}
              className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3 max-w-md shrink-0"
            >
              {newsletterSubmitted ? (
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/50 border border-emerald-500/40 px-4 py-2.5 rounded-xl text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Subscribed! Check your enterprise inbox.</span>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    required
                    placeholder="Enter your enterprise email"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    className="w-full sm:w-72 bg-[#090d22] border border-indigo-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Subscribe Now
                  </button>
                </>
              )}
            </form>
          </div>

          {/* 4 Footer Columns (From Screenshot 3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1: Brand & Overview */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1 font-extrabold text-base tracking-tight text-white">
                  <span>NEXUS</span>
                  <span className="text-cyan-400">DYNAMICS</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nexus Dynamics Group is a global enterprise leader delivering next-generation Artificial Intelligence, Clean Energy Grids, Bio-Tech Infrastructure, and Strategic Financial Consulting.
              </p>
              {/* Health Indicator pill in footer */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-400">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isHealthLoading
                      ? 'bg-amber-400 animate-pulse'
                      : healthStatus?.database.ready
                      ? 'bg-emerald-400'
                      : 'bg-rose-400'
                  }`}
                />
                <span>
                  {isHealthLoading
                    ? 'Connecting...'
                    : healthStatus?.database.ready
                    ? 'Core API & Database Synchronized'
                    : 'System Offline'}
                </span>
              </div>
            </div>

            {/* Column 2: Business Divisions */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                BUSINESS DIVISIONS
              </h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <Link to="/divisions" className="hover:text-cyan-400 transition-colors">
                    Artificial Intelligence &amp; Cloud
                  </Link>
                </li>
                <li>
                  <Link to="/divisions" className="hover:text-cyan-400 transition-colors">
                    Renewable Grid Energy
                  </Link>
                </li>
                <li>
                  <Link to="/divisions" className="hover:text-cyan-400 transition-colors">
                    Bio-Genomics &amp; Health
                  </Link>
                </li>
                <li>
                  <Link to="/divisions" className="hover:text-cyan-400 transition-colors">
                    Financial Advisory &amp; M&amp;A
                  </Link>
                </li>
                <li>
                  <Link to="/divisions" className="hover:text-cyan-400 transition-colors">
                    Global Supply Chain Solutions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Careers */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                CAREERS (HIRING ALL FIELDS)
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link to="/careers" className="flex items-center justify-between hover:text-cyan-400 transition-colors">
                    <span>Software &amp; AI Roles</span>
                    <span className="text-[10px] bg-purple-900/60 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-700/50">
                      42 Open
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="flex items-center justify-between hover:text-cyan-400 transition-colors">
                    <span>Engineering &amp; Hardware</span>
                    <span className="text-[10px] bg-emerald-900/60 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-700/50">
                      28 Open
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-cyan-400 transition-colors">
                    Finance &amp; Legal Careers
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-cyan-400 transition-colors">
                    Marketing, HR &amp; PR
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-cyan-400 transition-colors">
                    Life at Nexus &amp; Perks
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Global Headquarters */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                GLOBAL HEADQUARTERS
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>One Nexus Plaza, Manhattan, New York, NY 10001</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>+1 (212) 555-0190</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>contact@nexusdynamics.global</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              &copy; 2026 Nexus Dynamics Group Inc. All rights reserved. Operating across 65+ countries.
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-400 text-xs">
              <Link to="/about" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/about" className="hover:text-white transition-colors">
                Terms of Governance
              </Link>
              <Link to="/about" className="hover:text-white transition-colors">
                Security &amp; Trust
              </Link>
              <Link to="/about" className="hover:text-white transition-colors">
                ESG Compliance
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
