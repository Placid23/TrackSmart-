import { vendors } from '@/lib/data';
import { VendorList } from '@/components/stores/vendor-list';
import type { VendorCategoryName } from '@/lib/types';

export default function StoresPage() {
  const vendorCategories = Array.from(
    new Set(vendors.map(v => v.category))
  ) as VendorCategoryName[];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Vendor Marketplace</h1>
        <p className="text-muted-foreground">
          Browse and make purchases from available vendors.
        </p>
      </div>

      <div className="space-y-8">
        {vendorCategories.map(category => (
          <div key={category}>
            <h2 className="text-2xl font-semibold font-headline mb-4">{category}</h2>
            <VendorList vendors={vendors.filter(v => v.category === category)} />
          </div>
        ))}
      </div>
    </div>
  );
}
