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
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { vendors } from '@/lib/data';
import type { VendorItem } from '@/lib/types';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// Flatten the meals data
const allMeals = vendors.flatMap(vendor =>
  vendor.items.map(item => ({
    ...item,
    vendorName: vendor.name,
    vendorCategory: vendor.category,
    // Add a placeholder for status
    status: 'Enabled' as 'Enabled' | 'Disabled',
  }))
);

type MealWithVendor = (typeof allMeals)[0];

export default function MealManagementPage() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [selectedMeal, setSelectedMeal] = React.useState<MealWithVendor | null>(null);

  const handleCreateNew = () => {
    setSelectedMeal(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (meal: MealWithVendor) => {
    setSelectedMeal(meal);
    setIsSheetOpen(true);
  };

  const sheetTitle = selectedMeal ? 'Edit Meal' : 'Create New Meal';
  const sheetDescription = selectedMeal
    ? "Update the details of this meal."
    : "Add a new meal to the menu.";

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Meal & Menu Management
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and manage all meals available on the platform.
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Meal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Meals</CardTitle>
          <CardDescription>
            A list of all meals from all vendors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allMeals.map(meal => (
                <TableRow key={`${meal.name}-${meal.vendorName}`}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={meal.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={meal.imageUrl}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{meal.name}</TableCell>
                  <TableCell>{meal.vendorName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={meal.status === 'Enabled' ? 'default' : 'outline'}
                      className={
                        meal.status === 'Enabled'
                          ? 'bg-green-100 text-green-800'
                          : ''
                      }
                    >
                      {meal.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ₦{meal.price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(meal)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
              <Label htmlFor="name">Meal Name</Label>
              <Input id="name" defaultValue={selectedMeal?.name} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                defaultValue={selectedMeal?.description}
                className="min-h-32"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                    <Label htmlFor="price">Price (₦)</Label>
                    <Input id="price" type="number" defaultValue={selectedMeal?.price} />
                </div>
                 <div className="grid gap-3">
                    <Label htmlFor="vendor">Vendor</Label>
                    <Select defaultValue={selectedMeal?.vendorName}>
                        <SelectTrigger id="vendor">
                            <SelectValue placeholder="Select a vendor" />
                        </SelectTrigger>
                        <SelectContent>
                            {vendors.map(v => (
                                <SelectItem key={v.name} value={v.name}>{v.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="grid gap-3">
                <Label htmlFor="image-url">Image URL</Label>
                <Input id="image-url" defaultValue={selectedMeal?.imageUrl} />
            </div>
             <div className="flex items-center space-x-2">
                <Switch id="status" defaultChecked={selectedMeal?.status === 'Enabled' ?? true} />
                <Label htmlFor="status">Meal is Enabled</Label>
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
