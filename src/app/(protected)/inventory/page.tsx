import db from '@/lib/db';
import InventoryClient from './InventoryClient';

export default async function InventoryPage() {
  // SSR directly from DB
  const products = db.prepare("SELECT * FROM products").all() as any[];
  const brands = db.prepare("SELECT * FROM brands").all() as any[];
  const attributes = db.prepare("SELECT * FROM attribute_definitions").all() as any[];

  // Data processing for the client
  const serializedProducts = products.map(p => ({
    ...p,
    attributes: p.attributes ? JSON.parse(p.attributes) : {},
    images: p.images ? JSON.parse(p.images) : []
  }));

  return (
    <InventoryClient 
      initialProducts={serializedProducts}
      initialBrands={brands}
      initialAttributes={attributes}
    />
  );
}
