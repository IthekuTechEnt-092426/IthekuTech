import { describe, expect, it } from 'vitest';
import { requestSchema } from '@/lib/request-schema';

const valid = { id: 'b4f8f5c0-906d-4c4c-8e42-8c2384cbf842', type: 'service', name: ' Test ', email: 'test@example.com', company: '', service: 'Custom Software Development', message: 'A custom software project.', consent: true, website: '' };

describe('website request validation', () => {
  it.each(['service', 'quotation', 'partnership'])('accepts %s requests', type => {
    expect(requestSchema.parse({ ...valid, type }).name).toBe('Test');
  });
  it.each([
    { name: '   ' }, { email: 'invalid' }, { message: 'short' },
    { message: 'x'.repeat(3001) }, { company: 'x'.repeat(151) },
    { consent: false }, { service: 'unknown' }, { type: 'admin' }, { website: 'spam' },
  ])('rejects invalid input %j', changes => {
    expect(requestSchema.safeParse({ ...valid, ...changes }).success).toBe(false);
  });
});