import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowUpRight, ArrowRight, Check, MapPin, Mail, Phone, Menu, X, ChevronDown, MoveUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { services, email } from '@/lib/company';
import logo from '@/assets/logo.asset.json';
import innocentia from '@/assets/innocentia.asset.json';
import phakamani from '@/assets/phakamani.asset.json';
import technology from '@/assets/technology.jpg';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'iTheku Tech-Enterprise | Software, AI & Digital Solutions' },
    { name: 'description', content: 'Your Enterprise, Our priority. Durban-based, 100% black-owned technology company delivering custom software, web and mobile applications, AI and business automation.' },
    { property: 'og:title', content: 'iTheku Tech-Enterprise | Your Enterprise, Our priority.' },
    { property: 'og:description', content: 'Custom software, intelligent solutions and a technology partner invested in your growth. Meet iTheku Tech-Enterprise, Durban.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

const filters = ['All services', 'Development', 'AI & Automation', 'Infrastructure', 'Design & Strategy', 'Support & Quality'];
const nav = [['Services', '#services'], ['About us', '#about'], ['Our approach', '#approach'], ['Our team', '#team']];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('All services');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [interest, setInterest] = useState('Custom Software Development');
  const [message, setMessage] = useState('');
  return <div>
    <header className="site-header">
      <div className="container header-inner">
        <a href="#home" className="logo-link" aria-label="iTheku Tech-Enterprise home"><img src={logo.url} alt="iTheku Tech-Enterprise — Your Enterprise, Our priority." width={970} height={845} /></a>
        <nav aria-label="Main navigation" className="desktop-nav">{nav.map(([label, href]) => <a href={href} key={label}>{label}</a>)}</nav>
        <Button asChild className="header-cta"><a href="#contact">Let’s talk <ArrowUpRight /></a></Button>
        <Button variant="ghost" size="icon" className="mobile-menu-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      </div>
      {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{[...nav, ['Let’s talk', '#contact']].map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={16} /></a>)}</nav>}
    </header>

    <main>
      <section id="home" className="hero">
        <img className="hero-image" src={technology} alt="Precision gold circuitry and a processor on a graphite board" width={1920} height={1024} />
        <div className="hero-shade" />
        <div className="container hero-content">
          <div className="eyebrow hero-eyebrow"><span className="small-line" /> TECHNOLOGY WITH PURPOSE</div>
          <h1>iTheku<br /><span>Tech-Enterprise</span></h1>
          <p className="hero-motto">Your Enterprise, <span>Our priority.</span></p>
          <p className="hero-description">From custom software to intelligent AI solutions,<br className="desktop-break" /> we build the technology that moves your business forward.</p>
          <div className="hero-actions"><Button asChild size="lg"><a href="#contact">Let’s build your solution <ArrowUpRight /></a></Button><a className="hero-services" href="#services">Explore our services <ArrowRight size={17} /></a></div>
          <div className="hero-location"><MapPin size={14} /> Rooted in Durban. Built for your business.</div>
        </div>
        <a className="hero-scroll" href="#services" aria-label="Scroll to services"><ChevronDown size={20} /></a>
      </section>

      <div className="trust-band"><div className="container trust-inner"><span><span className="gold-dot" /> 100% BLACK-OWNED</span><span>BUSINESS-FIRST THINKING</span><span>END-TO-END SOLUTIONS</span><span>LONG-TERM PARTNERSHIPS</span></div></div>

      <section id="services" className="section container">
        <div className="section-heading"><div><div className="eyebrow">01 / OUR EXPERTISE</div><h2>One partner.<br /><span className="text-muted-foreground">Every digital possibility.</span></h2></div><p>From your first idea to your next big milestone, we bring the right expertise to every stage of your digital journey.</p></div>
        <div className="filter-bar" aria-label="Filter services">{filters.map(item => <Button variant="ghost" key={item} onClick={() => { setFilter(item); setExpanded(null); }} aria-pressed={filter === item} className={filter === item ? 'filter-button filter-active' : 'filter-button'}>{item}{item === 'All services' && <span className="filter-count">13</span>}</Button>)}</div>
        <div className="services-grid">{services.filter(s => filter === 'All services' || s.category === filter).map((s) => <article className="service-card" key={s.title}>
          <div className="service-top"><s.icon size={27} strokeWidth={1.4} /><span>{String(services.indexOf(s) + 1).padStart(2, '0')}</span></div>
          <h3>{s.title}</h3><p>{s.description}</p>
          <Button variant="ghost" className="service-link" aria-expanded={expanded === s.title} onClick={() => setExpanded(expanded === s.title ? null : s.title)}>{expanded === s.title ? 'Close details' : 'Explore service'}{expanded === s.title ? <X /> : <ArrowUpRight />}</Button>
          {expanded === s.title && <div className="service-details"><ul>{s.items.map(item => <li key={item}><Check size={13} />{item}</li>)}</ul><a href="#contact" onClick={() => setInterest(s.title)}>Discuss this service <ArrowRight size={14} /></a></div>}
        </article>)}</div>
        <div className="service-bottom"><p>Not sure where to start? Let’s find the right solution together.</p><a href="#contact">Talk to our team <ArrowUpRight size={16} /></a></div>
      </section>

      <section id="about" className="about-band"><div className="container about-layout"><div><div className="eyebrow">02 / THE ITHEKU DIFFERENCE</div><h2>Technology is our craft.<br /><span>Your business is our focus.</span></h2></div><div className="about-copy"><p>We are iTheku Tech-Enterprise — a 100% black-owned technology company based in Durban, South Africa.</p><p>We design, develop, and maintain digital solutions around your specific business requirements. Our work connects software, intelligence, and people to create practical value for your enterprise.</p><div className="about-promise"><span className="small-line" /> Your Enterprise, Our priority.</div></div></div></section>

      <section id="approach" className="section container"><div className="section-heading"><div><div className="eyebrow">03 / HOW WE WORK</div><h2>From possibility<br />to a working solution.</h2></div><p>A considered approach. Clear communication. A solution built around what your business actually needs.</p></div><div className="process-grid">{[
        ['Discover', 'We listen first. Together, we understand your goals, challenges, and the people who will use your solution.'],
        ['Design', 'We turn your requirements into a clear plan, thoughtful experiences, and a solid product architecture.'],
        ['Build & test', 'We develop your solution and test it carefully for functionality, performance, and reliability.'],
        ['Launch & evolve', 'We help you go live, then maintain, support, and improve your software as your business grows.'],
      ].map(([title, desc], i) => <div className="process-item" key={title}><div className="process-number">0{i + 1}<ArrowRight size={18} /></div><h3>{title}</h3><p>{desc}</p></div>)}</div></section>

      <section id="team" className="team-band"><div className="container section"><div className="section-heading"><div><div className="eyebrow">04 / THE PEOPLE BEHIND ITHEKU</div><h2>Driven by purpose.<br />Led by people.</h2></div><p>Meet the founders and directors building a technology company with your enterprise at its heart.</p></div><div className="team-grid">{[[innocentia.url, 'Vhulenda Innocentia Nefolovhodwe'], [phakamani.url, 'Phakamani Mbatha']].map(([image, person]) => <article className="team-member" key={person}><img src={image} alt={person} loading="lazy" width={600} height={700} /><div className="team-caption"><div><h3>{person}</h3><p>Co-Founder & Director</p></div><span><MoveUpRight size={22} /></span></div></article>)}</div></div></section>

      <section id="contact" className="section container contact-layout"><div><div className="eyebrow">05 / LET’S START A CONVERSATION</div><h2>Your next chapter.<br /><span className="text-muted-foreground">Built together.</span></h2><p className="contact-intro">Have an idea, a challenge, or a project in mind?<br />Let’s talk about what’s possible.</p><div className="contact-details"><a href={`mailto:${email}`}><Mail size={20} /><span><small>EMAIL US</small>{email}</span></a><a href="tel:+27699874907"><Phone size={20} /><span><small>CALL US</small>069 987 4907</span></a><a href="https://www.google.com/maps/search/?api=1&query=300+Apline+Road+Springfield+Durban+4091" target="_blank" rel="noreferrer"><MapPin size={20} /><span><small>FIND US</small>300 Apline Road, Springfield<br />Durban, 4091, South Africa</span></a></div></div>
        <form className="contact-form" onSubmit={e => { e.preventDefault(); const body = `Name: ${name}\nEmail: ${address}\nService: ${interest}\n\n${message}`; window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Project enquiry: ${interest}`)}&body=${encodeURIComponent(body)}`; }}><div className="form-row"><label>Your name<input required name="name" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" autoComplete="name" /></label><label>Email address<input required type="email" name="email" value={address} onChange={e => setAddress(e.target.value)} placeholder="you@company.com" autoComplete="email" /></label></div><label>What can we help you with?<select value={interest} onChange={e => setInterest(e.target.value)}>{services.map(s => <option key={s.title}>{s.title}</option>)}</select></label><label>Tell us about your project<textarea required name="message" rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder="Your idea, your goals, or the challenge you want to solve…" /></label><Button type="submit" size="lg">Start a conversation <ArrowUpRight /></Button><p className="form-note">Opens your email app with your enquiry ready to send.</p></form>
      </section>
    </main>
    <footer><div className="container footer-main"><a className="footer-brand" href="#home">iTheku<span>Tech-Enterprise</span></a><p>Your Enterprise, <span>Our priority.</span></p><a href="#home" className="back-top">Back to top <ArrowUpRight size={16} /></a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} iTheku Tech-Enterprise. All rights reserved.</span><span><span className="gold-dot" /> Proudly 100% black-owned. Durban, South Africa.</span></div></footer>
  </div>;
}
