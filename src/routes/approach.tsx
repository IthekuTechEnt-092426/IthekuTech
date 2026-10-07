import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageIntro, SiteFooter, SiteHeader } from '@/components/site-chrome';

const steps = [
  ['Discover', 'We listen first. Together, we understand your goals, challenges, existing systems, and the people who will use your solution.'],
  ['Design', 'We turn your requirements into a clear plan, thoughtful experiences, and a sound product architecture.'],
  ['Build & test', 'We develop your solution in deliberate stages and test it carefully for functionality, performance, and reliability.'],
  ['Launch & evolve', 'We help you go live, then maintain, support, and improve your software as your business grows.'],
];
export const Route = createFileRoute('/approach')({ head: () => ({ meta: [
  { title: 'Our Approach | iTheku Tech-Enterprise' }, { name: 'description', content: 'See how iTheku discovers, designs, builds, tests, launches and evolves technology solutions.' },
  { property: 'og:title', content: 'Our Approach | iTheku Tech-Enterprise' }, { property: 'og:description', content: 'A considered path from possibility to a working solution.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
] }), component: ApproachPage });
function ApproachPage() { return <><SiteHeader /><main><PageIntro eyebrow="HOW WE WORK" title="From possibility to a working solution." description="A considered approach, clear communication, and a solution built around what your business actually needs." />
  <section className="section container approach-list">{steps.map(([title, description], index) => <article key={title}><div className="approach-index">0{index + 1}</div><div><h2>{title}</h2><p>{description}</p></div></article>)}</section>
  <section className="page-cta container"><div><div className="eyebrow">READY TO BEGIN?</div><h2>Let’s define the right next step.</h2></div><Button asChild><Link to="/contact">Discuss your project <ArrowRight /></Link></Button></section>
  </main><SiteFooter /></>; }