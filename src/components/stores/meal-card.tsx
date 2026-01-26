'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { VendorItem } from '@/lib/types';

interface MealCardProps {
  item: VendorItem;
  onOrderClick: () => void;
}

export function MealCard({ item, onOrderClick }: MealCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col group transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            data-ai-hint={item.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <CardTitle className="text-lg font-headline">{item.name}</CardTitle>
        <CardDescription className="font-bold text-base text-primary mt-1">
          ₦{item.price.toLocaleString()}
        </CardDescription>
        <p className="text-sm text-muted-foreground mt-2 flex-grow">{item.description}</p>
        <Button
          className="w-full mt-4 transition-transform duration-200 hover:scale-105 active:scale-100"
          onClick={onOrderClick}
        >
          Order Now
        </Button>
      </CardContent>
    </Card>
  );
}
