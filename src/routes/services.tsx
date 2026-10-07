import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RequestForm } from '@/components/request-form';
import { PageIntro, SiteFooter, SiteHeader } from '@/components/site-chrome';
import { services, serviceSlug } from '@/lib/company';

export const Route = createFileRoute('/services')({
  head: () => ({ meta: [
    { title: 'Technology Services | iTheku Tech-Enterprise' },
    { name: 'description', content: 'Explore custom software, web and mobile development, AI, automation, cloud, integration, design, testing and managed technology services.' },
    { property: 'og:title', content: 'Technology Services | iTheku Tech-Enterprise' },
    { property: 'og:description', content: 'Thirteen practical technology services built around your enterprise.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: ServicesPage,
});

function ServicesPage() {
  const [selected, setSelected] = useState(services[0].title);
  return <><SiteHeader /><main><PageIntro eyebrow="OUR EXPERTISE" title="One partner. Every digital possibility." description="Explore our full range of services, then send your request or ask for a quotation directly." />
    <section className="section container service-directory">{services.map((service, index) => <article id={serviceSlug(service.title)} className="service-directory-item" key={service.title}>
      <div className="service-directory-heading"><span>0{index + 1}</span><service.icon /><div><p>{service.category}</p><h2>{service.title}</h2><p>{service.description}</p></div></div>
      <ul>{service.items.map(item => <li key={item}><Check />{item}</li>)}</ul>
      <Button asChild variant="outline" onClick={() => setSelected(service.title)}><a href="#request-service">Request this service <ArrowRight /></a></Button>
    </article>)}</section>
    <section id="request-service" className="request-band"><div className="container contact-layout"><div><div className="eyebrow">START A REQUEST</div><h2>Tell us what your business needs.</h2><p className="contact-intro">Request a service, quotation, or partnership without calling or sending an email.</p><Button asChild variant="outline"><Link to="/contact">View all contact details <ArrowRight /></Link></Button></div><RequestForm selectedService={selected} /></div></section>
  </main><SiteFooter /></>;
}