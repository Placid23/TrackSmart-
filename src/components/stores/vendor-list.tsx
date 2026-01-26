'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Vendor } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface VendorListProps {
  vendors: Vendor[];
}

const categoryImageMap: Record<string, string> = {
  'School Cafeteria': 'vendor-cafeteria',
  'Private Food Vendors': 'vendor-food',
  'Gadget Vendors': 'vendor-gadgets',
  'Health & Utility Vendors': 'vendor-health',
};

const getPlaceholderImage = (category: string) => {
  const id = categoryImageMap[category];
  return PlaceHolderImages.find(img => img.id === id);
};

export function VendorList({ vendors }: VendorListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.map(vendor => {
        const slug = vendor.name.toLowerCase().replace(/\s+/g, '-');
        return (
          <Link key={vendor.name} href={`/stores/${slug}`} passHref>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardHeader className="p-0">
                <div className="relative h-40 w-full">
                  <Image
                    src={getPlaceholderImage(vendor.category)?.imageUrl || ''}
                    alt={vendor.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    data-ai-hint={getPlaceholderImage(vendor.category)?.imageHint}
                  />
                </div>
                <div className="p-6 pb-2">
                  <CardTitle>{vendor.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <Button className="w-full mt-auto">View Menu</Button>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
