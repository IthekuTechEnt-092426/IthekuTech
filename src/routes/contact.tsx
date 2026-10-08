import { createFileRoute } from '@tanstack/react-router';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PageIntro, SiteFooter, SiteHeader } from '@/components/site-chrome';
import { RequestForm } from '@/components/request-form';
import { email, services } from '@/lib/company';

export const Route = createFileRoute('/contact')({ head: () => ({ meta: [
  { title: 'Contact & Requests | iTheku Tech-Enterprise' }, { name: 'description', content: 'Request a technology service, quotation or partnership directly from iTheku Tech-Enterprise in Durban.' },
  { property: 'og:title', content: 'Contact iTheku Tech-Enterprise' }, { property: 'og:description', content: 'Submit a service, quotation or partnership request directly online.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
] }), component: ContactPage });
function ContactPage() { return <><SiteHeader /><main><PageIntro eyebrow="LET’S START A CONVERSATION" title="Your next chapter. Built together." description="Send your service request, quotation request, or partnership proposal directly through the website." />
  <section className="section container contact-layout"><div><h2>We’re ready to listen.</h2><p className="contact-intro">Tell us about your idea, challenge, or project. Your request will be saved securely for our team to review.</p><div className="contact-details"><a href={`mailto:${email}`}><Mail /><span><small>EMAIL</small>{email}</span></a><a href="tel:+27699874907"><Phone /><span><small>PHONE</small>069 987 4907</span></a><a href="https://www.google.com/maps/search/?api=1&query=300+Apline+Road+Springfield+Durban+4091" target="_blank" rel="noreferrer"><MapPin /><span><small>ADDRESS</small>300 Apline Road, Springfield<br />Durban, 4091, South Africa</span></a></div></div><RequestForm selectedService="Custom Software Development" /></section>
  </main><SiteFooter /></>; }