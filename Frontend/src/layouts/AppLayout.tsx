import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  FileSearch,
  ClipboardList,
  LayoutDashboard,
  Users,
  PlusCircle,
  Menu,
  X,
  ArrowRightLeft,
} from 'lucide-react';
import { fetchHealthStatus, HealthCheckResponse } from '../services/api';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState(true);
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

  // Navigation Links Definition
  const candidateLinks = [
    { to: '/jobs', label: 'Explore Jobs', icon: Briefcase },
    { to: '/analyze-resume', label: 'Resume Analyzer (ATS)', icon: FileSearch },
    { to: '/applications', label: 'My Applications', icon: ClipboardList },
  ];

  const recruiterLinks = [
    { to: '/recruiter/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/recruiter/jobs', label: 'Manage Jobs', icon: Briefcase },
    { to: '/recruiter/candidates', label: 'All Candidates', icon: Users },
    { to: '/recruiter/jobs/new', label: 'Post Job', icon: PlusCircle },
  ];

  const activeLinks = isRecruiterPath ? recruiterLinks : candidateLinks;

  const handleToggleMode = () => {
    if (isRecruiterPath) {
      navigate('/jobs');
    } else {
      navigate('/recruiter/dashboard');
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Dev / Academic Security Banner for Recruiter Module */}
      {isRecruiterPath && (
        <div className="bg-amber-500/10 border-b border-amber-200/80 px-4 py-1.5 text-center text-xs text-amber-800 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="font-medium">
            Recruiter Mode Active (Development) — Unauthenticated endpoints for academic evaluation.
          </span>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-6">
              <NavLink to="/jobs" className="flex items-center gap-2.5 text-slate-900 group">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base tracking-tight text-slate-900">
                      AWT CEC
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                        isRecruiterPath
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {isRecruiterPath ? 'Recruiter' : 'Talent'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block -mt-0.5">
                    Recruitment & ATS Platform
                  </span>
                </div>
              </NavLink>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-1">
                {activeLinks.map(link => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === '/jobs' || link.to === '/recruiter/dashboard'}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-slate-100 text-indigo-700'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Right Header Area: Status & Role Switcher */}
            <div className="flex items-center gap-3">
              {/* Backend Live Indicator */}
              <div
                className="hidden lg:flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600"
                title={
                  healthStatus
                    ? `Backend ${healthStatus.service} running | DB: ${healthStatus.database.status}`
                    : 'Backend unreachable or starting'
                }
              >
                {isHealthLoading ? (
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></span>
                ) : healthStatus ? (
                  healthStatus.database.ready ? (
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      API & DB Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      API Online (DB Disconnected)
                    </span>
                  )
                ) : (
                  <span className="flex items-center gap-1 text-rose-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    API Offline
                  </span>
                )}
              </div>

              {/* Experience Mode Switcher */}
              <button
                type="button"
                onClick={handleToggleMode}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer shadow-xs ${
                  isRecruiterPath
                    ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                    : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50/70 hover:border-indigo-300'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>
                  Switch to {isRecruiterPath ? 'Candidate Portal' : 'Recruiter Mode'}
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1">
              {isRecruiterPath ? 'Recruiter Navigation' : 'Candidate Navigation'}
            </div>
            {activeLinks.map(link => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">AWT CEC Job Recruitment Platform</span>
            <span>•</span>
            <span>MERN Full-Stack Foundation</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Fast Heuristic ATS Scoring</span>
            <span>•</span>
            <span>React 19 & Tailwind v4</span>
            <span>•</span>
            <span>Express & MongoDB</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
