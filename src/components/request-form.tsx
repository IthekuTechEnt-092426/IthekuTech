import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { ArrowUpRight, CheckCircle2, LoaderCircle, BriefcaseBusiness, FileText, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { services } from '@/lib/company';
import { requestSchema, requestTypes } from '@/lib/request-schema';
import { submitRequest } from '@/lib/requests.functions';

export function RequestForm({ selectedService }: { selectedService: string }) {
  const submit = useServerFn(submitRequest);
  const [type, setType] = useState<'service' | 'quotation' | 'partnership'>('service');
  const [service, setService] = useState(selectedService);
  const [pending, setPending] = useState(false);
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [fields, setFields] = useState<Partial<Record<'name' | 'email' | 'message', string>> & Record<string, string | undefined>>({});
  const requestId = useRef<string | null>(null);
  const locked = useRef(false);
  useEffect(() => { setService(selectedService); }, [selectedService]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    const form = new FormData(event.currentTarget);
    requestId.current ??= crypto.randomUUID();
    const result = requestSchema.safeParse({
      id: requestId.current, type, service,
      name: form.get('name'), email: form.get('email'), company: form.get('company'),
      message: form.get('message'), consent: form.get('consent') === 'on', website: form.get('website'),
    });
    setError('');
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) next[String(issue.path[0])] ??= issue.message;
      setFields(next);
      return;
    }
    setFields({});
    locked.current = true;
    setPending(true);
    try {
      const saved = await submit({ data: result.data });
      setReference(saved.reference);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Your request could not be saved. Please try again.');
    } finally {
      locked.current = false;
      setPending(false);
    }
  }
  const fieldError = (field: string) => fields[field] ? <span id={`${field}-error`} className="text-destructive text-xs" role="alert">{fields[field]}</span> : null;
  if (reference) return <div className="contact-form flex flex-col items-start gap-5" role="status" aria-live="polite">
    <CheckCircle2 className="text-primary" size={42} strokeWidth={1.5} />
    <h3 className="text-2xl font-semibold">Request received.</h3>
    <p className="text-sm text-muted-foreground">Your {requestTypes.find(item => item.value === type)?.label.toLowerCase()} has been saved securely for the iTheku team to review.</p>
    <div className="w-full border-y border-border py-4"><p className="text-xs text-muted-foreground mb-2">Your reference</p><p className="break-all text-sm font-semibold">{reference}</p></div>
    <Button variant="outline" onClick={() => { setReference(''); requestId.current = null; }}>Submit another request <ArrowUpRight /></Button>
  </div>;
  return <form className="contact-form" onSubmit={onSubmit} noValidate>
    <fieldset disabled={pending} className="min-w-0 border-0 p-0 m-0">
      <legend className="text-xs mb-3">I’d like to discuss</legend>
      <div className="grid grid-cols-3 gap-2 mb-6" role="group" aria-label="Request type">{requestTypes.map((item, index) => {
        const Icon = [BriefcaseBusiness, FileText, Handshake][index];
        return <Button type="button" variant={type === item.value ? 'default' : 'outline'} key={item.value} className="h-auto min-h-14 whitespace-normal flex-col px-1 py-2 text-[11px]" aria-pressed={type === item.value} onClick={() => setType(item.value)}>{Icon && <Icon />}{item.label}</Button>;
      })}</div>
      <div className="form-row"><label>Your name<input name="name" autoComplete="name" maxLength={100} aria-invalid={Boolean(fields.name)} aria-describedby={fields.name ? 'name-error' : undefined} placeholder="Full name" />{fieldError('name')}</label><label>Email address<input name="email" type="email" autoComplete="email" maxLength={255} aria-invalid={Boolean(fields.email)} aria-describedby={fields.email ? 'email-error' : undefined} placeholder="you@company.com" />{fieldError('email')}</label></div>
      <label>Company / organisation (optional)<input name="company" autoComplete="organization" maxLength={150} placeholder="Company name" />{fieldError('company')}</label>
      <label>{type === 'partnership' ? 'Area of interest' : 'Which service do you need?'}<select value={service} onChange={e => setService(e.target.value)}>{services.map(s => <option key={s.title}>{s.title}</option>)}</select>{fieldError('service')}</label>
      <label>{type === 'partnership' ? 'Tell us about your partnership proposal' : type === 'quotation' ? 'Tell us what you’d like quoted' : 'Tell us about your project'}<textarea name="message" rows={4} maxLength={3000} aria-invalid={Boolean(fields.message)} aria-describedby={fields.message ? 'message-error' : undefined} placeholder={type === 'partnership' ? 'Your organisation, proposed collaboration, and shared goals…' : type === 'quotation' ? 'Scope, requirements, timeline, and budget if available…' : 'Your idea, your goals, or the challenge you want to solve…'} />{fieldError('message')}</label>
      <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="mb-5"><label className="!flex-row !items-start !gap-3 !mb-1"><input type="checkbox" name="consent" className="!w-4 !h-4 shrink-0 mt-0.5 accent-primary" /><span className="text-xs text-muted-foreground">I agree that iTheku may use these details to review and respond to my request.</span></label>{fieldError('consent')}</div>
      {error && <p role="alert" className="text-destructive text-sm mb-4">{error}</p>}
      <Button type="submit" size="lg" disabled={pending} className="w-full justify-between">{pending ? 'Submitting…' : type === 'quotation' ? 'Request a quotation' : type === 'partnership' ? 'Propose a partnership' : 'Submit service request'}{pending ? <LoaderCircle className="animate-spin" /> : <ArrowUpRight />}</Button>
      <p className="form-note">Your request is saved securely. No phone call or email needed.</p>
    </fieldset>
  </form>;
}