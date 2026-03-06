import { createClient } from '@/utils/supabase/server';
import POSClient from './POSClient';

export default async function POSPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .gt('stock_quantity', 0)
    .order('name');

  const serializedProducts = (products || []).map(p => ({
    ...p,
    images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : [])
  }));

  return (
    <POSClient initialProducts={serializedProducts} />
  );
}
