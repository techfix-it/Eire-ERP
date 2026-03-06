import React from 'react';
import { createClient } from '@/utils/supabase/server';
import ProfitabilityClient from './ProfitabilityClient';

export default async function ProfitabilityPage() {
  const supabase = await createClient();

  // Fetch all transactions for calculation
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  return (
    <div style={{ padding: '1rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', letterSpacing: '-0.025em' }}>Profitability & Margins</h1>
        <p style={{ color: 'var(--text-zinc-500)', marginTop: '0.5rem' }}>Real-time income statement and financial performance analysis.</p>
      </header>
      
      <ProfitabilityClient initialTransactions={transactions || []} />
    </div>
  );
}
