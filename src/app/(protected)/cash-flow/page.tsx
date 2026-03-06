import db from '@/lib/db';
import CashFlowClient from '@/app/(protected)/cash-flow/CashFlowClient';

export default async function CashFlowPage() {
  const transactions = db.prepare("SELECT * FROM transactions ORDER BY date DESC").all() as any[];
  
  const cashIn = transactions
    .filter(t => t.type === 'in')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const cashOut = transactions
    .filter(t => t.type === 'out')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const netBalance = cashIn - cashOut;

  return (
    <CashFlowClient 
      initialTransactions={transactions}
      stats={{ cashIn, cashOut, netBalance }}
    />
  );
}
