import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';

export default function TableOrder() {
  const { tableNo } = useParams();
  return (
    <Layout noFooter>
      <div className="max-w-md mx-auto px-4 py-10 text-center">
        <div className="text-6xl mb-4">🪑</div>
        <h1 className="text-3xl font-black font-serif mb-2">Table {tableNo}</h1>
        <p className="text-muted-foreground mb-8">You're ordering from Table {tableNo}. Browse the menu and add items to your cart.</p>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
          <p className="text-green-700 font-bold">✅ Dine-in mode active</p>
          <p className="text-green-600 text-sm">Your order will be served at this table</p>
        </div>
        <Button onClick={() => window.location.href = '/menu?mode=dine-in&table=' + tableNo} className="w-full h-14 text-base font-black rounded-xl">
          Browse Menu → Order Now
        </Button>
      </div>
    </Layout>
  );
}
