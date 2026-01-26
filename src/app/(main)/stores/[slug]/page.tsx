'use client';

import { useState, useMemo, Suspense } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { vendors } from '@/lib/data';
import { useCart } from '@/lib/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MealCard } from '@/components/stores/meal-card';
import type { Vendor, VendorItem } from '@/lib/types';
import { Loader2, Leaf, Info, ShoppingCart } from 'lucide-react';

function VendorPageContent() {
  const params = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const [selectedItem, setSelectedItem] = useState<VendorItem | null>(null);

  const vendor: Vendor | undefined = useMemo(() => {
    if (!params.slug) return undefined;
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    return vendors.find(v => v.name.toLowerCase().replace(/\s+/g, '-') === slug);
  }, [params.slug]);


  if (!vendor) {
    notFound();
  }

  const handleOrderClick = (item: VendorItem) => {
    setSelectedItem(item);
  };
  
  const handleAddToCart = () => {
    if (selectedItem) {
      addItem(selectedItem, vendor.name);
      setSelectedItem(null);
    }
  };

  const mealTimeCategories = ['All', 'Breakfast', 'Lunch', 'Dinner'];

  const filteredItems = (category: string) => {
    if (category === 'All') return vendor.items;
    return vendor.items.filter(item => item.mealTime?.includes(category as 'Breakfast' | 'Lunch' | 'Dinner'));
  };

  const hasMealTimeItems = vendor.items.some(item => item.mealTime);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{vendor.name}</h1>
        <p className="text-muted-foreground">Browse the menu and make a purchase.</p>
      </div>

      <div>
        {hasMealTimeItems ? (
          <Tabs defaultValue="All" className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
              {mealTimeCategories.map(cat => (
                <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
              ))}
            </TabsList>
            {mealTimeCategories.map(cat => (
              <TabsContent key={cat} value={cat} className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                  {filteredItems(cat).map((item, index) => (
                    <div key={item.name} className="animate-fade-in-up" style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'backwards' }}>
                      <MealCard item={item} onOrderClick={() => handleOrderClick(item)} />
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {vendor.items.map((item, index) => (
               <div key={item.name} className="animate-fade-in-up" style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'backwards' }}>
                 <MealCard item={item} onOrderClick={() => handleOrderClick(item)} />
               </div>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={(isOpen) => !isOpen && setSelectedItem(null)}>
          <DialogContent className="max-w-3xl p-0">
            <DialogHeader>
              <div className="relative h-64 w-full">
                <Image src={selectedItem.imageUrl} alt={selectedItem.name} layout="fill" objectFit="cover" />
              </div>
              <div className="p-6">
                <DialogTitle className="text-3xl font-headline">{selectedItem.name}</DialogTitle>
                <DialogDescription className="mt-2 text-lg font-semibold text-primary">
                  ₦{selectedItem.price.toLocaleString()}
                </DialogDescription>
              </div>
            </DialogHeader>
            <div className="px-6 pb-6 space-y-6">
              <p className="text-muted-foreground">{selectedItem.description}</p>
              
              {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
                <div>
                  <h4 className="font-semibold flex items-center gap-2"><Leaf className="h-4 w-4"/>Ingredients</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedItem.ingredients.map(ing => <Badge key={ing} variant="secondary">{ing}</Badge>)}
                  </div>
                </div>
              )}

              {selectedItem.allergens && selectedItem.allergens.length > 0 && (
                <div>
                  <h4 className="font-semibold flex items-center gap-2"><Info className="h-4 w-4"/>Allergens</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedItem.allergens.map(alg => <Badge key={alg} variant="destructive">{alg}</Badge>)}
                  </div>
                </div>
              )}

            </div>
            <DialogFooter className="p-6 pt-0 bg-background rounded-b-lg">
              <Button size="lg" className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default function VendorPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <VendorPageContent />
    </Suspense>
  )
}
