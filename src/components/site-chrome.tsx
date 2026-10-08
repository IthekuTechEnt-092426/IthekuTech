import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight, ChevronDown, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { email, services, serviceSlug } from '@/lib/company';
import logo from '@/assets/logo.asset.json';

const pageLinks = [
  { label: 'About us', to: '/about' as const },
  { label: 'Our approach', to: '/approach' as const },
  { label: 'Our team', to: '/team' as const },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="site-header">
    <div className="container header-inner">
      <Link to="/" className="logo-link" aria-label="iTheku Tech-Enterprise home"><img src={logo.url} alt="iTheku Tech-Enterprise — Your Enterprise, Our priority." width={970} height={845} /></Link>
      <nav aria-label="Main navigation" className="desktop-nav">
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="nav-dropdown-trigger">Services <ChevronDown /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="services-dropdown">
            <DropdownMenuLabel>Our services</DropdownMenuLabel><DropdownMenuSeparator />
            <div className="services-dropdown-grid">{services.map((service) => <DropdownMenuItem key={service.title} asChild><Link to="/services" hash={serviceSlug(service.title)}><service.icon />{service.title}</Link></DropdownMenuItem>)}</div>
            <DropdownMenuSeparator /><DropdownMenuItem asChild><Link to="/services" className="all-services-link">View all services <ArrowUpRight /></Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="nav-dropdown-trigger">Enterprise <ChevronDown /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="enterprise-dropdown">
            <DropdownMenuLabel>Enterprise</DropdownMenuLabel><DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/admin-portal">Admin portal</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/client-portal">Client portal</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/services">Services page</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/gallery">Gallery</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {pageLinks.map(item => <Link to={item.to} key={item.label} activeProps={{ className: 'nav-active' }}>{item.label}</Link>)}
      </nav>
      <Button asChild className="header-cta"><Link to="/contact">Let’s talk <ArrowUpRight /></Link></Button>
      <Button variant="ghost" size="icon" className="mobile-menu-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
    </div>
    {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">
      <Link to="/services" onClick={() => setMenuOpen(false)}>All services <ArrowUpRight /></Link>
      <details><summary>Browse services <ChevronDown size={16} /></summary><div className="mobile-service-links">{services.map(service => <Link key={service.title} to="/services" hash={serviceSlug(service.title)} onClick={() => setMenuOpen(false)}>{service.title}</Link>)}</div></details>
      <details><summary>Enterprise <ChevronDown size={16} /></summary><div className="mobile-service-links"><Link to="/admin-portal" onClick={() => setMenuOpen(false)}>Admin portal</Link><Link to="/client-portal" onClick={() => setMenuOpen(false)}>Client portal</Link><Link to="/services" onClick={() => setMenuOpen(false)}>Services page</Link><Link to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</Link></div></details>
      {[...pageLinks, { label: 'Contact us', to: '/contact' as const }].map(item => <Link key={item.label} to={item.to} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight size={16} /></Link>)}
    </nav>}
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="container footer-grid">
      <div className="footer-intro"><Link className="footer-logo" to="/" aria-label="iTheku Tech-Enterprise home"><img src={logo.url} alt="iTheku Tech-Enterprise" width={970} height={845} /></Link><p>Your Enterprise, <strong>Our priority.</strong></p><p className="footer-summary">Purpose-built software, intelligent automation, and dependable digital solutions from Durban.</p></div>
      <div className="footer-column"><h2>Explore</h2><Link to="/about">About us</Link><Link to="/approach">Our approach</Link><Link to="/team">Our team</Link><Link to="/gallery">Gallery</Link><Link to="/contact">Contact us</Link></div>
      <div className="footer-column"><h2>Enterprise</h2><Link to="/admin-portal">Admin portal</Link><Link to="/client-portal">Client portal</Link><Link to="/services">Services page</Link></div>
      <div className="footer-column footer-contact"><h2>Contact</h2><a href={`mailto:${email}`}><Mail />{email}</a><a href="tel:+27699874907"><Phone />069 987 4907</a><a href="https://www.google.com/maps/search/?api=1&query=300+Apline+Road+Springfield+Durban+4091" target="_blank" rel="noreferrer"><MapPin />Durban, South Africa</a></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} iTheku Tech-Enterprise. All rights reserved.</span><span><span className="gold-dot" /> Proudly 100% black-owned.</span><Link to="/">Back home <ArrowUpRight size={14} /></Link></div>
  </footer>;
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="page-intro"><div className="container"><div className="eyebrow"><span className="small-line" />{eyebrow}</div><h1>{title}</h1><p>{description}</p></div></section>;
}