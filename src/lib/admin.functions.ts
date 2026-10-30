import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

function assertStaff(claims: unknown) {
  if (!claims || typeof claims !== 'object') throw new Error('Forbidden');
  const appMetadata = (claims as { app_metadata?: unknown }).app_metadata;
  if (!appMetadata || typeof appMetadata !== 'object' || (appMetadata as { role?: unknown }).role !== 'admin') {
    throw new Error('Forbidden');
  }
}

export const listWebsiteRequests = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    assertStaff(context.claims);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data, error } = await supabaseAdmin
      .from('website_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw new Error('The lead inbox could not be loaded.');
    return data;
  });

export const updateWebsiteRequestStatus = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => z.object({
    id: z.string().uuid(),
    status: z.enum(['new', 'contacted', 'qualified', 'closed']),
  }).parse(input))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    assertStaff(context.claims);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { error } = await supabaseAdmin
      .from('website_requests')
      .update({ status: data.status })
      .eq('id', data.id);

    if (error) throw new Error('The lead status could not be updated.');
    return { id: data.id, status: data.status };
  });