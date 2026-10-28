import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User as UserIcon, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AlertBanner from '../components/common/AlertBanner';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'recruiter' | 'candidate'>('candidate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { login, register, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    if (isRegister && !name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (isRegister && password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isRegister) {
        await register(name.trim(), email.trim(), password, role);
      } else {
        await login(email.trim(), password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = (type: 'recruiter' | 'candidate') => {
    setIsRegister(false);
    if (type === 'recruiter') {
      setEmail('recruiter@demo.com');
      setPassword('Demo@1234');
    } else {
      setEmail('candidate@demo.com');
      setPassword('Demo@1234');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="nexus-glass-card max-w-md w-full rounded-3xl p-8 sm:p-10 border border-indigo-500/30 bg-[#090d24]/90 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 border border-indigo-500/40 text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>NEXUS AUTHENTICATION GATEWAY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isRegister ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-slate-400">
            {isRegister
              ? 'Join Nexus Dynamics as a candidate or recruiter.'
              : 'Sign in to access your recruitment dashboard or candidate portal.'}
          </p>
        </div>

        {/* Error notification */}
        {(formError || authError) && (
          <AlertBanner
            variant="error"
            title="Authentication Error"
            message={formError || authError || ''}
            onClose={() => setFormError(null)}
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <Input
              label="Full Name"
              required
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={isSubmitting}
            />
          )}

          <Input
            label="Email Address"
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isSubmitting}
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isSubmitting}
            hint={isRegister ? 'Must be at least 8 characters.' : undefined}
          />

          {isRegister && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Select Your Role <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    role === 'candidate'
                      ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-md shadow-cyan-500/20'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Candidate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    role === 'recruiter'
                      ? 'border-purple-400 bg-purple-950/60 text-purple-300 shadow-md shadow-purple-500/20'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Recruiter</span>
                </button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isRegister ? 'Register Account' : 'Sign In'}
          </Button>
        </form>

        {/* Quick Demo Pre-fill Links */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block text-center">
            Quick Fill Demo Credentials
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('recruiter')}
              className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 border border-white/5 transition-colors cursor-pointer"
            >
              Recruiter Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('candidate')}
              className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 border border-white/5 transition-colors cursor-pointer"
            >
              Candidate Demo
            </button>
          </div>
        </div>

        {/* Switch mode */}
        <div className="text-center text-xs text-slate-400 pt-2">
          {isRegister ? (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setFormError(null);
                }}
                className="text-cyan-300 font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setFormError(null);
                }}
                className="text-cyan-300 font-bold hover:underline cursor-pointer"
              >
                Register Now
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
