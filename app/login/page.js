'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GraduationCap, ArrowLeft, Mail, User, Phone, KeyRound, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // login, register, otp
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpHint, setOtpHint] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, mobile, role: 'student' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOtpHint(data.otp_hint || '');
      setSuccess('Registration successful! OTP has been sent.');
      setMode('otp');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOtpHint(data.otp_hint || '');
      setMode('otp');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('student_token', data.token);
      localStorage.setItem('student_user', JSON.stringify(data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-royal flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-royal-800 flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-gold-light" />
            </div>
            <h2 className="text-2xl font-bold text-royal-800">
              {mode === 'login' ? 'Student Login' : mode === 'register' ? 'Student Registration' : 'Verify OTP'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">Result Wallah Student Portal</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {success}</div>}
          {otpHint && <div className="bg-blue-50 text-blue-600 p-3 rounded-lg text-xs mb-4">{otpHint}</div>}

          {mode === 'login' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="pl-10" required />
                </div>
              </div>
              <Button type="submit" className="w-full bg-royal-800 hover:bg-royal-700 text-white" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
              <p className="text-center text-sm text-gray-500">
                Don't have an account? <button type="button" onClick={() => { setMode('register'); setError(''); }} className="text-royal-700 font-semibold hover:underline">Register</button>
              </p>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="pl-10" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="pl-10" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Your mobile number" className="pl-10" required />
                </div>
              </div>
              <Button type="submit" className="w-full bg-royal-800 hover:bg-royal-700 text-white" disabled={loading}>
                {loading ? 'Registering...' : 'Register & Get OTP'}
              </Button>
              <p className="text-center text-sm text-gray-500">
                Already registered? <button type="button" onClick={() => { setMode('login'); setError(''); }} className="text-royal-700 font-semibold hover:underline">Login</button>
              </p>
            </form>
          )}

          {mode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">Enter the 6-digit OTP sent to <strong>{email}</strong></p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">OTP Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" className="pl-10 text-center text-lg tracking-widest" maxLength={6} required />
                </div>
              </div>
              <Button type="submit" className="w-full bg-royal-800 hover:bg-royal-700 text-white" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Login'}
              </Button>
              <p className="text-center text-sm text-gray-500">
                <button type="button" onClick={() => { setMode('login'); setError(''); setOtpHint(''); }} className="text-royal-700 font-semibold hover:underline">← Back to login</button>
              </p>
            </form>
          )}

          <div className="mt-6 pt-4 border-t text-center">
            <a href="/" className="text-sm text-gray-400 hover:text-royal-700 inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to website
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
