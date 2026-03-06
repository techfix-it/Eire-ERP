import db from '@/lib/db';
import POSClient from './POSClient';

export default async function POSPage() {
  const products = db.prepare("SELECT * FROM products WHERE stock_quantity > 0").all() as any[];

  const serializedProducts = products.map(p => ({
    ...p,
    images: p.images ? JSON.parse(p.images) : []
  }));

  return (
    <POSClient initialProducts={serializedProducts} />
  );
}
