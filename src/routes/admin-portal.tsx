import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageIntro, SiteFooter, SiteHeader } from '@/components/site-chrome';

export const Route = createFileRoute('/admin-portal')({ head: () => ({ meta: [
  { title: 'Admin Portal | iTheku Tech-Enterprise' }, { name: 'description', content: 'Administrative access for authorised iTheku Tech-Enterprise team members.' }, { property: 'og:title', content: 'Admin Portal | iTheku Tech-Enterprise' }, { property: 'og:description', content: 'Authorised administrative access.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
] }), component: AdminPortalPage });
function AdminPortalPage() { return <><SiteHeader /><main><PageIntro eyebrow="ENTERPRISE" title="Admin portal" description="A dedicated access point for authorised iTheku Tech-Enterprise team members." /><section className="portal-panel container"><ShieldCheck /><h2>Authorised access</h2><p>Administrative access is reserved for approved team members.</p><Button asChild><Link to="/contact">Contact the team <ArrowRight /></Link></Button></section></main><SiteFooter /></>; }