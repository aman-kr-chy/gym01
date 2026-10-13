import React, { Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X, Dumbbell, Orbit, Instagram, Facebook, Mail, MapPin, Phone, Check, Star, MoveUpRight, Play, Pause } from 'lucide-react';
import { gym, images } from './config.js';
import heroVideoUrl from '../gym viedo.mp4';
import './style.css';

const GymScene = React.lazy(() => import('./GymScene.jsx'));
const WorkoutScene = React.lazy(() => import('./WorkoutScene.jsx'));

function WorkoutFeature() {
  const host = React.useRef(null);
  const [active, setActive] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [exercise, setExercise] = useState('Deadlift');
  useEffect(() => {
    if (!host.current || !('IntersectionObserver' in window)) { setActive(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setActive(true); observer.disconnect(); }
    }, { rootMargin: '140px' });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return <div className="workout-layer" ref={host}>
    {active && <Suspense fallback={<div className="workout-loading"/>}><WorkoutScene paused={!playing} exercise={exercise}/></Suspense>}
    <div className="workout-label"><span className="live-dot"/>{exercise.toUpperCase()} / {playing ? 'IN MOTION' : 'PAUSED'}</div>
    <button className="workout-toggle" type="button" onClick={() => setPlaying(value => !value)} aria-pressed={!playing} aria-label={playing ? 'Pause the deadlift animation' : 'Play the deadlift animation'}>{playing ? <Pause size={13}/> : <Play size={13}/>}<span>{playing ? 'PAUSE REP' : 'PLAY REP'}</span></button>
    <div className="workout-exercises" role="group" aria-label="Choose a workout animation">{['Deadlift','Squat','Curl'].map(name=><button key={name} type="button" className={exercise===name?'selected':''} onClick={()=>setExercise(name)} aria-pressed={exercise===name}>{name}</button>)}</div>
    <div className="workout-drag">DRAG TO ROTATE</div>
  </div>;
}

const nav = [['About', '#about'], ['Facilities', '#facilities'], ['Coaches', '#coaches'], ['Membership', '#membership'], ['Gallery', '#gallery']];

function DeferredScene() {
  const host = React.useRef(null);
  const [nearby, setNearby] = useState(false);
  useEffect(() => {
    if (!host.current || !('IntersectionObserver' in window)) { setNearby(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearby(true); observer.disconnect(); }
    }, { rootMargin: '220px' });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return <div className="scene-host" ref={host}>{nearby ? <Suspense fallback={<div className="scene-loading">PREPARING YOUR VIEW...</div>}><GymScene/></Suspense> : <div className="scene-loading">3D EQUIPMENT VIEW</div>}</div>;
}

function HeroPhoto() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  return <div className="hero-photo">
    <video className="hero-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src={heroVideoUrl} type="video/mp4"/></video>
    <div className="hero-photo-caption"><span className="live-dot"/> REAL PEOPLE. REAL PROGRESS.</div>
    <button className="hero-photo-hotspot" type="button" aria-expanded={detailsOpen} onClick={()=>setDetailsOpen(value=>!value)}><span>{detailsOpen?'−':'+'}</span>{detailsOpen?'CLOSE FLOOR NOTE':'MEET THE FLOOR'}</button>
    {detailsOpen&&<div className="hero-photo-detail"><strong>TRAINING, TOGETHER.</strong><span>Real members. Real effort. Find your place at FitPlanet.</span><a href="#facilities" onClick={()=>setDetailsOpen(false)}>Explore the gym <ArrowRight size={14}/></a></div>}
  </div>;
}

function Brand({ footer = false }) {
  return <a className={`brand ${footer ? 'brand-footer' : ''}`} href="#home" aria-label="FitPlanet Gym home"><svg className="brand-logo" viewBox="0 0 390 82" role="img" aria-label="FP Fit Planet"><circle className="brand-logo-ring" cx="40" cy="41" r="35"/><circle className="brand-logo-disc" cx="40" cy="41" r="30"/><text className="brand-logo-initials" x="40" y="48" textAnchor="middle">FP</text><text className="brand-logo-name" x="83" y="59">Fit Planet</text></svg></a>;
}

const facilities = [
  ['01', 'Strength floor', 'Progressive strength starts with premium free weights and thoughtfully zoned training space.', 'photo-1583454110551-21f2fa2afe61'],
  ['02', 'Performance studio', 'Move with purpose in a dedicated space for conditioning, mobility, and group sessions.', 'photo-1571902943202-507ec2618e8f'],
  ['03', 'Recovery & reset', 'Make room for recovery with a calm post-session zone designed to keep you moving.', 'photo-1540497077202-7c8a3999166f']
];
const coaches = [
  ['01', 'Strength & conditioning', 'Coach Alex Morgan', images.trainers[0]],
  ['02', 'Mobility & performance', 'Coach Sam Rivera', images.trainers[1]],
  ['03', 'Personal training', 'Coach Jordan Lee', images.trainers[2]]
];
const reviews = [
  ['“The coaching keeps me consistent, and the space makes every session feel like time well spent.”', 'Aarav K.', 'Member since 2024'],
  ['“I started with the basics and found a community that makes showing up the best part of my day.”', 'Meera S.', 'Member since 2023'],
  ['“Great equipment, thoughtful trainers, and a plan that actually fits my life.”', 'Rohan P.', 'Member since 2025']
];

function FloatingContact() {
  const digits = gym.phone.replace(/\D/g, '');
  const callNumber = gym.phone.replace(/[^\d+]/g, '');
  return <aside className="floating-contact" aria-label="Contact FitPlanet Gym">
    <a className="floating-whatsapp" href={`https://wa.me/${digits}?text=Hello%20FitPlanet%20Gym`} target="_blank" rel="noreferrer" aria-label={`Chat with FitPlanet Gym on WhatsApp at ${gym.phone}`}><span className="whatsapp-mark" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false"><path d="M16 4.2a11.3 11.3 0 0 0-9.6 17.3L5 27l5.7-1.4A11.3 11.3 0 1 0 16 4.2Z"/><path d="M11.7 10.2c.3-.7.7-.7 1-.7h.7c.3 0 .5.1.7.6l1 2.4c.1.4.1.6-.1.9l-.8 1c-.2.2-.3.4-.1.7.3.5 1 1.5 2.1 2.4 1.3 1.1 2.4 1.4 2.8 1.6.3.1.5.1.7-.2l1-1.2c.2-.3.5-.3.8-.2l2.3 1.1c.3.2.5.3.5.6s-.2 1.6-.9 2.2c-.6.6-1.4.9-2.3.8-1.3-.2-3.1-.8-5.3-2.7-2.7-2.3-4.4-5.1-4.6-6.4-.3-1.3.1-2.3.5-2.9Z"/></svg></span><span>WhatsApp</span></a>
    <a className="floating-call" href={`tel:${callNumber}`} aria-label={`Call FitPlanet Gym at ${gym.phone}`}><Phone size={18}/><span>Call us</span></a>
  </aside>;
}

function BookingEnquiryForm() {
  const [notice, setNotice] = useState('');
  function submitBooking(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const booking = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      date: formData.get('date'),
      type: formData.get('type'),
      branch: formData.get('branch')
    };
    const message = `Hi FitPlanet Gym, I’d like to request a seat.\nName: ${booking.name}\nPhone: ${booking.phone}\nPreferred date: ${booking.date}\nBooking: ${booking.type}\nPreferred branch: ${booking.branch}`;
    const digits = gym.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setNotice('Your request is ready in WhatsApp. Send the message and the gym will confirm availability.');
  }

  return <form className="booking-card" onSubmit={submitBooking}>
    <div className="eyebrow"><span/> SAVE YOUR PLACE</div>
    <h3>BOOK A<br/><em>GYM VISIT.</em></h3>
    <p>Send us your details and preferred date. We’ll reply to confirm your seat.</p>
    <div className="booking-fields">
      <label>Your name<input name="name" type="text" autoComplete="name" placeholder="Full name" required/></label>
      <label>Phone number<input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="Your contact number" required/></label>
      <label>Preferred date<input name="date" type="date" required/></label>
      <label>What would you like to book?<select name="type" defaultValue="" required><option value="" disabled>Choose an option</option><option>Free trial session</option><option>Gym tour</option><option>Group class</option><option>Personal training consultation</option></select></label>
      <label className="booking-branch">Choose a branch<select name="branch" defaultValue="" required><option value="" disabled>Select a location</option>{gym.branches.map(branch=><option key={branch.name}>{branch.name}</option>)}</select></label>
    </div>
    <button className="button button-orange booking-submit" type="submit">Request my seat <ArrowRight size={17}/></button>
    <p className="booking-note" aria-live="polite">{notice || 'Your seat is confirmed once our team replies.'}</p>
  </form>;
}

function Header() {
  const [open, setOpen] = useState(false); const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 24); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  return <header className={scrolled ? 'header scrolled' : 'header'}><div className="nav-wrap"><Brand/><button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button><nav className={open ? 'nav-links open' : 'nav-links'}>{nav.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}<a href="#contact" className="nav-cta" onClick={() => setOpen(false)}>Start your journey <ArrowUpRight size={15}/></a></nav></div></header>;
}

function App() {
  const [activeReview, setActiveReview] = useState(0);
  return <><Header/><main>
    <section className="hero" id="home" style={{ '--hero-image': `url(${images.heroBackground})` }}><div className="hero-shade"/><HeroPhoto/><div className="hero-inner"><div className="hero-copy"><div className="eyebrow"><span/> YOUR NEW TRAINING GROUND</div><h1>TRANSFORM<br/>YOUR BODY.<br/><em>ELEVATE YOUR LIFE.</em></h1><p>Welcome to FitPlanet Gym, where world-class equipment, expert trainers, and a motivating environment help you reach your fitness goals.</p><div className="hero-actions"><a className="button button-orange" href="#membership">Join FitPlanet <ArrowRight size={17}/></a><a className="button button-ghost" href="#about"><span className="play-icon">↘</span> Explore our gym</a></div><div className="hero-proof"><div className="avatar-stack"><i>A</i><i>M</i><i>J</i><i>+</i></div><div><strong>YOUR PEOPLE. YOUR PACE.</strong><span>Find your community on the floor.</span></div></div></div><div className="hero-side-note"><span>FITNESS, IN A NEW ORBIT</span><b>01 / 09</b></div><a href="#about" className="scroll-cue"><ArrowDown size={14}/> SCROLL TO EXPLORE</a></div><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/></section>

    <section className="ticker" aria-label="Gym tagline"><div>{Array.from({length: 4}, (_, i) => <span key={i}>YOUR PLANET <i>✳</i> YOUR FITNESS <i>✳</i> YOUR FUTURE <i>✳</i></span>)}</div></section>

    <section className="about section-pad" id="about"><div className="container about-grid"><div className="about-art"><div className="about-photo" style={{backgroundImage:`url(${images.about})`}} role="img" aria-label="Athlete preparing for a barbell deadlift"/><WorkoutFeature/><div className="about-stamp"><Orbit size={25}/><span>MOVE<br/>WITH<br/>PURPOSE</span></div><div className="image-index">FP / 001 <span>—</span> THE MINDSET</div></div><div className="about-copy"><div className="eyebrow dark"><span/> MEET YOUR NEW HOME</div><h2>BUILT FOR<br/>YOUR <em>NEXT.</em></h2><p className="lead">FitPlanet is where ambition finds its rhythm.</p><p>We believe training should meet you where you are and take you somewhere new. From your first rep to your next personal best, our expert coaches, considered spaces, and welcoming community help you build a routine that lasts.</p><a className="text-link" href="#facilities">Discover the FitPlanet difference <ArrowRight size={17}/></a><div className="stats"><div><strong>01<span>—</span></strong><small>YOUR GOALS, FIRST</small></div><div><strong>100<span>%</span></strong><small>HERE FOR YOUR PROGRESS</small></div><div><strong>∞</strong><small>WAYS TO GET STRONGER</small></div></div></div></div></section>

    <section className="facilities section-pad" id="facilities"><div className="container"><div className="section-heading"><div><div className="eyebrow"><span/> MADE TO MOVE</div><h2>SPACE TO <em>LEVEL UP.</em></h2></div><p>Everything you need to train with intention, get expert support, and make every session count.</p></div><div className="facility-grid">{facilities.map(([num,title,desc,id],i)=><article className="facility-card" key={num}><div className="facility-photo" style={{backgroundImage:`url(https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=80)`}}><span className="card-number">{num} / 03</span><span className="card-arrow"><ArrowUpRight/></span></div><div className="facility-info"><span>FITPLANET / FACILITY 0{i+1}</span><h3>{title}</h3><p>{desc}</p></div></article>)}</div></div></section>

    <section className="experience" id="experience"><div className="container experience-grid"><div className="experience-copy"><div className="eyebrow"><span/> STEP INTO THE ORBIT</div><h2>A NEW<br/>ANGLE ON<br/><em>STRENGTH.</em></h2><p>Take the floor for a spin. Meet the tools that bring your next breakthrough within reach.</p><div className="drag-hint"><span>↔</span> DRAG TO EXPLORE</div><div className="scene-legend"><span><i/> PRECISION EQUIPMENT</span><span><i/> DESIGNED TO PERFORM</span></div></div><div className="scene-frame"><div className="scene-topline"><span>FP / 3D EQUIPMENT STUDY</span><span>INTERACTIVE VIEW <b>●</b></span></div><DeferredScene/><div className="scene-caption"><span>THE POWER OF YOUR NEXT REP.</span><span>01 — 03</span></div><div className="scene-glow"/></div></div></section>

    <section className="coaches section-pad" id="coaches"><div className="container"><div className="section-heading"><div><div className="eyebrow dark"><span/> GOOD PEOPLE. GREAT COACHES.</div><h2>IN YOUR <em>CORNER.</em></h2></div><p>Real coaching that listens first, meets you where you are, and helps you go further.</p></div><div className="coach-grid">{coaches.map(([num,role,name,img])=><article className="coach-card" key={num}><div className="coach-image"><img src={img} alt={`${name}, ${role} coach`} loading="lazy"/><span>{num}</span><a href="#contact" aria-label={`Ask about training with ${name}`}><ArrowUpRight size={20}/></a></div><div className="coach-info"><span>{role}</span><h3>{name}</h3></div></article>)}</div><div className="coach-bottom"><span>YOUR GOALS HAVE A TEAM.</span><a className="text-link" href="#contact">Meet your coach <ArrowRight size={17}/></a></div></div></section>

    <section className="membership section-pad" id="membership"><div className="container"><div className="membership-heading"><div className="eyebrow"><span/> FIND YOUR FIT</div><h2>CHOOSE YOUR<br/><em>OWN ORBIT.</em></h2><p>Start with a plan that works for you. Make it yours as you grow.</p></div><div className="plan-grid">{gym.plans.map((plan,i)=><article className={`plan-card ${plan.featured?'featured':''}`} key={plan.name}>{plan.featured&&<div className="plan-popular">MEMBER FAVOURITE <span>✳</span></div>}<div className="plan-index">0{i+1} / MEMBERSHIP</div><h3>{plan.name}</h3><p className="plan-description">{plan.description}</p><div className="plan-price"><sup>{gym.currency}</sup>{plan.price}<span>{plan.period}</span></div><a href="#contact" className={plan.featured?'button button-orange':'button button-outline'}>Choose {plan.name} <ArrowRight size={16}/></a><div className="plan-divider"/><ul>{plan.features.map(f=><li key={f}><Check size={16}/>{f}</li>)}</ul></article>)}</div><p className="price-note">Membership prices shown are placeholders. Contact the gym to confirm current offers.</p></div></section>

    <section className="gallery section-pad" id="gallery"><div className="container"><div className="section-heading"><div><div className="eyebrow"><span/> THE FLOOR, UP CLOSE</div><h2>BUILT TO <em>INSPIRE.</em></h2></div><a className="text-link" href="#contact">See it in person <ArrowRight size={17}/></a></div><div className="gallery-grid">{images.gallery.map((img,i)=><a href="#contact" className={`gallery-item gallery-${i+1}`} key={img} aria-label={`Visit FitPlanet Gym to see gallery photo ${i+1}`}><img src={img} alt={['Premium gym equipment and strength floor','Bright group training studio','Modern functional training space','Members training with free weights','Strength training area','Gym members working out'][i] || `FitPlanet Gym gallery photo ${i+1}`} loading="lazy"/><span>FITPLANET / SPACE 0{i+1}<ArrowUpRight size={17}/></span></a>)}</div></div></section>

    <section className="testimonials section-pad" id="testimonials"><div className="container testimonial-grid"><div className="testimonial-intro"><div className="eyebrow"><span/> WORD FROM THE FLOOR</div><h2>MADE BETTER<br/><em>TOGETHER.</em></h2><div className="review-controls"><button onClick={()=>setActiveReview((activeReview+reviews.length-1)%reviews.length)} aria-label="Previous testimonial">←</button><span>0{activeReview+1} <i>/</i> 0{reviews.length}</span><button onClick={()=>setActiveReview((activeReview+1)%reviews.length)} aria-label="Next testimonial">→</button></div></div><article className="review-card" aria-live="polite"><div className="stars">{Array.from({length:5},(_,i)=><Star key={i} size={15} fill="currentColor"/>)}</div><blockquote>{reviews[activeReview][0]}</blockquote><div className="review-author"><div className="review-avatar">{reviews[activeReview][1][0]}</div><div><strong>{reviews[activeReview][1]}</strong><span>{reviews[activeReview][2]}</span></div><span className="review-mark">“</span></div></article></div></section>

    <section className="contact section-pad" id="contact"><div className="container"><div className="branch-heading"><div className="eyebrow"><span/> FIND YOUR NEAREST FITPLANET</div><h2>THREE LOCATIONS.<br/><em>ONE COMMUNITY.</em></h2></div><div className="branch-grid">{gym.branches.map((branch,index)=><article className="branch-card" key={branch.name}><div className="branch-map"><iframe src={branch.mapEmbed} title={`Map showing FitPlanet Gym ${branch.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/></div><div className="branch-info"><span className="branch-number">0{index+1} / PATNA</span><h3>{branch.name}</h3><p>{branch.address}</p><a href={branch.mapUrl} target="_blank" rel="noreferrer">OPEN IN GOOGLE MAPS <MoveUpRight size={15}/></a></div></article>)}</div><div className="contact-grid"><div className="contact-copy"><div className="eyebrow"><span/> THE FIRST REP STARTS HERE</div><h2>READY TO<br/>FIND YOUR<br/><em>FITPLANET?</em></h2><p>Tell us what you’re working toward. We’ll help you find your next step.</p><div className="contact-details"><a href={`tel:${gym.phone.replaceAll(' ','')}`}><Phone size={16}/><span>{gym.phone}</span></a><a href={`mailto:${gym.email}`}><Mail size={16}/><span>{gym.email}</span></a><a href={gym.mapUrl} target="_blank" rel="noreferrer"><MapPin size={16}/><span>{gym.address}</span><MoveUpRight size={14}/></a></div></div><BookingEnquiryForm/></div></div></section>
    <section className="final-cta"><div className="container final-inner"><span>YOUR NEXT CHAPTER IS IN MOTION.</span><a href="#membership">FIND YOUR PLAN <ArrowUpRight size={17}/></a></div></section>
  </main><footer className="footer"><div className="container footer-main"><div className="footer-brand-col"><Brand footer/><p>{gym.tagline}</p><div className="social-links"><a href="#contact" aria-label="Instagram"><Instagram size={17}/></a><a href="#contact" aria-label="Facebook"><Facebook size={17}/></a></div></div><div className="footer-nav"><span>EXPLORE</span>{nav.map(([n,h])=><a href={h} key={h}>{n}</a>)}</div><div className="footer-nav"><span>OUR LOCATIONS</span>{gym.branches.map((branch,index)=><details className="footer-branch" key={branch.name}><summary><i>0{index+1}</i>{branch.name}<ArrowDown size={12}/></summary><div><p>{branch.address}</p><a href={branch.mapUrl} target="_blank" rel="noreferrer">DIRECTIONS <MoveUpRight size={12}/></a></div></details>)}<a href={`tel:${gym.phone.replaceAll(' ','')}`}>{gym.phone}</a><a href={`mailto:${gym.email}`}>{gym.email}</a></div><a className="back-top" href="#home">BACK TO TOP ↑</a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} FITPLANET GYM. ALL RIGHTS RESERVED.</span><span>YOUR PLANET. YOUR FITNESS. YOUR FUTURE.</span></div></footer><FloatingContact/></>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
