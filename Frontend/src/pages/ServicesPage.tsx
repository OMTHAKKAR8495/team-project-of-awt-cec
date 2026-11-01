import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  DollarSign,
  HeartPulse,
  Share2,
  Users2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Server,
  BarChart3,
  Network,
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [selectedDivision, setSelectedDivision] = useState(0);

  const divisionDetails = [
    {
      id: 'software-ai',
      title: 'Software, Cloud & Artificial Intelligence',
      subtitle: 'Building quantum-ready AI models, cloud infrastructure, and enterprise data platforms.',
      roles: '42 Open Roles',
      icon: Cpu,
      gradient: 'from-cyan-500 to-blue-600',
      capabilities: [
        'Multimodal LLMs & Autonomous Agent Orchestration',
        'Sovereign Hybrid Cloud & Edge Computing Fab',
        'Zero-Trust Enterprise Data Platforms',
        'Deterministic Heuristic ATS & Natural Language Processing',
      ],
      technologies: ['PyTorch', 'Distributed Kubernetes', 'Rust', 'TypeScript', 'Ray', 'Vector DBs'],
      impactMetric: '34% Lower Compute Waste Across 1,400+ Nodes',
    },
    {
      id: 'engineering-infrastructure',
      title: 'Advanced Engineering & Infrastructure',
      subtitle: 'Designing sustainable grid infrastructure, aerospace hardware, and robotics.',
      roles: '28 Open Roles',
      icon: Layers,
      gradient: 'from-blue-500 to-indigo-600',
      capabilities: [
        'Decentralized Smart Grid Microgrids & BESS',
        'Aerospace Avionics & Low-Earth Orbit Satellite Comms',
        'High-Precision Autonomous Robotics for Manufacturing',
        'Carbon-Negative Industrial Architecture',
      ],
      technologies: ['C++', 'Embedded Linux', 'SCADA', 'Digital Twins', 'Simulink', 'CAD/CAM'],
      impactMetric: '99.999% Microgrid Uptime in Critical Municipalities',
    },
    {
      id: 'finance-risk',
      title: 'Global Finance, M&A & Risk Management',
      subtitle: 'Managing multinational capital allocations, enterprise risk, and strategic acquisitions.',
      roles: '19 Open Roles',
      icon: DollarSign,
      gradient: 'from-emerald-500 to-teal-600',
      capabilities: [
        'Quantitative Algorithmic Risk Modeling',
        'Cross-Border Mergers, Acquisitions & Integration',
        'Sovereign Wealth & Pension Fund Advisory',
        'ESG Compliance & Carbon Credit Portfolios',
      ],
      technologies: ['Python Quant', 'Bloomberg API', 'Stochastic Calculus', 'PostgreSQL', 'Tableau'],
      impactMetric: '$52.4B Annual Capital Velocity Orchestrated',
    },
    {
      id: 'healthcare-bio',
      title: 'Healthcare Systems & Bio-Informatics',
      subtitle: 'Pioneering genomic analysis algorithms, hospital IoT platforms, and med-tech.',
      roles: '15 Open Roles',
      icon: HeartPulse,
      gradient: 'from-rose-500 to-pink-600',
      capabilities: [
        'High-Throughput Genomic Variant Sequencing',
        'Privacy-Preserving Federated Clinical Trials',
        'Critical Care Hospital IoT & Telemetry Networks',
        'AI Diagnostics for Early Oncology Detection',
      ],
      technologies: ['BioPython', 'HL7 FHIR', 'HIPAA Secure Vaults', 'TensorFlow', 'CUDA'],
      impactMetric: '4.2M Patient Records Processed with 99.8% Reliability',
    },
    {
      id: 'brand-comms',
      title: 'Global Brand & Digital Communications',
      subtitle: 'Crafting brand narratives, global media strategies, and digital growth campaigns.',
      roles: '12 Open Roles',
      icon: Share2,
      gradient: 'from-amber-500 to-orange-600',
      capabilities: [
        'Omnichannel Multinational Brand Governance',
        'Algorithmic Audience Intelligence & Sentiment Modeling',
        'Enterprise Crisis Communications & Stakeholder Relations',
        'Generative Media Production Studios',
      ],
      technologies: ['Next-Gen CMS', 'Natural Language Analytics', 'Media Mix Modeling', 'Figma'],
      impactMetric: '850M+ Organic Impressions Annually Across 40 Markets',
    },
    {
      id: 'hr-talent',
      title: 'Human Resources & Global Talent Acquisition',
      subtitle: 'Nurturing 120,000+ team members with inclusive workplace programs and career growth.',
      roles: '16 Open Roles',
      icon: Users2,
      gradient: 'from-purple-500 to-violet-600',
      capabilities: [
        'Algorithmic Skill Gap Analysis & Internal Mobility',
        'Global Executive Search & Technical Sourcing',
        'Continuous Professional Upskilling & Leadership Academies',
        'Cross-Border Visas, Payroll & Relocation Services',
      ],
      technologies: ['ATS Scoring Engines', 'Workday API', 'Candidate Graph Databases', 'Analytics'],
      impactMetric: '94% Retention Rate Across 124,000+ Global Professionals',
    },
  ];

  const current = divisionDetails[selectedDivision];
  const CurrentIcon = current.icon;

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* 1. HERO */}
      <section className="relative pt-10 sm:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/40 text-purple-800 dark:text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
          <span>ENTERPRISE DIVISIONS &amp; CAPABILITIES</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Delivering Cross-Sector Excellence Across{' '}
          <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 dark:from-purple-400 dark:via-indigo-300 dark:to-cyan-400 bg-clip-text text-transparent">
            6 Specialized Business Divisions
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          From quantum-scale cloud engineering to clean microgrid installations and biomedical informatics, discover the multidisciplinary divisions powering Fortune 500 transformation.
        </p>
      </section>

      {/* 2. INTERACTIVE DIVISION SELECTOR & DEEP DIVE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Division Navigation Tabs */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
              Select Business Division
            </div>
            {divisionDetails.map((div, idx) => {
              const Icon = div.icon;
              const isSelected = selectedDivision === idx;
              return (
                <button
                  key={div.id}
                  onClick={() => setSelectedDivision(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-gradient-to-r dark:from-[#11163a] dark:to-[#0c122b] border-indigo-300 dark:border-cyan-500/60 shadow-sm'
                      : 'bg-white dark:bg-[#090d20]/60 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <div className={`font-bold text-sm truncate ${isSelected ? 'text-indigo-900 dark:text-white' : 'text-slate-800 dark:text-slate-300'}`}>
                        {div.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{div.roles}</div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-indigo-600 dark:text-cyan-400 translate-x-1' : 'text-slate-400 dark:text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Division Deep Dive Detail Panel */}
          <div className="lg:col-span-7 nexus-glass-card rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-indigo-500/30 bg-white dark:bg-gradient-to-br dark:from-[#0e1438] dark:via-[#090d24] dark:to-[#080a1c] shadow-sm dark:shadow-none space-y-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-indigo-700 dark:text-cyan-400">
                  <CurrentIcon className="w-3.5 h-3.5" />
                  <span>Division Spotlight</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {current.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {current.subtitle}
                </p>
              </div>

              <span className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800/40 text-cyan-800 dark:text-cyan-300">
                {current.roles}
              </span>
            </div>

            {/* Core Capabilities */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                <span>Core Capabilities &amp; Systems</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {current.capabilities.map((cap, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack & Tooling */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Core Technologies &amp; Standards
              </div>
              <div className="flex flex-wrap gap-2">
                {current.technologies.map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-700/40 text-indigo-800 dark:text-indigo-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Impact Metric Banner */}
            <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-900 dark:text-cyan-300">
                <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Proven Field Performance:</span>
              </div>
              <div className="text-xs text-slate-900 dark:text-white font-semibold text-right">
                {current.impactMetric}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/careers"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/25 transition-all text-center"
              >
                View Requisitions in {current.title.split(',')[0]}
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-center transition-colors"
              >
                Inquire Enterprise Engagement
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GLOBAL INFRASTRUCTURE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">INTEGRATED ECOSYSTEM</div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">How Our Divisions Operate Synergistically</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Cross-discipline squads collaborate to deliver unified enterprise platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="nexus-glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent shadow-xs dark:shadow-none space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-white/5 text-indigo-600 dark:text-cyan-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Continuous Data Pipeline</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Industrial sensors feeds telemetry to Software &amp; AI models, continuously optimizing grid efficiency and equipment lifespans.
            </p>
          </div>

          <div className="nexus-glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent shadow-xs dark:shadow-none space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-white/5 text-indigo-600 dark:text-cyan-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Capital Allocation Accuracy</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Global Finance algorithms ingest macroeconomic indicators and ESG compliance datasets to drive intelligent M&amp;A decisions.
            </p>
          </div>

          <div className="nexus-glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent shadow-xs dark:shadow-none space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-white/5 text-indigo-600 dark:text-cyan-400 flex items-center justify-center">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Automated Skill Synthesis</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Our proprietary ATS and Interview Studio evaluate thousands of candidates weekly to match elite engineers with cutting-edge divisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
