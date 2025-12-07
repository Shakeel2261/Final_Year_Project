"use client";

import type React from "react";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  initialProducts,
  productCategories,
  productTypes,
  type Product,
} from "@/lib/mock-data";

// Category type
export type Category = {
  id: string;
  name: string;
  description: string;
};

// Initial categories
const initialCategories: Category[] = productCategories.map((name, index) => ({
  id: crypto.randomUUID(),
  name,
  description: `Category for ${name.toLowerCase()}`,
}));

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchQ =
        q.trim().length === 0 ||
        i.name.toLowerCase().includes(q.toLowerCase()) ||
        i.sku.toLowerCase().includes(q.toLowerCase());
      const matchCat = cat === "all" || i.category === cat;
      const matchType = type === "all" || i.type === type;
      return matchQ && matchCat && matchType;
    });
  }, [items, q, cat, type]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  function onDelete(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function onSave(product: Product) {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists
        ? prev.map((p) => (p.id === product.id ? product : p))
        : [{ ...product }, ...prev];
    });
  }

  // Category functions
  function onDeleteCategory(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  function onSaveCategory(category: Category) {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === category.id);
      return exists
        ? prev.map((c) => (c.id === category.id ? category : c))
        : [{ ...category }, ...prev];
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-balance">Catalog</h1>
      </header>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card className="bg-card text-card-foreground">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Products</CardTitle>
              <div className="flex gap-2">
                <BulkStockDialog products={items} onUpdate={onSave} />
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <ProductDialog onSave={onSave} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-3">
                  <Input
                    placeholder="Search by name or SKU"
                    value={q}
                    onChange={(e) => {
                      setQ(e.target.value);
                      setPage(1);
                    }}
                    className="w-64 bg-background"
                  />
                  <Select
                    value={cat}
                    onValueChange={(v) => {
                      setCat(v);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-48 bg-background">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={type}
                    onValueChange={(v) => {
                      setType(v);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-48 bg-background">
                      <SelectValue placeholder="Product Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="purchase">
                        Purchase (Inventory)
                      </SelectItem>
                      <SelectItem value="sale">Sale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                  {filtered.length} results • Page {page} of {totalPages}
                </div>
              </div>

              <div className="rounded-md border border-border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">
                        Reorder Point
                      </TableHead>
                      <TableHead className="text-right">
                        Regular Price
                      </TableHead>
                      <TableHead className="text-right">
                        Premium Price
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paged.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.sku}</TableCell>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{p.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              p.type === "purchase" ? "default" : "outline"
                            }
                            className={
                              p.type === "purchase"
                                ? "bg-blue-600 text-white"
                                : ""
                            }
                          >
                            {p.type === "purchase" ? "Purchase" : "Sale"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              p.stock <= (p.reorderPoint || 0)
                                ? "text-red-600 font-bold"
                                : ""
                            }
                          >
                            {p.stock}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {p.reorderPoint || 0}
                        </TableCell>
                        <TableCell className="text-right">
                          ${p.regularPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${p.premiumPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <ProductDialog existing={p} onSave={onSave}>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 bg-transparent"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </ProductDialog>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8 bg-transparent hover:bg-transparent"
                            onClick={() => onDelete(p.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {paged.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center text-muted-foreground"
                        >
                          No products found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (num) => (
                      <Button
                        key={num}
                        variant={page === num ? "default" : "outline"}
                        onClick={() => setPage(num)}
                        className={page === num ? "bg-blue-600 text-white" : ""}
                      >
                        {num}
                      </Button>
                    )
                  )}
                </div>

                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card className="bg-card text-card-foreground">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Categories</CardTitle>
              <CategoryDialog onSave={onSaveCategory} />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>{c.description}</TableCell>
                        <TableCell className="flex gap-2">
                          <CategoryDialog existing={c} onSave={onSaveCategory}>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 bg-transparent"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </CategoryDialog>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8 bg-transparent hover:bg-transparent"
                            onClick={() => onDeleteCategory(c.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {categories.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-muted-foreground"
                        >
                          No categories found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductDialog({
  existing,
  onSave,
  children,
}: {
  existing?: Product;
  onSave: (p: Product) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Product>(
    existing ?? {
      id: crypto.randomUUID(),
      sku: "",
      name: "",
      category: productCategories[0],
      stock: 0,
      regularPrice: 0,
      premiumPrice: 0,
      type: "sale",
    }
  );

  function submit() {
    if (!form.name || !form.sku) return;
    onSave(form);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle>{existing ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={form.sku}
              onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              className="bg-background"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="bg-background"
            />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Product Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, type: v as Product["type"] }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase (Inventory)</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={form.stock}
                onChange={(e) =>
                  setForm((f) => ({ ...f, stock: Number(e.target.value) }))
                }
                className="bg-background"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reorderPoint">Reorder Point</Label>
              <Input
                id="reorderPoint"
                type="number"
                value={form.reorderPoint || 0}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    reorderPoint: Number(e.target.value),
                  }))
                }
                className="bg-background"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="regularPrice">Price</Label>
              <Input
                id="regularPrice"
                type="number"
                step="0.01"
                value={form.regularPrice}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    regularPrice: Number(e.target.value),
                  }))
                }
                className="bg-background"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submit}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {existing ? "Save Changes" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BulkStockDialog({
  products,
  onUpdate,
}: {
  products: Product[];
  onUpdate: (product: Product) => void;
}) {
  const [open, setOpen] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<
    "add" | "subtract" | "set"
  >("add");
  const [adjustmentValue, setAdjustmentValue] = useState<number>(0);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [reason, setReason] = useState("");

  const handleBulkUpdate = () => {
    selectedProducts.forEach((productId) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        let newStock = product.stock;

        switch (adjustmentType) {
          case "add":
            newStock = product.stock + adjustmentValue;
            break;
          case "subtract":
            newStock = Math.max(0, product.stock - adjustmentValue);
            break;
          case "set":
            newStock = adjustmentValue;
            break;
        }

        onUpdate({ ...product, stock: newStock });
      }
    });

    setOpen(false);
    setSelectedProducts([]);
    setAdjustmentValue(0);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Bulk Stock Update
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-popover text-popover-foreground max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Stock Adjustment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Select Products</Label>
            <div className="max-h-40 overflow-y-auto border rounded p-2">
              {products.map((product) => (
                <label key={product.id} className="flex items-center gap-2 p-1">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts([...selectedProducts, product.id]);
                      } else {
                        setSelectedProducts(
                          selectedProducts.filter((id) => id !== product.id)
                        );
                      }
                    }}
                  />
                  <span className="text-sm">
                    {product.name} ({product.sku}) - Stock: {product.stock}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Adjustment Type</Label>
              <Select
                value={adjustmentType}
                onValueChange={(v: "add" | "subtract" | "set") =>
                  setAdjustmentType(v)
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add to Stock</SelectItem>
                  <SelectItem value="subtract">Subtract from Stock</SelectItem>
                  <SelectItem value="set">Set Stock Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Value</Label>
              <Input
                type="number"
                value={adjustmentValue}
                onChange={(e) => setAdjustmentValue(Number(e.target.value))}
                className="bg-background"
                min="0"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Stock received, Damaged goods, etc."
              className="bg-background"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBulkUpdate}
              disabled={selectedProducts.length === 0 || adjustmentValue < 0}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Update Stock ({selectedProducts.length} products)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CategoryDialog({
  existing,
  onSave,
  children,
}: {
  existing?: Category;
  onSave: (c: Category) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Category>(
    existing ?? {
      id: crypto.randomUUID(),
      name: "",
      description: "",
    }
  );

  function submit() {
    if (!form.name) return;
    onSave(form);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle>
            {existing ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="bg-background"
            />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="bg-background"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submit}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {existing ? "Save Changes" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
