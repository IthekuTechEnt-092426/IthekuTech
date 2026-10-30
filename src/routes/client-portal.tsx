import { createFileRoute } from '@tanstack/react-router';
import { ProjectPortal } from '@/components/project-portal';

export const Route = createFileRoute('/client-portal')({ head: () => ({ meta: [
  { title: 'Client Portal | iTheku Tech-Enterprise' }, { name: 'description', content: 'Client access for iTheku Tech-Enterprise projects and partnerships.' }, { property: 'og:title', content: 'Client Portal | iTheku Tech-Enterprise' }, { property: 'og:description', content: 'A dedicated access point for iTheku clients.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
] }), component: ClientPortalPage });
function ClientPortalPage() { return <ProjectPortal mode="client" />; }