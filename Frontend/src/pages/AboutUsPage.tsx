import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Sparkles,
  ShieldCheck,
  Users,
  Compass,
  Zap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const leadership = [
    {
      name: 'Dr. Evelyn Vance',
      role: 'Chief Executive Officer & Board Chair',
      bio: 'Former head of global cloud infrastructure at top Tier-1 tech conglomerates; 22+ years guiding enterprise scale.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Marcus Sterling',
      role: 'Chief Technology Officer & Head of AI',
      bio: 'PhD in Distributed Systems from MIT; pioneer in sovereign industrial machine learning architectures.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Elena Rostova',
      role: 'Chief Financial Officer & Executive VP',
      bio: 'Specialist in multinational capitalization, cross-border M&A advisory, and strategic liquidity management.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Dr. Aris Thorne',
      role: 'President, Renewable Energy & ESG Systems',
      bio: 'Spearheading smart microgrid deployments and net-zero industrial conversions across EMEA and APAC.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const coreValues = [
    {
      icon: Zap,
      title: 'Technological Preeminence',
      description: 'We invest $6.8B annually in R&D to engineer production-ready breakthroughs ahead of global demand curves.',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Integrity & Trust',
      description: 'Zero-compromise governance, rigorous compliance, and transparent algorithmic audits across 65+ nations.',
    },
    {
      icon: Globe,
      title: 'Planetary Stewardship',
      description: 'Dedicated to achieving 100% clean grid infrastructure and leading circular enterprise logistics by 2030.',
    },
    {
      icon: Users,
      title: 'Radical Inclusivity & Merit',
      description: 'A global workforce of 124,000+ professionals united by meritocracy, innovation, and diverse perspectives.',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-950/60 border border-indigo-500/40 text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>ABOUT NEXUS DYNAMICS GROUP</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Pioneering the Future of{' '}
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            Global Enterprise &amp; Intelligent Systems
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Founded on the principle of purposeful technological acceleration, Nexus Dynamics has grown into a Fortune 500 powerhouse delivering mission-critical artificial intelligence, clean grid power, biomedical informatics, and high-stakes financial advisory worldwide.
        </p>

        {/* Global Key Stats Bar */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
          <div className="nexus-glass-card rounded-2xl p-5 border border-white/10 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Founded</span>
            <div className="text-2xl font-extrabold text-white">2012</div>
            <p className="text-xs text-cyan-400">14 Years of Excellence</p>
          </div>
          <div className="nexus-glass-card rounded-2xl p-5 border border-white/10 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Global Workforce</span>
            <div className="text-2xl font-extrabold text-white">124,000+</div>
            <p className="text-xs text-cyan-400">65+ Sovereign Hubs</p>
          </div>
          <div className="nexus-glass-card rounded-2xl p-5 border border-white/10 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Annual Revenue</span>
            <div className="text-2xl font-extrabold text-white">$52.4B</div>
            <p className="text-xs text-cyan-400">+14.2% YoY Growth</p>
          </div>
          <div className="nexus-glass-card rounded-2xl p-5 border border-white/10 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">R&amp;D Investment</span>
            <div className="text-2xl font-extrabold text-white">$6.8B</div>
            <p className="text-xs text-cyan-400">Next-Gen AI &amp; Quantum</p>
          </div>
        </div>
      </section>

      {/* 2. MISSION & VISION DUAL CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="nexus-glass-card rounded-3xl p-8 sm:p-10 border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 to-slate-900/60 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-900/60 border border-indigo-500/40 text-cyan-400 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Our Enterprise Mission</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              To construct autonomous, resilient, and ethically anchored digital and physical architectures that solve humanity&apos;s most urgent industrial, environmental, and computational challenges at planetary scale.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Empowering 85% of Fortune 100 enterprise transformations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-latency autonomous telemetry across industrial IoT grids</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Democratizing enterprise machine intelligence responsibly</span>
              </li>
            </ul>
          </div>

          <div className="nexus-glass-card rounded-3xl p-8 sm:p-10 border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-slate-900/60 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Our 2030 Global Vision</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We envision a fully integrated global industrial ecosystem where clean renewable energy grids, privacy-preserving machine intelligence, and decentralized supply chains converge seamlessly to foster widespread prosperity.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>100% certified net-zero greenhouse footprint by 2030</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Quantum-resistant enterprise encryption deployed globally</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Universal access to automated career matching &amp; skill synthesis</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. CORE ENTERPRISE VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">GUIDING PRINCIPLES</div>
          <h2 className="text-3xl font-extrabold text-white">The Pillars of Nexus Culture</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Our global practices are grounded in rigorous standards of operational and ethical excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="nexus-glass-card rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">{val.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{val.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. EXECUTIVE LEADERSHIP COMMITTEE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">EXECUTIVE COMMITTEE</div>
          <h2 className="text-3xl font-extrabold text-white">Leadership Steering Global Innovation</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Seasoned technocrats, scientists, and enterprise strategists with decades of combined leadership.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map(member => (
            <div key={member.name} className="nexus-glass-card rounded-2xl overflow-hidden border border-white/10 group hover:border-cyan-500/40 transition-all">
              <div className="h-60 overflow-hidden bg-slate-900">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-white text-base">{member.name}</h3>
                <div className="text-xs text-cyan-400 font-semibold">{member.role}</div>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CAREER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="nexus-glass-card rounded-3xl p-8 sm:p-12 border border-indigo-500/30 bg-gradient-to-r from-purple-950/40 via-indigo-950/50 to-[#070b20] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Shape the Future with Nexus Dynamics
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              We are actively welcoming visionary software engineers, AI researchers, quantitative analysts, and sustainability strategists.
            </p>
          </div>

          <Link
            to="/careers"
            className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-xl shadow-indigo-600/25 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Explore Open Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
