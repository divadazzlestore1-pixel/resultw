'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap, BookOpen, Users, Trophy, Phone, Mail, MapPin, Menu, X,
  ChevronRight, Star, Download, ArrowRight, Clock, Shield, Zap, Target,
  Award, HeartPulse, Atom, RefreshCw, MessageCircle, Facebook, Instagram,
  Send, CheckCircle, Brain, Wifi, FlaskConical, BookMarked, ChevronDown,
  Bell, ChevronLeft, Image as ImageIcon, Volume2
} from 'lucide-react';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_edu-result-portal/artifacts/yciyivjg_RW_SWAMI%20_FLEX.png';

const ICON_MAP = {
  'atom': Atom,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'refresh-cw': RefreshCw,
};

function AnimatedCounter({ end, label, icon: Icon, suffix = '+' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end]);

  return (
    <div ref={ref} className="text-center p-6">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
        <Icon className="w-8 h-8 text-gold-light" />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">{count}{suffix}</div>
      <div className="text-white/70 text-sm uppercase tracking-wider">{label}</div>
    </div>
  );
}

function SectionTitle({ title, subtitle, light = false }) {
  return (
    <div className="text-center mb-12">
      <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-royal-800'}`}>
        {title}
      </h2>
      <div className="w-24 h-1 bg-gold mx-auto mb-4 rounded-full" />
      {subtitle && (
        <p className={`text-lg max-w-2xl mx-auto ${light ? 'text-white/70' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function AnnouncementBar({ announcements }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  if (!announcements.length) return null;

  return (
    <div className="bg-gold text-royal-800 py-2 px-4 relative overflow-hidden z-[60]">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <Bell className="w-4 h-4 flex-shrink-0 animate-bounce" />
        <div className="overflow-hidden relative h-6 flex-1 max-w-3xl">
          {announcements.map((ann, idx) => (
            <p key={ann.id} className={`text-sm font-medium text-center absolute inset-0 transition-all duration-500 flex items-center justify-center ${
              idx === currentIdx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              {ann.text}
            </p>
          ))}
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {announcements.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentIdx(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${idx === currentIdx ? 'bg-royal-800' : 'bg-royal-800/30'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BannerCarousel({ banners }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl">
      <div className="relative" style={{ paddingBottom: '40%' }}>
        {banners.map((banner, idx) => (
          <div key={banner.id} className={`absolute inset-0 transition-opacity duration-700 ${idx === currentIdx ? 'opacity-100' : 'opacity-0'}`}>
            <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
            {(banner.title || banner.description) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div>
                  {banner.title && <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{banner.title}</h3>}
                  {banner.description && <p className="text-white/80 text-sm md:text-base">{banner.description}</p>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentIdx(idx)}
              className={`w-3 h-3 rounded-full transition-all ${idx === currentIdx ? 'bg-gold w-8' : 'bg-white/50'}`} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [staff, setStaff] = useState([]);
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]);
  const [settings, setSettings] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [banners, setBanners] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', mobile: '', email: '', course: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch('/api/staff').then(r => r.json()).then(d => setStaff(d.staff || [])).catch(() => {});
    fetch('/api/courses').then(r => r.json()).then(d => setCourses(d.courses || [])).catch(() => {});
    fetch('/api/results').then(r => r.json()).then(d => setResults(d.results || [])).catch(() => {});
    fetch('/api/settings').then(r => r.json()).then(d => setSettings(d.settings || {})).catch(() => {});
    fetch('/api/announcements?active=true').then(r => r.json()).then(d => setAnnouncements(d.announcements || [])).catch(() => {});
    fetch('/api/banners?active=true').then(r => r.json()).then(d => setBanners(d.banners || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      setContactSubmitted(true);
      setContactForm({ name: '', mobile: '', email: '', course: '', message: '' });
      setTimeout(() => setContactSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
    }
    setContactLoading(false);
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Courses', href: '#courses' },
    { label: 'Results', href: '#results' },
    { label: 'Notes', href: '#notes' },
    { label: 'Contact', href: '#contact' },
  ];

  const contactInfo = settings?.contactInfo || {
    address: 'Result Wallah, Karad - Vita Rd, near JK Petrol Pump, Saidapur, Karad, Maharashtra 415124',
    whatsapp1: '09156781002',
    whatsapp2: '09156782003',
    facebook: 'https://www.facebook.com/p/Result-Wallah-61573986368335',
    instagram: 'https://www.instagram.com/resultwallah7',
  };

  const founder = staff.find(s => s.is_founder);
  const directors = staff.filter(s => !s.is_founder);

  return (
    <div className="min-h-screen">
      {/* ANNOUNCEMENT BAR */}
      <AnnouncementBar announcements={announcements} />

      {/* NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-royal-800/95 backdrop-blur-md shadow-lg' : 'bg-royal-800/80 backdrop-blur-sm'}`} style={{ top: announcements.length > 0 ? '36px' : '0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center space-x-3">
              <img src={LOGO_URL} alt="RW Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />
              <div>
                <h1 className="text-lg md:text-xl font-bold text-white">RESULT WALLAH<sup className="text-[8px] text-gold-light ml-0.5">&trade;</sup></h1>
                <p className="text-[10px] text-gold-light tracking-wider hidden sm:block">Your Career Is First For Us...</p>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} className="text-white/80 hover:text-gold-light transition-colors text-sm font-medium">
                  {link.label}
                </a>
              ))}
              <a href="/login">
                <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-xs">
                  Student Login
                </Button>
              </a>
              <a href="/admin">
                <Button size="sm" className="bg-gold hover:bg-gold-dark text-royal-800 font-semibold text-xs">
                  Admin
                </Button>
              </a>
            </div>

            <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-royal-800/95 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} className="block text-white/80 hover:text-gold-light py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
              <a href="/login" className="block"><Button size="sm" variant="outline" className="border-white/30 text-white w-full text-xs">Student Login</Button></a>
              <a href="/admin" className="block"><Button size="sm" className="bg-gold hover:bg-gold-dark text-royal-800 font-semibold w-full">Admin Panel</Button></a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-center gradient-royal overflow-hidden" style={{ paddingTop: announcements.length > 0 ? '36px' : '0' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gold/30 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="bg-gold/20 text-gold-light border-gold/30 mb-6 text-xs px-4 py-1.5">
                <Star className="w-3 h-3 mr-1" /> #1 Coaching Institute in Karad
              </Badge>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
                Transforming{' '}
                <span className="text-gradient-gold">Aspirations</span>
                <br />
                into{' '}
                <span className="text-gradient-gold">Achievements</span>
              </h1>

              <p className="text-lg md:text-xl text-white/70 mb-8 max-w-lg mx-auto lg:mx-0">
                Expert coaching for JEE, NEET & MHT-CET with proven results.
                Limited batches of 50 students for personalized attention.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#courses">
                  <Button size="lg" className="bg-gold hover:bg-gold-dark text-royal-800 font-bold text-base px-8 animate-pulse-gold">
                    Explore Courses <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
                <a href="#contact">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold text-base px-8">
                    <Phone className="w-5 h-5 mr-2" /> Contact Us
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start">
                <Badge variant="outline" className="border-gold/40 text-gold-light bg-gold/5 text-xs py-1.5 px-3">
                  <Users className="w-3 h-3 mr-1" /> Limited 50 Students
                </Badge>
                <Badge variant="outline" className="border-gold/40 text-gold-light bg-gold/5 text-xs py-1.5 px-3">
                  <Brain className="w-3 h-3 mr-1" /> AI Powered Classroom
                </Badge>
                <Badge variant="outline" className="border-gold/40 text-gold-light bg-gold/5 text-xs py-1.5 px-3">
                  <Clock className="w-3 h-3 mr-1" /> Study till 8 PM
                </Badge>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gold/20 to-transparent border border-gold/20 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1718375505724-9bcac5ac25e9?w=600&h=600&fit=crop" alt="Students" className="w-full h-full object-cover rounded-3xl opacity-80" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">500+</p>
                      <p className="text-white/60 text-xs">Students Selected</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -left-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                      <Award className="w-6 h-6 text-gold-light" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">10+</p>
                      <p className="text-white/60 text-xs">Years Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/50" />
        </div>
      </section>

      {/* FOUNDER & DIRECTORS SECTION */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            title="Our Leadership"
            subtitle="Meet the visionary leaders behind Result Wallah's success"
          />

          {/* Founder */}
          {founder && (
            <div className="mb-16">
              <div className="max-w-3xl mx-auto">
                <Card className="overflow-hidden hover-lift border-0 shadow-2xl">
                  <CardContent className="p-0">
                    <div className="gradient-royal p-8 md:p-12">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-gold/50 flex-shrink-0 overflow-hidden shadow-2xl">
                          <img src={founder.photo_url} alt={founder.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center md:text-left">
                          <h3 className="text-3xl font-bold text-white mb-2">{founder.name}</h3>
                          <p className="text-gold-light font-semibold text-lg mb-3">{founder.designation}</p>
                          <Badge className="bg-gold/20 text-gold-light border-gold/30 text-sm px-4 py-1.5 mb-4">
                            <Award className="w-4 h-4 mr-2" />
                            Founder - Vice City Mayor of Karad Nagar Palika
                          </Badge>
                          <p className="text-white/70 leading-relaxed mt-3">{founder.description}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Directors */}
          {directors.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {directors.map((director) => (
                <Card key={director.id} className="overflow-hidden hover-lift border-0 shadow-xl">
                  <CardContent className="p-0">
                    <div className="gradient-royal-light p-8 text-center">
                      <div className="w-36 h-36 mx-auto rounded-full border-4 border-gold/40 overflow-hidden mb-4 shadow-xl">
                        <img src={director.photo_url} alt={director.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">{director.name}</h3>
                      <p className="text-gold-light font-medium mb-2">{director.designation}</p>
                    </div>
                    <div className="p-6 bg-white">
                      <p className="text-gray-600 leading-relaxed text-center">{director.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Additional Staff */}
          {staff.length > 3 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-royal-800 text-center mb-8">Our Expert Faculty</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {staff.slice(3).map(member => (
                  <Card key={member.id} className="hover-lift border-0 shadow-lg text-center">
                    <CardContent className="p-6">
                      <div className="w-20 h-20 mx-auto rounded-full bg-royal-100 border-2 border-royal-200 flex items-center justify-center mb-3 overflow-hidden">
                        {member.photo_url ? (
                          <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-bold text-royal-700">{member.name?.charAt(0)}</span>
                        )}
                      </div>
                      <h4 className="font-semibold text-royal-800">{member.name}</h4>
                      <p className="text-sm text-gray-500">{member.designation}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* TOP PERFORMERS - Right after Leadership */}
      <section id="results" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            title="Our Top Performers"
            subtitle="Celebrating the achievements of our brilliant students"
          />

          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map(result => (
                <Card key={result.id} className="hover-lift border-0 shadow-lg text-center overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-gold to-gold-light" />
                  <CardContent className="p-5">
                    <div className="w-24 h-24 mx-auto rounded-full bg-royal-100 border-3 border-gold flex items-center justify-center mb-3 overflow-hidden shadow-lg">
                      {result.photo_url ? (
                        <img src={result.photo_url} alt={result.student_name} className="w-full h-full object-cover" />
                      ) : (
                        <Trophy className="w-10 h-10 text-gold" />
                      )}
                    </div>
                    <h4 className="font-bold text-royal-800">{result.student_name}</h4>
                    <Badge className="mt-2 text-xs" style={{ backgroundColor: result.exam === 'JEE' ? '#3B82F6' : result.exam === 'NEET' ? '#10B981' : '#8B5CF6', color: 'white' }}>
                      {result.exam}
                    </Badge>
                    {result.percentile && (
                      <p className="text-gold-dark font-bold text-xl mt-2">{result.percentile}%ile</p>
                    )}
                    {result.marks && (
                      <p className="text-gray-500 text-sm">{result.marks} marks</p>
                    )}
                    {result.year && (
                      <p className="text-gray-400 text-xs mt-1">Batch {result.year}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gold/30 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Top performers will be showcased here soon!</p>
              <p className="text-gray-400 text-sm mt-2">Admin can add results from the dashboard</p>
            </div>
          )}
        </div>
      </section>

      {/* BANNER SECTION */}
      {banners.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <BannerCarousel banners={banners} />
          </div>
        </section>
      )}

      {/* COUNTER SECTION */}
      <section className="gradient-royal-light py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatedCounter end={500} label="Students Selected" icon={Trophy} />
            <AnimatedCounter end={10} label="Years Experience" icon={Clock} />
            <AnimatedCounter end={50} label="Expert Faculty" icon={Users} />
            <AnimatedCounter end={95} label="Success Rate" icon={Target} suffix="%" />
          </div>
        </div>
      </section>

      {/* DIRECTOR MESSAGE */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            title="Director's Message"
            subtitle="A message from our leadership about our vision and commitment"
          />
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-royal-800 via-gold to-royal-800" />
              <CardContent className="p-8 md:p-12">
                {settings?.directorMessage ? (
                  <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: settings.directorMessage }} />
                ) : (
                  <div className="space-y-6 text-gray-700">
                    <h3 className="text-2xl font-bold text-royal-800">Welcome to Result Wallah</h3>
                    <p className="leading-relaxed">At Result Wallah, we believe every student has the potential to achieve greatness.</p>
                    <h4 className="text-xl font-semibold text-royal-700">Our Programs</h4>
                    <ul className="space-y-2 list-none">
                      <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> JEE Preparation (Main & Advanced)</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> NEET / NEET Repeater Preparation</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> MHT-CET Preparation</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> IX & X Foundation Courses</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 gradient-royal">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Why Choose Result Wallah?" subtitle="Experience the difference that sets us apart" light />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Limited Batch of 50', desc: 'Personalized attention with strictly limited batch sizes ensuring every student gets individual focus.' },
              { icon: Brain, title: 'AI Powered Classroom', desc: 'State-of-the-art AI connected classrooms for enhanced learning experience and smart assessments.' },
              { icon: Clock, title: 'Study Till 8 PM', desc: 'Extended study hours with supervised self-study sessions and doubt clearing till 8 PM daily.' },
              { icon: Shield, title: 'Biometric Attendance', desc: 'Advanced biometric attendance system ensuring discipline and regular tracking of student presence.' },
              { icon: Target, title: 'Weekly Mock Tests', desc: 'Regular weekly mock tests simulating actual exam patterns with detailed performance analysis.' },
              { icon: Zap, title: 'Result Wallah App', desc: 'Dedicated mobile app for accessing study materials, test results, and staying connected.' },
            ].map((feature, idx) => (
              <Card key={idx} className="glass-card border-white/10 hover-lift bg-white/5 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-gold-light" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Our Courses" subtitle="Comprehensive programs designed for competitive exam excellence" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => {
              const IconComp = ICON_MAP[course.icon] || BookOpen;
              return (
                <Card key={course.id} className="hover-lift border-0 shadow-lg overflow-hidden group">
                  <div className="h-2" style={{ backgroundColor: course.color }} />
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: course.color + '20' }}>
                      <IconComp className="w-7 h-7" style={{ color: course.color }} />
                    </div>
                    <h3 className="text-xl font-bold text-royal-800 mb-3">{course.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{course.description}</p>
                    <div className="space-y-2 mb-6">
                      {(course.features || []).slice(0, 4).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                    <a href="#contact" className="block">
                      <Button className="w-full text-white text-sm font-semibold" style={{ backgroundColor: course.color }}>
                        Enroll Now
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* NOTES DOWNLOAD */}
      <section id="notes" className="py-20 gradient-royal">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <SectionTitle title="Study Notes & Materials" subtitle="Access comprehensive study materials curated by our expert faculty" light />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {['Physics', 'Chemistry', 'Mathematics', 'JEE', 'NEET'].map(subject => (
              <Card key={subject} className="glass-card border-white/10 hover-lift cursor-pointer bg-white/5">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gold/20 flex items-center justify-center mb-3">
                    {subject === 'Physics' && <Atom className="w-6 h-6 text-gold-light" />}
                    {subject === 'Chemistry' && <FlaskConical className="w-6 h-6 text-gold-light" />}
                    {subject === 'Mathematics' && <BookMarked className="w-6 h-6 text-gold-light" />}
                    {subject === 'JEE' && <Zap className="w-6 h-6 text-gold-light" />}
                    {subject === 'NEET' && <HeartPulse className="w-6 h-6 text-gold-light" />}
                  </div>
                  <h4 className="text-white font-semibold text-sm">{subject}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="glass-card border-white/10 rounded-2xl p-8 max-w-lg mx-auto">
            <Download className="w-12 h-12 text-gold-light mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Login Required</h3>
            <p className="text-white/60 mb-6 text-sm">Register as a student to download study notes and materials for free</p>
            <a href="/login">
              <Button className="bg-gold hover:bg-gold-dark text-royal-800 font-semibold px-8">
                Login / Register <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Connect With Us" subtitle="Follow us on social media for updates and tips" />
          <div className="flex justify-center gap-6">
            <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3 p-6 rounded-2xl hover:bg-blue-50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Facebook className="w-8 h-8 text-white" />
              </div>
              <span className="font-medium text-gray-700">Facebook</span>
            </a>
            <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3 p-6 rounded-2xl hover:bg-pink-50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              <span className="font-medium text-gray-700">Instagram</span>
            </a>
            <a href={`https://wa.me/91${contactInfo.whatsapp1?.replace(/^0/, '')}`} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3 p-6 rounded-2xl hover:bg-green-50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <span className="font-medium text-gray-700">WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Get In Touch" subtitle="Have questions? We'd love to hear from you!" />
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                {contactSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-royal-800 mb-2">Thank You!</h3>
                    <p className="text-gray-600">Our team will contact you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                      <Input placeholder="Enter your name" value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))} required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Mobile *</label>
                        <Input placeholder="Your mobile number" value={contactForm.mobile} onChange={e => setContactForm(p => ({ ...p, mobile: e.target.value }))} required />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                        <Input type="email" placeholder="Your email" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Course Interested</label>
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={contactForm.course} onChange={e => setContactForm(p => ({ ...p, course: e.target.value }))}>
                        <option value="">Select a course</option>
                        {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Message</label>
                      <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]" placeholder="Your message..." value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} />
                    </div>
                    <Button type="submit" className="w-full bg-royal-800 hover:bg-royal-700 text-white font-semibold" disabled={contactLoading}>
                      {contactLoading ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-royal-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-royal-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-royal-800 mb-1">Visit Us</h4>
                      <p className="text-gray-600 text-sm">{contactInfo.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h4 className="font-bold text-royal-800 mb-4">WhatsApp Us</h4>
                  <div className="space-y-3">
                    <a href="https://wa.me/919156781002" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">WhatsApp Line 1</p>
                        <p className="text-green-600 text-sm">+91 91567 81002</p>
                      </div>
                    </a>
                    <a href="https://wa.me/919156782003" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">WhatsApp Line 2</p>
                        <p className="text-green-600 text-sm">+91 91567 82003</p>
                      </div>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="gradient-royal py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src={LOGO_URL} alt="RW Logo" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="text-xl font-bold text-white">RESULT WALLAH<sup className="text-[8px] text-gold-light ml-0.5">&trade;</sup></h3>
                  <p className="text-gold-light text-xs">Your Career Is First For Us...</p>
                </div>
              </div>
              <p className="text-white/60 text-sm mb-4 max-w-md">
                Result Wallah is the premier coaching institute in Karad for JEE, NEET, and MHT-CET preparation.
              </p>
              <div className="flex gap-3">
                <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href="https://wa.me/919156781002" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <MessageCircle className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navLinks.map(link => (
                  <li key={link.href}><a href={link.href} className="text-white/60 hover:text-gold-light text-sm transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" /> {link.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Courses</h4>
              <ul className="space-y-2">
                {courses.slice(0, 5).map(c => (
                  <li key={c.id}><a href="#courses" className="text-white/60 hover:text-gold-light text-sm transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" /> {c.name}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <Separator className="bg-white/10 mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">&copy; {new Date().getFullYear()} Result Wallah&trade;. All rights reserved.</p>
            <p className="text-white/40 text-sm">Designed with care for Education Excellence</p>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a href="https://wa.me/919156781002" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all hover:scale-110 animate-pulse-gold">
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
    </div>
  );
}
