import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageIntro, SiteFooter, SiteHeader } from '@/components/site-chrome';
import technology from '@/assets/technology.jpg';
import innocentia from '@/assets/innocentia.asset.json';
import phakamani from '@/assets/phakamani.asset.json';

export const Route = createFileRoute('/gallery')({ head: () => ({ meta: [
  { title: 'Gallery | iTheku Tech-Enterprise' }, { name: 'description', content: 'Explore iTheku Tech-Enterprise, its founders and its technology-led work from Durban.' },
  { property: 'og:title', content: 'Gallery | iTheku Tech-Enterprise' }, { property: 'og:description', content: 'The people and purpose behind iTheku Tech-Enterprise.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
] }), component: GalleryPage });
function GalleryPage() { return <><SiteHeader /><main><PageIntro eyebrow="GALLERY" title="Technology, people, and purpose." description="A closer look at the people and ideas shaping iTheku Tech-Enterprise." /><section className="section container gallery-grid"><figure className="gallery-wide"><img src={technology} alt="Gold circuitry and processor technology" /><figcaption>Technology with purpose</figcaption></figure><figure><img src={innocentia.url} alt="Vhulenda Innocentia Nefolovhodwe" /><figcaption>Vhulenda Innocia Nefolovhodwe</figcaption></figure><figure><img src={phakamani.url} alt="Phakamani Mbatha" /><figcaption>Phakamani Mbatha</figcaption></figure></section><section className="page-cta container"><h2>See what we can build together.</h2><Button asChild><Link to="/contact">Start a request <ArrowRight /></Link></Button></section></main><SiteFooter /></>; }