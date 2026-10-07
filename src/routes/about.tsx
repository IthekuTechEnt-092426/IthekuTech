import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageIntro, SiteFooter, SiteHeader } from '@/components/site-chrome';

export const Route = createFileRoute('/about')({ head: () => ({ meta: [
  { title: 'About iTheku Tech-Enterprise | Durban Technology Company' }, { name: 'description', content: 'Meet iTheku Tech-Enterprise, a 100% black-owned Durban technology company focused on practical business value.' },
  { property: 'og:title', content: 'About iTheku Tech-Enterprise' }, { property: 'og:description', content: 'Technology is our craft. Your business is our focus.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
] }), component: AboutPage });

function AboutPage() { return <><SiteHeader /><main><PageIntro eyebrow="THE ITHEKU DIFFERENCE" title="Technology is our craft. Your business is our focus." description="We build useful, dependable technology around the realities and ambitions of your enterprise." />
  <section className="section container story-grid"><div><div className="eyebrow">WHO WE ARE</div><h2>Rooted in Durban.<br />Built for progress.</h2></div><div className="story-copy"><p>iTheku Tech-Enterprise is a 100% black-owned technology company based in Durban, South Africa.</p><p>We design, develop, and maintain digital solutions around specific business requirements. Our work connects software, intelligence, and people to create practical value.</p><p>From a first idea to a growing digital operation, we bring business-first thinking, direct communication, and long-term commitment.</p></div></section>
  <section className="values-band"><div className="container values-grid">{['Business-first thinking', 'Solutions shaped around you', 'End-to-end delivery', 'Long-term partnerships'].map(value => <div key={value}><CheckCircle2 /><h2>{value}</h2></div>)}</div></section>
  <section className="page-cta container"><h2>Your Enterprise, <span>Our priority.</span></h2><Button asChild><Link to="/contact">Start a conversation <ArrowRight /></Link></Button></section>
  </main><SiteFooter /></>; }