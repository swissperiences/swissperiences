/**
 * One-time backfill: Sync all Supabase leads → Resend audience
 *
 * Queries waitlist, corporate_inquiries, and membership_applications,
 * deduplicates by email, and upserts into the Resend audience.
 *
 * Usage:
 *   npx tsx scripts/backfill-resend-audience.ts
 *
 * Requires .env with:
 *   VITE_SUPABASE_URL, SUPABASE_SECRET_KEY,
 *   RESEND_API_KEY, RESEND_AUDIENCE_ID
 */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import * as dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

if (!SUPABASE_URL || !SUPABASE_KEY || !RESEND_API_KEY || !AUDIENCE_ID) {
  console.error('Missing env vars. Need: VITE_SUPABASE_URL, SUPABASE_SECRET_KEY, RESEND_API_KEY, RESEND_AUDIENCE_ID');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const resend = new Resend(RESEND_API_KEY);

interface Lead {
  email: string;
  firstName?: string;
  source: string;
}

async function fetchAllLeads(): Promise<Lead[]> {
  const leads = new Map<string, Lead>();

  // 1. Waitlist
  const { data: waitlist, error: wErr } = await supabase
    .from('waitlist')
    .select('email, first_name')
    .eq('newsletter_opt_in', true);

  if (wErr) console.error('Waitlist query error:', wErr);
  for (const row of waitlist || []) {
    leads.set(row.email, {
      email: row.email,
      firstName: row.first_name || undefined,
      source: 'waitlist',
    });
  }

  // 2. Corporate inquiries
  const { data: corporate, error: cErr } = await supabase
    .from('corporate_inquiries')
    .select('email, contact_name')
    .eq('newsletter_opt_in', true);

  if (cErr) console.error('Corporate query error:', cErr);
  for (const row of corporate || []) {
    if (!leads.has(row.email)) {
      leads.set(row.email, {
        email: row.email,
        firstName: row.contact_name || undefined,
        source: 'corporate',
      });
    }
  }

  // 3. Membership applications
  const { data: members, error: mErr } = await supabase
    .from('membership_applications')
    .select('email, full_name');

  if (mErr) console.error('Membership query error:', mErr);
  for (const row of members || []) {
    const existing = leads.get(row.email);
    // Prefer membership data (has full_name) or fill gaps
    const firstName = row.full_name?.split(' ')[0];
    if (!existing) {
      leads.set(row.email, {
        email: row.email,
        firstName,
        source: 'membership',
      });
    } else if (!existing.firstName && firstName) {
      existing.firstName = firstName;
    }
  }

  return Array.from(leads.values());
}

async function syncToResend(leads: Lead[]) {
  let synced = 0;
  let failed = 0;
  let skipped = 0;

  console.log(`\nSyncing ${leads.length} leads to Resend audience ${AUDIENCE_ID}...\n`);

  for (const lead of leads) {
    try {
      // Resend rate limit: 10 req/s for audiences API
      await resend.contacts.create({
        email: lead.email,
        ...(lead.firstName ? { firstName: lead.firstName } : {}),
        audienceId: AUDIENCE_ID!,
        unsubscribed: false,
      });
      synced++;
      process.stdout.write(`  ✓ ${lead.email} (${lead.source}${lead.firstName ? ', ' + lead.firstName : ''})\n`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      // 409 = already exists, count as success
      if (msg.includes('409') || msg.includes('already exists')) {
        skipped++;
        process.stdout.write(`  ~ ${lead.email} (already in audience)\n`);
      } else {
        failed++;
        console.error(`  ✗ ${lead.email}: ${msg}`);
      }
    }

    // Respect Resend rate limit (10 req/s → 100ms between requests)
    await new Promise(r => setTimeout(r, 120));
  }

  console.log(`\n--- Backfill complete ---`);
  console.log(`  Synced:  ${synced}`);
  console.log(`  Skipped: ${skipped} (already existed)`);
  console.log(`  Failed:  ${failed}`);
  console.log(`  Total:   ${leads.length}`);
}

async function main() {
  console.log('Fetching leads from Supabase...');
  const leads = await fetchAllLeads();
  console.log(`Found ${leads.length} unique leads across all tables.`);

  if (leads.length === 0) {
    console.log('Nothing to sync.');
    return;
  }

  await syncToResend(leads);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
