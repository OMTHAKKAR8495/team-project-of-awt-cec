import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Sparkles,
  Clock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: 'enterprise-ai',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const globalHubs = [
    {
      city: 'New York, United States',
      role: 'Global HQ',
      address: 'One Nexus Plaza, Manhattan, NY 10001',
      phone: '+1 (212) 555-0190',
      email: 'hq.ny@nexusdynamics.global',
      timeZone: 'America/New_York',
    },
    {
      city: 'London, United Kingdom',
      role: 'Regional HQ',
      address: '30 St Mary Axe, City of London, EC3A 8EP',
      phone: '+44 20 7946 0912',
      email: 'emea.london@nexusdynamics.global',
      timeZone: 'Europe/London',
    },
    {
      city: 'Singapore, Singapore',
      role: 'Regional HQ',
      address: 'Marina Bay Financial Centre Tower 2, Singapore 018983',
      phone: '+65 6789 0100',
      email: 'apac.singapore@nexusdynamics.global',
      timeZone: 'Asia/Singapore',
    },
    {
      city: 'Zurich, Switzerland',
      role: 'R&D Center',
      address: 'Technoparkstrasse 1, 8005 Zürich',
      phone: '+41 44 234 5678',
      email: 'rd.zurich@nexusdynamics.global',
      timeZone: 'Europe/Zurich',
    },
    {
      city: 'Bengaluru, India',
      role: 'Innovation Hub',
      address: 'Outer Ring Road, Manyata Tech Park, Bengaluru 560045',
      phone: '+91 80 4000 1234',
      email: 'innovation.bengaluru@nexusdynamics.global',
      timeZone: 'Asia/Kolkata',
    },
    {
      city: 'Tokyo, Japan',
      role: 'Innovation Hub',
      address: 'Roppongi Hills Mori Tower, Minato-ku, Tokyo 106-6108',
      phone: '+81 3 5555 0143',
      email: 'tech.tokyo@nexusdynamics.global',
      timeZone: 'Asia/Tokyo',
    },
  ];

  const getLocalHubTime = (tz: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: tz,
        timeZoneName: 'short',
      }).format(new Date());
    } catch {
      return 'Operational';
    }
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Enterprise email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email format.';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject is required.';
    if (!formData.message.trim() || formData.message.length < 10) {
      errs.message = 'Message must be at least 10 characters long.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        department: 'enterprise-ai',
        subject: '',
        message: '',
      });
    }, 800);
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* 1. HERO */}
      <section className="relative pt-10 sm:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-950/60 border border-indigo-500/40 text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>GLOBAL COMMUNICATIONS &amp; LIAISON</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Connect with Nexus Dynamics{' '}
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            Worldwide Network
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Whether you are exploring enterprise AI integration, renewable grid partnerships, candidate recruitment, or institutional media inquiries, our global teams respond within one business day.
        </p>
      </section>

      {/* 2. INQUIRY FORM & DIRECT CONTACT CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 nexus-glass-card rounded-3xl p-6 sm:p-10 border border-indigo-500/30 bg-[#0b0f2a]/70 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Submit an Enterprise Inquiry
              </h2>
              <p className="text-xs text-slate-400">
                All communications are protected under strict international privacy agreements and mutual NDAs.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Inquiry Transmitted Successfully</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your reference identifier is <strong className="text-cyan-400">NX-2026-{Math.floor(100000 + Math.random() * 900000)}</strong>. A regional representative from our Executive Operations team will connect with you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">
                      Full Legal Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Elena Vance"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-[#080d22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">
                      Enterprise Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="name@corporation.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#080d22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                    />
                    {errors.email && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Department</label>
                    <select
                      value={formData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-[#080d22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden focus:border-cyan-400 cursor-pointer"
                    >
                      <option value="enterprise-ai">Software, Cloud &amp; AI</option>
                      <option value="grid-infrastructure">Renewable Grid Infrastructure</option>
                      <option value="global-finance">Global Finance &amp; M&amp;A</option>
                      <option value="bio-informatics">Healthcare Systems &amp; Bio</option>
                      <option value="talent-recruitment">Global Talent Acquisition / Careers</option>
                      <option value="press-relations">Media &amp; Public Relations</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">
                      Subject <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Re: Strategic Partnership Inquiry"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#080d22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                    />
                    {errors.subject && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">
                    Brief Statement of Requirements <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide relevant details regarding your enterprise requirement, technical scope, or career inquiry..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#080d22] border border-white/10 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                  />
                  {errors.message && (
                    <p className="text-[11px] text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.message}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Encrypting &amp; Dispatching...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Transmit Enterprise Inquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Key Contacts & Protocols */}
          <div className="lg:col-span-5 space-y-6">
            <div className="nexus-glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <span>Global Headquarters</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                One Nexus Plaza, Manhattan, New York, NY 10001, United States
              </p>
              <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>+1 (212) 555-0190</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>contact@nexusdynamics.global</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>24/7 Global NOC &amp; Dispatch Support</span>
                </div>
              </div>
            </div>

            <div className="nexus-glass-card rounded-3xl p-6 sm:p-8 border border-indigo-500/20 bg-gradient-to-br from-[#0c1130] to-[#080b1c] space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Enterprise SLA Guarantee</span>
              </div>
              <h4 className="text-white font-bold text-sm">Rapid Global Dispatch</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All client requests receive acknowledgement within 15 minutes and dedicated technical routing within 4 operational hours across North America, EMEA, and APAC time zones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ALL 6 STRATEGIC HUBS DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">REGIONAL DECISION HUBS</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Direct Local Hub Directory</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {globalHubs.map(hub => (
            <div key={hub.city} className="nexus-glass-card rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{hub.city}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
                  {hub.role}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{hub.address}</span>
              </div>
              <div className="pt-2 border-t border-white/5 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="text-cyan-400 font-medium">{hub.phone}</div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{getLocalHubTime(hub.timeZone)}</span>
                  </div>
                </div>
                <div className="text-slate-400">{hub.email}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
