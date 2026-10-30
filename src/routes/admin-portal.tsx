import { createFileRoute } from '@tanstack/react-router';
import { ProjectPortal } from '@/components/project-portal';

export const Route = createFileRoute('/admin-portal')({ head: () => ({ meta: [
  { title: 'Admin Portal | iTheku Tech-Enterprise' }, { name: 'description', content: 'Administrative access for authorised iTheku Tech-Enterprise team members.' }, { property: 'og:title', content: 'Admin Portal | iTheku Tech-Enterprise' }, { property: 'og:description', content: 'Authorised administrative access.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
] }), component: AdminPortalPage });
function AdminPortalPage() { return <ProjectPortal mode="admin" />; }