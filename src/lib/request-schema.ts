import { z } from 'zod';
import { services } from './company';

export const requestTypes = [
  { value: 'service', label: 'Service request' },
  { value: 'quotation', label: 'Quotation' },
  { value: 'partnership', label: 'Partnership' },
] as const;

export const requestSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['service', 'quotation', 'partnership']),
  name: z.string().trim().min(1, 'Please enter your name.').max(100, 'Use no more than 100 characters.'),
  email: z.string().trim().email('Please enter a valid email address.').max(255),
  company: z.string().trim().max(150, 'Use no more than 150 characters.'),
  service: z.string().refine(value => services.some(s => s.title === value), 'Please select a service.'),
  message: z.string().trim().min(10, 'Please share at least 10 characters about your request.').max(3000, 'Use no more than 3,000 characters.'),
  consent: z.literal(true, { errorMap: () => ({ message: 'Please agree to the use of your details to respond to this request.' }) }),
  website: z.string().max(0, 'Unable to submit this request.'),
});

export type WebsiteRequest = z.infer<typeof requestSchema>;