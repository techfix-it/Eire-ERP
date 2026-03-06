import { createClient } from '@/utils/supabase/server';
import CashFlowClient from '@/app/(protected)/cash-flow/CashFlowClient';

export default async function CashFlowPage() {
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  const typedTransactions = (transactions || []);
  
  const cashIn = typedTransactions
    .filter(t => t.type === 'in')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    
  const cashOut = typedTransactions
    .filter(t => t.type === 'out')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    
  const netBalance = cashIn - cashOut;

  return (
    <CashFlowClient 
      initialTransactions={typedTransactions}
      stats={{ cashIn, cashOut, netBalance }}
    />
  );
}
