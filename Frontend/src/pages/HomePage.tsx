import React from 'react';
import { Layers, Server, Database, Code2, CheckCircle2, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                AWT CEC
              </span>
              <span className="text-xs text-indigo-400 font-medium ml-2 px-2 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-800/40">
                Phase 1 Foundation
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Environment Ready</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col justify-center space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-950/60 border border-indigo-800/50 text-indigo-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            Full-Stack Project Architecture Established
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            AWT CEC{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              College Project
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Technical foundation configured with strict TypeScript, Vite, React 19, Tailwind CSS v4,
            Express.js, and MongoDB connection scaffolding.
          </p>
        </div>

        {/* Foundation Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Client Pillar */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 hover:border-indigo-500/30 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <Code2 className="w-5 h-5" />
            </div>
            <h2 className="font-semibold text-white text-base">Frontend Architecture</h2>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              React 19, TypeScript, Vite, Tailwind CSS v4
            </p>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                Vite bundler with @tailwindcss/vite
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                React Router 7 route definitions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                Centralized Axios API service
              </li>
            </ul>
          </div>

          {/* Server Pillar */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Server className="w-5 h-5" />
            </div>
            <h2 className="font-semibold text-white text-base">Backend Architecture</h2>
            <p className="text-xs text-slate-400 mt-1 mb-4">Node.js, Express, TypeScript</p>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Separation of app.ts and server.ts
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                CORS, body parsing & error middleware
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Health check endpoint at /api/health
              </li>
            </ul>
          </div>

          {/* Database Pillar */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="font-semibold text-white text-base">Database Layer</h2>
            <p className="text-xs text-slate-400 mt-1 mb-4">MongoDB & Mongoose ODM</p>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Reusable connection with safe credential logging
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Connection state tracking in health check
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Graceful termination signal handlers
              </li>
            </ul>
          </div>
        </div>

        {/* Next Steps Box */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-white text-sm">Next Phase: Data Models & APIs</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Phase 1 foundation is verified and ready for feature implementation in subsequent
              phases.
            </p>
          </div>
          <span className="inline-flex items-center text-xs text-indigo-400 font-medium hover:text-indigo-300 transition-colors gap-1">
            Ready for Phase 2 <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AWT CEC • Project Architecture & Setup Foundation</span>
          <span>Phase 1 Verification Complete</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
