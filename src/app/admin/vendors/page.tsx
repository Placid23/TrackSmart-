'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { vendors } from '@/lib/data';
import type { Vendor, VendorCategoryName } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const vendorCategories: VendorCategoryName[] = [
  'School Cafeteria',
  'Private Food Vendors',
  'Gadget Vendors',
  'Health & Utility Vendors',
];


const VendorActionsDropdown = ({ vendor, onEdit }: { vendor: Vendor, onEdit: (vendor: Vendor) => void }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button
            aria-haspopup="true"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
        >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
        </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(vendor)}>Edit</DropdownMenuItem>
            <DropdownMenuItem>View Performance</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
                Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);


export default function VendorManagementPage() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [selectedVendor, setSelectedVendor] = React.useState<Vendor | null>(null);

  const handleCreateNew = () => {
    setSelectedVendor(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsSheetOpen(true);
  };

  const sheetTitle = selectedVendor ? 'Edit Vendor' : 'Create New Vendor';
  const sheetDescription = selectedVendor
    ? "Update the details of this vendor."
    : "Add a new vendor to the platform.";

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Vendor Management
          </h1>
          <p className="text-muted-foreground">
            Add, edit, and manage all vendors operating on the platform.
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Vendor
        </Button>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {vendors.map(vendor => (
          <Card key={`${vendor.id}-mobile`}>
             <CardContent className="p-4 flex items-center justify-between">
               <div className="grid gap-1.5">
                  <p className="font-semibold">{vendor.name}</p>
                  <p className="text-sm text-muted-foreground">{vendor.items.length} items listed</p>
                   <div className="flex items-center gap-2 pt-1">
                      <Badge variant="outline">{vendor.category}</Badge>
                      <Badge
                        variant={vendor.status === 'Active' ? 'default' : 'outline'}
                        className={cn(
                           vendor.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-destructive/10 text-destructive'
                        )}
                      >
                        {vendor.status}
                      </Badge>
                    </div>
               </div>
               <VendorActionsDropdown vendor={vendor} onEdit={handleEdit} />
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Desktop View */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>All Vendors</CardTitle>
          <CardDescription>
            A list of all vendors on TrackSmart+.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map(vendor => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{vendor.category}</Badge>
                  </TableCell>
                  <TableCell>{vendor.items.length}</TableCell>
                  <TableCell>
                    <Badge
                      variant={vendor.status === 'Active' ? 'default' : 'outline'}
                      className={cn(
                        vendor.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-destructive/10 text-destructive'
                      )}
                    >
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <VendorActionsDropdown vendor={vendor} onEdit={handleEdit} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{sheetTitle}</SheetTitle>
            <SheetDescription>{sheetDescription}</SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Vendor Name</Label>
              <Input id="name" defaultValue={selectedVendor?.name} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="category">Category</Label>
              <Select defaultValue={selectedVendor?.category}>
                  <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                      {vendorCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>
             <div className="flex items-center space-x-2">
                <Switch id="status" defaultChecked={selectedVendor?.status === 'Active' ?? true} />
                <Label htmlFor="status">Vendor is Active</Label>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit">Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
