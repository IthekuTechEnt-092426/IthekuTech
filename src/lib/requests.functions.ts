import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { requestSchema } from './request-schema';

export const submitRequest = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => requestSchema.parse(input))
  .handler(async ({ data }) => {
    const url = process.env['SUPABASE_URL'];
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    if (!url || !key) throw new Error('Requests are temporarily unavailable. Please try again shortly.');
    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
        headers.set('apikey', key);
        return fetch(input, { ...init, headers });
      } },
    });
    const { data: reference, error } = await client.rpc('submit_website_request', {
      p_id: data.id, p_type: data.type, p_name: data.name, p_email: data.email,
      p_company: data.company, p_service: data.service, p_message: data.message,
    });
    if (error || !reference) {
      if (error?.message.includes('Please wait')) throw new Error('Please wait before submitting another request.');
      throw new Error('Your request could not be saved. Please try again.');
    }
    return { reference };
  });