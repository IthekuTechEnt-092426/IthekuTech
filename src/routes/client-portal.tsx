import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, BriefcaseBusiness } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageIntro, SiteFooter, SiteHeader } from '@/components/site-chrome';

export const Route = createFileRoute('/client-portal')({ head: () => ({ meta: [
  { title: 'Client Portal | iTheku Tech-Enterprise' }, { name: 'description', content: 'Client access for iTheku Tech-Enterprise projects and partnerships.' }, { property: 'og:title', content: 'Client Portal | iTheku Tech-Enterprise' }, { property: 'og:description', content: 'A dedicated access point for iTheku clients.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
] }), component: ClientPortalPage });
function ClientPortalPage() { return <><SiteHeader /><main><PageIntro eyebrow="ENTERPRISE" title="Client portal" description="A dedicated access point for iTheku Tech-Enterprise clients and partners." /><section className="portal-panel container"><BriefcaseBusiness /><h2>Client access</h2><p>Speak to our team to arrange access for your organisation.</p><Button asChild><Link to="/contact">Request access <ArrowRight /></Link></Button></section></main><SiteFooter /></>; }