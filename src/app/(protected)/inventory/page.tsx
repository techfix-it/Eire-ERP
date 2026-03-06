import { createClient } from '@/utils/supabase/server';
import InventoryClient from './InventoryClient';

export default async function InventoryPage() {
  const supabase = await createClient();

  // Fetch data in parallel for efficiency
  const [
    { data: products },
    { data: brands },
    { data: attributes }
  ] = await Promise.all([
    supabase.from('products').select('*').order('name'),
    supabase.from('brands').select('*').order('name'),
    supabase.from('attribute_definitions').select('*').order('name')
  ]);

  // Data processing for the client (Supabase stores JSON/Array natively if configured)
  const serializedProducts = (products || []).map(p => ({
    ...p,
    attributes: typeof p.attributes === 'string' ? JSON.parse(p.attributes) : (p.attributes || {}),
    images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : [])
  }));

  return (
    <InventoryClient 
      initialProducts={serializedProducts}
      initialBrands={brands || []}
      initialAttributes={attributes || []}
    />
  );
}
