import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageIntro, SiteFooter, SiteHeader } from '@/components/site-chrome';
import innocentia from '@/assets/innocentia.asset.json';
import phakamani from '@/assets/phakamani.asset.json';

export const Route = createFileRoute('/team')({ head: () => ({ meta: [
  { title: 'Our Team | iTheku Tech-Enterprise' }, { name: 'description', content: 'Meet iTheku Tech-Enterprise founders and directors Vhulenda Innocentia Nefolovhodwe and Phakamani Mbatha.' },
  { property: 'og:title', content: 'Our Team | iTheku Tech-Enterprise' }, { property: 'og:description', content: 'Meet the people building technology with your enterprise at its heart.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
] }), component: TeamPage });
function TeamPage() { return <><SiteHeader /><main><PageIntro eyebrow="THE PEOPLE BEHIND ITHEKU" title="Driven by purpose. Led by people." description="Meet the founders and directors building a technology company with your enterprise at its heart." />
  <section className="section container team-page-grid">{[[innocentia.url, 'Vhulenda Innocentia Nefolovhodwe'], [phakamani.url, 'Phakamani Mbatha']].map(([image, name]) => <article key={name}><img src={image} alt={name} width={600} height={700} /><div><p>CO-FOUNDER & DIRECTOR</p><h2>{name}</h2><p>Committed to delivering thoughtful technology partnerships that help enterprises move forward with confidence.</p></div></article>)}</section>
  <section className="page-cta container"><h2>Build what comes next with us.</h2><Button asChild><Link to="/contact">Start a conversation <ArrowRight /></Link></Button></section>
  </main><SiteFooter /></>; }