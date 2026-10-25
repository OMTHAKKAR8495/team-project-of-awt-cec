import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  DollarSign,
  HeartPulse,
  Share2,
  Users2,
  ChevronRight,
  Globe,
  Briefcase,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { getJobs } from '../services/api';

export const HomePage: React.FC = () => {
  const [totalJobsCount, setTotalJobsCount] = useState<number>(128);

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const res = await getJobs({ limit: 1, status: 'open' });
        if (res.pagination.total) {
          setTotalJobsCount(res.pagination.total);
        }
      } catch {
        // Fallback to enterprise default stats
      }
    };
    fetchLiveStats();
  }, []);

  // 6 Enterprise Divisions (From Screenshot 2)
  const divisions = [
    {
      id: 'software-ai',
      title: 'Software, Cloud & Artificial Intelligence',
      roles: '42 Open Roles',
      icon: Cpu,
      description: 'Building quantum-ready AI models, cloud infrastructure, and enterprise data platforms.',
      accent: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'engineering-infrastructure',
      title: 'Advanced Engineering & Infrastructure',
      roles: '28 Open Roles',
      icon: Layers,
      description: 'Designing sustainable grid infrastructure, aerospace hardware, and robotics.',
      accent: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'finance-risk',
      title: 'Global Finance, M&A & Risk Management',
      roles: '19 Open Roles',
      icon: DollarSign,
      description: 'Managing multinational capital allocations, enterprise risk, and strategic acquisitions.',
      accent: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'healthcare-bio',
      title: 'Healthcare Systems & Bio-Informatics',
      roles: '15 Open Roles',
      icon: HeartPulse,
      description: 'Pioneering genomic analysis algorithms, hospital IoT platforms, and med-tech.',
      accent: 'from-rose-500 to-pink-600',
    },
    {
      id: 'brand-comms',
      title: 'Global Brand & Digital Communications',
      roles: '12 Open Roles',
      icon: Share2,
      description: 'Crafting brand narratives, global media strategies, and digital growth campaigns.',
      accent: 'from-amber-500 to-orange-600',
    },
    {
      id: 'hr-talent',
      title: 'Human Resources & Global Talent Acquisition',
      roles: '16 Open Roles',
      icon: Users2,
      description: 'Nurturing 120,000+ team members with inclusive workplace programs and career growth.',
      accent: 'from-purple-500 to-violet-600',
    },
  ];

  // 6 Strategic Global Hubs (From Screenshot 2)
  const globalHubs = [
    {
      city: 'New York, United States',
      role: 'Global HQ',
      roleColor: 'bg-indigo-900/60 text-indigo-300 border-indigo-700/50',
      address: 'One Nexus Plaza, Manhattan, NY 10001',
      workforce: '18,500',
      phone: '+1 (212) 555-0190',
    },
    {
      city: 'London, United Kingdom',
      role: 'Regional HQ',
      roleColor: 'bg-purple-900/60 text-purple-300 border-purple-700/50',
      address: '30 St Mary Axe, City of London, EC3A 8EP',
      workforce: '14,200',
      phone: '+44 20 7946 0912',
    },
    {
      city: 'Singapore, Singapore',
      role: 'Regional HQ',
      roleColor: 'bg-purple-900/60 text-purple-300 border-purple-700/50',
      address: 'Marina Bay Financial Centre Tower 2, Singapore 018983',
      workforce: '11,800',
      phone: '+65 6789 0100',
    },
    {
      city: 'Zurich, Switzerland',
      role: 'R&D Center',
      roleColor: 'bg-cyan-900/60 text-cyan-300 border-cyan-700/50',
      address: 'Technoparkstrasse 1, 8005 Zürich',
      workforce: '8,400',
      phone: '+41 44 234 5678',
    },
    {
      city: 'Bengaluru, India',
      role: 'Innovation Hub',
      roleColor: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50',
      address: 'Outer Ring Road, Manyata Tech Park, Bengaluru 560045',
      workforce: '24,500',
      phone: '+91 80 4000 1234',
    },
    {
      city: 'Tokyo, Japan',
      role: 'Innovation Hub',
      roleColor: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50',
      address: 'Roppongi Hills Mori Tower, Minato-ku, Tokyo 106-6108',
      workforce: '9,200',
      phone: '+81 3 5555 0143',
    },
  ];

  // 3 Latest Enterprise News items (From Screenshot 3)
  const enterpriseNews = [
    {
      category: 'AI & Tech',
      categoryColor: 'bg-cyan-950/80 text-cyan-400 border-cyan-800/40',
      date: 'July 20, 2026',
      readTime: '4 min read',
      title: 'Nexus Launches Breakthrough Enterprise AI Platform "Atlas 4.0" for Autonomous Industrial Operations',
      snippet: 'Atlas 4.0 unifies multimodal AI telemetry with industrial IoT grids, reducing energy waste by up to 34% for automotive and pharmaceutical plants.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    },
    {
      category: 'Sustainability',
      categoryColor: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/40',
      date: 'July 14, 2026',
      readTime: '3 min read',
      title: 'Nexus Dynamics Achieves 80% Renewable Energy Target 4 Years Ahead of ESG Roadmap',
      snippet: 'Through major microgrid installations in North America and Western Europe, Nexus now powers all manufacturing and data centers with certified green power.',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    },
    {
      category: 'Financial',
      categoryColor: 'bg-purple-950/80 text-purple-400 border-purple-800/40',
      date: 'July 02, 2026',
      readTime: '5 min read',
      title: 'Nexus Dynamics Reports Q2 Fiscal 2026 Revenue of $13.8B, Up 16% Year-Over-Year',
      snippet: 'Strong demand for AI cloud services and high-capacity electrical grid components drives record quarterly earnings and expanded dividend payouts.',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-16">
      {/* ============================================================== */}
      {/* 1. HERO SECTION (From Screenshot 1) */}
      {/* ============================================================== */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-cyan-500/20 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Pill badge: FORTUNE 500 MULTINATIONAL CONGLOMERATE */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-950/50 border border-indigo-500/40 text-purple-300 shadow-sm shadow-indigo-500/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="tracking-wide uppercase text-[11px]">Fortune 500 Multinational Conglomerate</span>
          </div>

          {/* Massive Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] sm:leading-[1.15]">
            Architecting the Future of{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Global Enterprise &amp; Technology
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Nexus Dynamics powers global transformation across{' '}
            <strong className="text-white font-semibold">Artificial Intelligence</strong>,{' '}
            <strong className="text-white font-semibold">Renewable Energy</strong>,{' '}
            <strong className="text-white font-semibold">Healthcare Systems</strong>, and{' '}
            <strong className="text-white font-semibold">Financial Advisory</strong> for Fortune 500 corporations worldwide.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/careers"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-cyan-200" />
              <span>Explore Careers (Hiring All Fields)</span>
              <ArrowRight className="w-4 h-4 text-cyan-200" />
            </Link>

            <Link
              to="/divisions"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-[#0d122e]/80 hover:bg-[#141b44] border border-indigo-500/30 hover:border-indigo-400/50 shadow-md transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Global Business Divisions</span>
            </Link>
          </div>

          {/* Pill Ticker: NOW HIRING GLOBALLY */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#080d22] border border-white/10 text-xs">
              <span className="font-extrabold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Now Hiring Globally:
              </span>
              <span className="text-slate-300 font-medium">
                Software &amp; AI, Engineering, Finance, Biotech, HR, Legal &amp; Sales
              </span>
            </div>
          </div>
        </div>

        {/* 4 Stat Cards (Screenshot 1) */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="nexus-glass-card rounded-2xl p-6 text-left border border-white/10 space-y-2">
            <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
              ANNUAL REVENUE
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              $52.4 Billion
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.2% YoY</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="nexus-glass-card rounded-2xl p-6 text-left border border-white/10 space-y-2">
            <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
              GLOBAL WORKFORCE
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              124,000+
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Across 65+ Nations</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="nexus-glass-card rounded-2xl p-6 text-left border border-white/10 space-y-2">
            <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
              R&amp;D INVESTMENT
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              $6.8 Billion
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>In Next-Gen AI &amp; Tech</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="nexus-glass-card rounded-2xl p-6 text-left border border-white/10 space-y-2">
            <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
              ESG NET-ZERO GOAL
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              100% Clean
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Target Year 2030</span>
            </div>
          </div>
        </div>

        {/* Global Talent Opportunity Banner Card (Screenshot 1) */}
        <div className="mt-8 max-w-6xl mx-auto nexus-glass-card rounded-3xl p-6 sm:p-10 border border-indigo-500/30 bg-gradient-to-r from-[#0d1233] via-[#090e24] to-[#0c133a] flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-700/50">
              GLOBAL TALENT OPPORTUNITY
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              We Are Hiring Globally Across{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
                All Corporate &amp; Tech Fields
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Whether you specialize in artificial intelligence research, renewable grid engineering, corporate law, biotech informatics, global supply chain, or HR talent strategy&mdash;Nexus Dynamics offers unprecedented career growth.
            </p>
          </div>

          <Link
            to="/careers"
            className="shrink-0 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-xl shadow-indigo-600/25 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>Browse Open Positions ({totalJobsCount} Disciplines)</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. ENTERPRISE CAPABILITIES / OUR BUSINESS DIVISIONS (From Screenshot 2) */}
      {/* ============================================================== */}
      <section id="divisions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            ENTERPRISE CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Our Business Divisions
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Delivering cross-sector innovation and specialized industrial solutions across 65+ countries.
          </p>
        </div>

        {/* 6 Divisions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {divisions.map(div => {
            const Icon = div.icon;
            return (
              <div
                key={div.id}
                className="nexus-glass-card rounded-2xl p-6 border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                      {div.roles}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug group-hover:text-cyan-300 transition-colors">
                    {div.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {div.description}
                  </p>
                </div>

                <div className="pt-6">
                  <Link
                    to="/divisions"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Explore Solutions &amp; Roles</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. GLOBAL PRESENCE / STRATEGIC GLOBAL HUBS (From Screenshot 2) */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="nexus-glass-card rounded-3xl p-6 sm:p-10 border border-indigo-500/20 bg-[#0a0d24]/70 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
                <Globe className="w-3.5 h-3.5" />
                <span>GLOBAL PRESENCE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Our Strategic Global Hubs
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Headquartered in New York, with regional decision hubs across EMEA and APAC.
              </p>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors shrink-0"
            >
              <span>View All 65+ Office Locations</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 6 Hubs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {globalHubs.map(hub => (
              <div
                key={hub.city}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{hub.city}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${hub.roleColor}`}>
                    {hub.role}
                  </span>
                </div>

                <div className="text-xs text-slate-400">{hub.address}</div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    Workforce: <strong className="text-white font-semibold">{hub.workforce}</strong>
                  </div>
                  <div className="text-cyan-400 font-medium">{hub.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. NEWSROOM & INSIGHTS / LATEST ENTERPRISE NEWS (From Screenshot 3) */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              NEWSROOM &amp; INSIGHTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Latest Enterprise News
            </h2>
          </div>

          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Visit Global Newsroom</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enterpriseNews.map(item => (
            <div
              key={item.title}
              className="nexus-glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-cyan-500/40 transition-all"
            >
              <div>
                {/* News Image Banner */}
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d20] via-transparent to-black/20" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.categoryColor}`}>
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* News Content */}
                <div className="p-6 space-y-3">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{item.date} &bull; {item.readTime}</span>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {item.snippet}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Read Full Press Release</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. DIRECT ATS & RECRUITER QUICK LAUNCH (Phase 2 & 3 Integration) */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-[#0a0f2e] to-cyan-950/40 border border-indigo-500/30 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              AI-POWERED CANDIDATE EVALUATION
            </div>
            <h3 className="text-2xl font-bold text-white">
              Instant ATS Resume Scoring &amp; Heuristic Analysis
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Upload candidate CVs (.pdf, .docx, .txt) against live open requisitions to calculate transparent 0-100 compatibility scores with instant skill gap analysis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/analyze-resume"
              className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Evaluate Resume Now</span>
            </Link>

            <Link
              to="/careers"
              className="px-5 py-3 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              View Open Opportunities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
