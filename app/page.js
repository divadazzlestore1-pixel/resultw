'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap, BookOpen, Users, Trophy, Phone, Mail, MapPin, Menu, X,
  ChevronRight, Star, Download, ArrowRight, Clock, Shield, Zap, Target,
  Award, HeartPulse, Atom, RefreshCw, MessageCircle, Facebook, Instagram,
  Send, CheckCircle, Brain, FlaskConical, BookMarked, ChevronDown, Bell,
  ChevronLeft, ZoomIn, Image as ImageIcon
} from 'lucide-react';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_edu-result-portal/artifacts/yciyivjg_RW_SWAMI%20_FLEX.png';
const ICON_MAP = { 'atom': Atom, 'heart-pulse': HeartPulse, 'graduation-cap': GraduationCap, 'book-open': BookOpen, 'refresh-cw': RefreshCw };

/* ────── Animated Counter ────── */
function AnimatedCounter({ end, label, icon: Icon, suffix = '+' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) return;
    let s = 0; const step = end / 125;
    const t = setInterval(() => { s += step; if (s >= end) { setCount(end); clearInterval(t); } else setCount(Math.floor(s)); }, 16);
    return () => clearInterval(t);
  }, [visible, end]);
  return (
    <div ref={ref} className="text-center p-6">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center"><Icon className="w-8 h-8 text-gold-light" /></div>
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">{count}{suffix}</div>
      <div className="text-white/70 text-sm uppercase tracking-wider">{label}</div>
    </div>
  );
}

/* ────── Section Title ────── */
function SectionTitle({ title, subtitle, light = false }) {
  return (
    <div className="text-center mb-12">
      <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-royal-800'}`}>{title}</h2>
      <div className="w-24 h-1 bg-gold mx-auto mb-4 rounded-full" />
      {subtitle && <p className={`text-lg max-w-2xl mx-auto ${light ? 'text-white/70' : 'text-gray-600'}`}>{subtitle}</p>}
    </div>
  );
}

/* ────── Announcement Bar ────── */
function AnnouncementBar({ announcements }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (announcements.length <= 1) return;
    const t = setInterval(() => setIdx(p => (p + 1) % announcements.length), 4000);
    return () => clearInterval(t);
  }, [announcements.length]);
  if (!announcements.length) return null;
  return (
    <div className="bg-gold text-royal-800 py-2 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <Bell className="w-4 h-4 flex-shrink-0 animate-bounce" />
        <div className="overflow-hidden relative h-6 flex-1 max-w-3xl">
          {announcements.map((a, i) => (
            <p key={a.id} className={`text-sm font-medium text-center absolute inset-0 transition-all duration-500 flex items-center justify-center ${i === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>{a.text}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────── Lazy Image ────── */
function LazyImage({ src, alt, className }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { rootMargin: '200px' });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`relative ${className || ''}`}>
      {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />}
      {inView && <img src={src} alt={alt} className={`${className || ''} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setLoaded(true)} />}
    </div>
  );
}

/* ────── Lightbox ────── */
function Lightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowLeft') onPrev(); if (e.key === 'ArrowRight') onNext(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext]);

  const img = images[currentIndex];
  if (!img) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white z-10"><X className="w-8 h-8" /></button>
      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 z-10"><ChevronLeft className="w-8 h-8" /></button>
          <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 z-10"><ChevronRight className="w-8 h-8" /></button>
        </>
      )}
      <div className="max-w-5xl max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
        <img src={img.image_url} alt={img.caption || 'Gallery'} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
        {img.caption && <p className="text-white text-center mt-4 text-sm">{img.caption}</p>}
        <p className="text-white/50 text-center text-xs mt-1">{currentIndex + 1} / {images.length}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   MAIN PAGE
   ══════════════════════════════ */
export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [staff, setStaff] = useState([]);
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]);
  const [settings, setSettings] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [banners, setBanners] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', mobile: '', email: '', course: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(-1);

  useEffect(() => {
    fetch('/api/staff').then(r => r.json()).then(d => setStaff(d.staff || [])).catch(() => {});
    fetch('/api/courses').then(r => r.json()).then(d => setCourses(d.courses || [])).catch(() => {});
    fetch('/api/results').then(r => r.json()).then(d => setResults(d.results || [])).catch(() => {});
    fetch('/api/settings').then(r => r.json()).then(d => setSettings(d.settings || {})).catch(() => {});
    fetch('/api/announcements?active=true').then(r => r.json()).then(d => setAnnouncements(d.announcements || [])).catch(() => {});
    fetch('/api/banners?active=true').then(r => r.json()).then(d => setBanners(d.banners || [])).catch(() => {});
    fetch('/api/gallery?active=true').then(r => r.json()).then(d => setGallery(d.gallery || [])).catch(() => {});
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault(); setContactLoading(true);
    try {
      await fetch('/api/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contactForm) });
      setContactSubmitted(true); setContactForm({ name: '', mobile: '', email: '', course: '', message: '' });
      setTimeout(() => setContactSubmitted(false), 5000);
    } catch (err) { console.error(err); }
    setContactLoading(false);
  };

  const openLightbox = useCallback((i) => setLightboxIdx(i), []);
  const closeLightbox = useCallback(() => setLightboxIdx(-1), []);
  const prevLightbox = useCallback(() => setLightboxIdx(p => (p - 1 + gallery.length) % gallery.length), [gallery.length]);
  const nextLightbox = useCallback(() => setLightboxIdx(p => (p + 1) % gallery.length), [gallery.length]);

  const navLinks = [
    { label: 'Home', href: '#home' }, { label: 'About', href: '#about' },
    { label: 'Courses', href: '#courses' }, { label: 'Results', href: '#results' },
    { label: 'Gallery', href: '#gallery' }, { label: 'Contact', href: '#contact' },
  ];

  const contactInfo = settings?.contactInfo || {
    address: 'Result Wallah, Karad - Vita Rd, near JK Petrol Pump, Saidapur, Karad, Maharashtra 415124',
    whatsapp1: '09156781002', whatsapp2: '09156782003',
    facebook: 'https://www.facebook.com/p/Result-Wallah-61573986368335',
    instagram: 'https://www.instagram.com/resultwallah7',
  };

  const founder = staff.find(s => s.is_founder);
  const directors = staff.filter(s => !s.is_founder);

  return (
    <div className="min-h-screen bg-white">
      {/* Lightbox */}
      {lightboxIdx >= 0 && <Lightbox images={gallery} currentIndex={lightboxIdx} onClose={closeLightbox} onPrev={prevLightbox} onNext={nextLightbox} />}

      {/* ANNOUNCEMENT BAR */}
      <AnnouncementBar announcements={announcements} />

      {/* ═══ STICKY NAV ═══ */}
      <nav className="sticky top-0 z-50 bg-royal-800 shadow-lg shadow-royal-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            <a href="#home" className="flex items-center space-x-3">
              <img src={LOGO_URL} alt="RW" className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover border-2 border-gold/40" />
              <div>
                <h1 className="text-lg md:text-xl font-bold text-white leading-tight">RESULT WALLAH<sup className="text-[8px] text-gold-light ml-0.5">&trade;</sup></h1>
                <p className="text-[10px] text-gold-light tracking-wider hidden sm:block">Your Career Is First For Us...</p>
              </div>
            </a>
            <div className="hidden lg:flex items-center space-x-7">
              {navLinks.map(l => <a key={l.href} href={l.href} className="text-white/80 hover:text-gold-light transition-colors text-sm font-medium">{l.label}</a>)}
              <a href="/login"><Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-xs">Student Login</Button></a>
              <a href="/admin"><Button size="sm" className="bg-gold hover:bg-gold-dark text-royal-800 font-semibold text-xs">Admin</Button></a>
            </div>
            <button className="lg:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden bg-royal-800 border-t border-white/10 pb-4">
            <div className="px-4 space-y-2 pt-2">
              {navLinks.map(l => <a key={l.href} href={l.href} className="block text-white/80 hover:text-gold-light py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>{l.label}</a>)}
              <div className="flex gap-2 pt-2">
                <a href="/login" className="flex-1"><Button size="sm" variant="outline" className="border-white/30 text-white w-full text-xs">Student Login</Button></a>
                <a href="/admin" className="flex-1"><Button size="sm" className="bg-gold hover:bg-gold-dark text-royal-800 font-semibold w-full text-xs">Admin</Button></a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* 1 ═══ FOUNDER & DIRECTORS ═══ */}
      <section id="about" className="gradient-royal py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Our Leadership" subtitle="Meet the visionary leaders behind Result Wallah's success" light />
          <div className="max-w-5xl mx-auto">
            {founder && (
              <div className="flex justify-center mb-10">
                <div className="text-center max-w-sm">
                  <div className="w-40 h-40 md:w-48 md:h-48 mx-auto rounded-full border-4 border-gold/60 overflow-hidden shadow-2xl shadow-black/30 mb-5">
                    <img src={founder.photo_url} alt={founder.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{founder.name}</h3>
                  <p className="text-gold-light font-semibold text-base mb-3">{founder.designation}</p>
                  <Badge className="bg-gold/20 text-gold-light border-gold/30 text-xs md:text-sm px-4 py-1.5"><Award className="w-4 h-4 mr-1.5" />Founder - Vice City Mayor of Karad Nagar Palika</Badge>
                  {founder.description && <p className="text-white/60 text-sm mt-4 leading-relaxed">{founder.description}</p>}
                </div>
              </div>
            )}
            {directors.length > 0 && (
              <div className="flex flex-wrap justify-center gap-10 md:gap-16">
                {directors.map(d => (
                  <div key={d.id} className="text-center w-64">
                    <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full border-4 border-white/20 overflow-hidden shadow-xl shadow-black/20 mb-4">
                      <img src={d.photo_url} alt={d.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{d.name}</h3>
                    <p className="text-gold-light font-medium text-sm mb-2">{d.designation}</p>
                    {d.description && <p className="text-white/50 text-sm leading-relaxed">{d.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2 ═══ TOP PERFORMERS ═══ */}
      <section id="results" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Our Top Performers" subtitle="Celebrating the achievements of our brilliant students" />
          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {results.map(r => (
                <Card key={r.id} className="hover-lift border-0 shadow-lg text-center overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-gold to-gold-light" />
                  <CardContent className="p-5">
                    <div className="w-20 h-20 mx-auto rounded-full bg-royal-100 border-2 border-gold flex items-center justify-center mb-3 overflow-hidden shadow-lg">
                      {r.photo_url ? <img src={r.photo_url} alt={r.student_name} className="w-full h-full object-cover" /> : <Trophy className="w-8 h-8 text-gold" />}
                    </div>
                    <h4 className="font-bold text-royal-800 text-sm">{r.student_name}</h4>
                    <Badge className="mt-2 text-[10px]" style={{ backgroundColor: r.exam === 'JEE' ? '#3B82F6' : r.exam === 'NEET' ? '#10B981' : '#8B5CF6', color: 'white' }}>{r.exam}</Badge>
                    {r.college && <p className="text-royal-700 font-medium text-xs mt-2">{r.college}</p>}
                    {r.percentile && <p className="text-gold-dark font-bold text-lg mt-1">{r.percentile}%ile</p>}
                    {r.marks && <p className="text-gray-500 text-xs">{r.marks}</p>}
                    {r.year && <p className="text-gray-400 text-[10px] mt-1">Batch {r.year}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12"><Trophy className="w-16 h-16 text-gold/30 mx-auto mb-4" /><p className="text-gray-500">Top performers will be showcased soon!</p></div>
          )}
        </div>
      </section>

      {/* 3 ═══ HERO / CTA ═══ */}
      <section id="home" className="relative py-20 md:py-28 gradient-royal overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gold/30 blur-3xl" /><div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl" /></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="bg-gold/20 text-gold-light border-gold/30 mb-6 text-xs px-4 py-1.5"><Star className="w-3 h-3 mr-1" /> #1 Coaching Institute in Karad</Badge>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">Transforming <span className="text-gradient-gold">Aspirations</span><br/>into <span className="text-gradient-gold">Achievements</span></h2>
              <p className="text-lg md:text-xl text-white/70 mb-8 max-w-lg mx-auto lg:mx-0">Expert coaching for JEE, NEET & MHT-CET with proven results. Limited batches of 50 students.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#courses"><Button size="lg" className="bg-gold hover:bg-gold-dark text-royal-800 font-bold text-base px-8 animate-pulse-gold">Explore Courses <ArrowRight className="w-5 h-5 ml-2" /></Button></a>
                <a href="#contact"><Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold text-base px-8"><Phone className="w-5 h-5 mr-2" /> Contact Us</Button></a>
              </div>
              <div className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start">
                <Badge variant="outline" className="border-gold/40 text-gold-light bg-gold/5 text-xs py-1.5 px-3"><Users className="w-3 h-3 mr-1" /> Limited 50 Students</Badge>
                <Badge variant="outline" className="border-gold/40 text-gold-light bg-gold/5 text-xs py-1.5 px-3"><Brain className="w-3 h-3 mr-1" /> AI Powered Classroom</Badge>
                <Badge variant="outline" className="border-gold/40 text-gold-light bg-gold/5 text-xs py-1.5 px-3"><Clock className="w-3 h-3 mr-1" /> Study till 8 PM</Badge>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gold/20 to-transparent border border-gold/20 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1718375505724-9bcac5ac25e9?w=600&h=600&fit=crop" alt="Students" className="w-full h-full object-cover rounded-3xl opacity-80" loading="lazy" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3"><div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center"><Trophy className="w-6 h-6 text-green-400" /></div><div><p className="text-white font-bold text-lg">500+</p><p className="text-white/60 text-xs">Students Selected</p></div></div>
                </div>
                <div className="absolute -top-4 -left-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3"><div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center"><Award className="w-6 h-6 text-gold-light" /></div><div><p className="text-white font-bold text-lg">10+</p><p className="text-white/60 text-xs">Years Experience</p></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 ═══ COURSES ═══ */}
      <section id="courses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Our Courses" subtitle="Comprehensive programs designed for competitive exam excellence" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(c => {
              const Ic = ICON_MAP[c.icon] || BookOpen;
              return (
                <Card key={c.id} className="hover-lift border-0 shadow-lg overflow-hidden">
                  <div className="h-2" style={{ backgroundColor: c.color }} />
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: c.color + '20' }}><Ic className="w-7 h-7" style={{ color: c.color }} /></div>
                    <h3 className="text-xl font-bold text-royal-800 mb-3">{c.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{c.description}</p>
                    <div className="space-y-2 mb-6">
                      {(c.features || []).slice(0, 4).map((f, i) => <div key={i} className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />{f}</div>)}
                    </div>
                    <a href="#contact"><Button className="w-full text-white text-sm font-semibold" style={{ backgroundColor: c.color }}>Enroll Now</Button></a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5 ═══ GALLERY ═══ */}
      <section id="gallery" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Our Students Gallery" subtitle="A glimpse into life at Result Wallah" />
          {gallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {gallery.map((img, idx) => (
                <Card key={img.id} className="border-0 shadow-lg overflow-hidden group cursor-pointer hover-lift" onClick={() => openLightbox(idx)}>
                  <CardContent className="p-0 relative">
                    <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                      <LazyImage src={img.image_url} alt={img.caption || 'Gallery'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-royal-800/0 group-hover:bg-royal-800/40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <ZoomIn className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    {img.caption && (
                      <div className="p-3 bg-white">
                        <p className="text-sm text-gray-700 font-medium line-clamp-2">{img.caption}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12"><ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Gallery images will appear here soon!</p></div>
          )}
        </div>
      </section>

      {/* 6 ═══ COUNTER ═══ */}
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

      {/* 7 ═══ DIRECTOR MESSAGE ═══ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Director's Message" subtitle="A message from our leadership" />
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-royal-800 via-gold to-royal-800" />
              <CardContent className="p-8 md:p-12">
                {settings?.directorMessage ? (
                  <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: settings.directorMessage }} />
                ) : (
                  <div className="space-y-6 text-gray-700">
                    <h3 className="text-2xl font-bold text-royal-800">Welcome to Result Wallah</h3>
                    <p>At Result Wallah, we believe every student has the potential to achieve greatness.</p>
                    <h4 className="text-xl font-semibold text-royal-700">Our Programs</h4>
                    <ul className="space-y-2 list-none">
                      {['JEE Preparation (Main & Advanced)', 'NEET / NEET Repeater Preparation', 'MHT-CET Preparation', 'IX & X Foundation Courses'].map(p => <li key={p} className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> {p}</li>)}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 8 ═══ WHY CHOOSE US ═══ */}
      <section className="py-20 gradient-royal">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Why Choose Result Wallah?" subtitle="Experience the difference" light />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Limited Batch of 50', desc: 'Personalized attention with strictly limited batch sizes.' },
              { icon: Brain, title: 'AI Powered Classroom', desc: 'State-of-the-art AI connected classrooms for enhanced learning.' },
              { icon: Clock, title: 'Study Till 8 PM', desc: 'Extended study hours with supervised self-study and doubt clearing.' },
              { icon: Shield, title: 'Biometric Attendance', desc: 'Advanced biometric attendance ensuring discipline and tracking.' },
              { icon: Target, title: 'Weekly Mock Tests', desc: 'Regular mock tests simulating actual exam patterns.' },
              { icon: Zap, title: 'Result Wallah App', desc: 'Dedicated mobile app for study materials and results.' },
            ].map((f, i) => (
              <Card key={i} className="glass-card border-white/10 hover-lift bg-white/5 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center mb-4"><f.icon className="w-7 h-7 text-gold-light" /></div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 9 ═══ NOTES ═══ */}
      <section id="notes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <SectionTitle title="Study Notes & Materials" subtitle="Access comprehensive study materials curated by our expert faculty" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {[{n:'Physics',i:Atom},{n:'Chemistry',i:FlaskConical},{n:'Mathematics',i:BookMarked},{n:'JEE',i:Zap},{n:'NEET',i:HeartPulse}].map(s => (
              <Card key={s.n} className="hover-lift border-0 shadow-md cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-royal-100 flex items-center justify-center mb-3"><s.i className="w-6 h-6 text-royal-700" /></div>
                  <h4 className="text-royal-800 font-semibold text-sm">{s.n}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="border-0 shadow-xl max-w-lg mx-auto">
            <CardContent className="p-8 text-center">
              <Download className="w-12 h-12 text-royal-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-royal-800 mb-2">Login Required</h3>
              <p className="text-gray-500 mb-6 text-sm">Register as a student to download study notes for free</p>
              <a href="/login"><Button className="bg-royal-800 hover:bg-royal-700 text-white font-semibold px-8">Login / Register <ArrowRight className="w-4 h-4 ml-2" /></Button></a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 10 ═══ SOCIAL MEDIA ═══ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Connect With Us" subtitle="Follow us on social media" />
          <div className="flex justify-center gap-6 flex-wrap">
            {[
              { href: contactInfo.facebook, icon: Facebook, bg: 'bg-blue-600', hbg: 'hover:bg-blue-50', label: 'Facebook' },
              { href: contactInfo.instagram, icon: Instagram, bg: 'bg-gradient-to-br from-purple-600 to-pink-500', hbg: 'hover:bg-pink-50', label: 'Instagram' },
              { href: 'https://wa.me/919156781002', icon: MessageCircle, bg: 'bg-green-500', hbg: 'hover:bg-green-50', label: 'WhatsApp' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={`group flex flex-col items-center gap-3 p-6 rounded-2xl ${s.hbg} transition-colors`}>
                <div className={`w-16 h-16 rounded-full ${s.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}><s.icon className="w-8 h-8 text-white" /></div>
                <span className="font-medium text-gray-700">{s.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 11 ═══ CONTACT ═══ */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Get In Touch" subtitle="Have questions? We'd love to hear from you!" />
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                {contactSubmitted ? (
                  <div className="text-center py-12"><div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4"><CheckCircle className="w-10 h-10 text-green-500" /></div><h3 className="text-2xl font-bold text-royal-800 mb-2">Thank You!</h3><p className="text-gray-600">Our team will contact you shortly.</p></div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    <div><label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label><Input placeholder="Enter your name" value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))} required /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium text-gray-700 mb-1 block">Mobile *</label><Input placeholder="Your mobile" value={contactForm.mobile} onChange={e => setContactForm(p => ({ ...p, mobile: e.target.value }))} required /></div>
                      <div><label className="text-sm font-medium text-gray-700 mb-1 block">Email</label><Input type="email" placeholder="Your email" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} /></div>
                    </div>
                    <div><label className="text-sm font-medium text-gray-700 mb-1 block">Course Interested</label>
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={contactForm.course} onChange={e => setContactForm(p => ({ ...p, course: e.target.value }))}><option value="">Select a course</option>{courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select>
                    </div>
                    <div><label className="text-sm font-medium text-gray-700 mb-1 block">Message</label><textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]" placeholder="Your message..." value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} /></div>
                    <Button type="submit" className="w-full bg-royal-800 hover:bg-royal-700 text-white font-semibold" disabled={contactLoading}>{contactLoading ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4 ml-2" /></Button>
                  </form>
                )}
              </CardContent>
            </Card>
            <div className="space-y-6">
              <Card className="border-0 shadow-lg"><CardContent className="p-6"><div className="flex items-start gap-4"><div className="w-12 h-12 rounded-xl bg-royal-100 flex items-center justify-center flex-shrink-0"><MapPin className="w-6 h-6 text-royal-700" /></div><div><h4 className="font-bold text-royal-800 mb-1">Visit Us</h4><p className="text-gray-600 text-sm">{contactInfo.address}</p></div></div></CardContent></Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h4 className="font-bold text-royal-800 mb-4">WhatsApp Us</h4>
                  <div className="space-y-3">
                    {[{ num: '919156781002', label: 'Line 1', display: '+91 91567 81002' }, { num: '919156782003', label: 'Line 2', display: '+91 91567 82003' }].map(w => (
                      <a key={w.num} href={`https://wa.me/${w.num}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center"><MessageCircle className="w-5 h-5 text-white" /></div>
                        <div><p className="font-semibold text-gray-800 text-sm">WhatsApp {w.label}</p><p className="text-green-600 text-sm">{w.display}</p></div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 12 ═══ FOOTER ═══ */}
      <footer className="gradient-royal py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src={LOGO_URL} alt="RW" className="w-10 h-10 rounded-full object-cover" />
                <div><h3 className="text-xl font-bold text-white">RESULT WALLAH<sup className="text-[8px] text-gold-light ml-0.5">&trade;</sup></h3><p className="text-gold-light text-xs">Your Career Is First For Us...</p></div>
              </div>
              <p className="text-white/60 text-sm mb-4 max-w-md">Result Wallah is the premier coaching institute in Karad for JEE, NEET, and MHT-CET preparation.</p>
              <div className="flex gap-3">
                {[{ href: contactInfo.facebook, icon: Facebook }, { href: contactInfo.instagram, icon: Instagram }, { href: 'https://wa.me/919156781002', icon: MessageCircle }].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><s.icon className="w-5 h-5 text-white" /></a>
                ))}
              </div>
            </div>
            <div><h4 className="text-white font-bold mb-4">Quick Links</h4><ul className="space-y-2">{navLinks.map(l => <li key={l.href}><a href={l.href} className="text-white/60 hover:text-gold-light text-sm transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" />{l.label}</a></li>)}</ul></div>
            <div><h4 className="text-white font-bold mb-4">Courses</h4><ul className="space-y-2">{courses.slice(0, 5).map(c => <li key={c.id}><a href="#courses" className="text-white/60 hover:text-gold-light text-sm transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" />{c.name}</a></li>)}</ul></div>
          </div>
          <Separator className="bg-white/10 mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">&copy; {new Date().getFullYear()} Result Wallah&trade;. All rights reserved.</p>
            <p className="text-white/40 text-sm">Designed with care for Education Excellence</p>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a href="https://wa.me/919156781002" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all hover:scale-110 animate-pulse-gold"><MessageCircle className="w-7 h-7 text-white" /></a>
    </div>
  );
}
