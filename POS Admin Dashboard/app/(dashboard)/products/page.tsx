"use client";

import type React from "react";

import { useMemo, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
} from "@/lib/store/slices/productsSlice";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from "@/lib/store/slices/categoriesSlice";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Download,
  RefreshCw,
  Loader2,
} from "lucide-react";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items, loading: productsLoading, error: productsError } = useAppSelector(
    (state) => state.products
  );
  const { items: categories, loading: categoriesLoading } = useAppSelector(
    (state) => state.categories
  );

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const categoryName =
        typeof i.category === "object" 
          ? (i.category?.name || "")
          : (i.category || "");
      const matchQ =
        q.trim().length === 0 ||
        (i.productName || "").toLowerCase().includes(q.toLowerCase()) ||
        (i.productCode || "").toLowerCase().includes(q.toLowerCase());
      const matchCat = cat === "all" || categoryName === cat;
      // Note: type filter removed as backend doesn't have this field
      return matchQ && matchCat;
    });
  }, [items, q, cat]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await dispatch(deleteProduct(id));
  }
  };

  const handleSave = async (productData: Partial<Product> | FormData) => {
    if (productData instanceof FormData) {
      await dispatch(createProduct(productData));
    } else {
      if ((productData as any)._id) {
        await dispatch(
          updateProduct({ id: (productData as any)._id, data: productData })
        );
      } else {
        await dispatch(createProduct(productData));
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await dispatch(deleteCategory(id));
  }
  };

  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    if ((categoryData as any)._id) {
      await dispatch(
        updateCategory({ id: (categoryData as any)._id, data: categoryData })
      );
    } else {
      await dispatch(createCategory(categoryData));
    }
  };

  if (productsLoading && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-balance">Catalog</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            dispatch(fetchProducts());
            dispatch(fetchCategories());
          }}
          disabled={productsLoading || categoriesLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${productsLoading || categoriesLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </header>

      {productsError && (
        <Alert variant="destructive">
          <AlertDescription>{productsError}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card className="bg-card text-card-foreground">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Products ({items.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <ProductDialog onSave={handleSave} categories={categories} />
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
                        <SelectItem key={c._id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
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
                    {paged.map((p) => {
                      const categoryName =
                        typeof p.category === "object" 
                          ? (p.category?.name || "N/A")
                          : (p.category || "N/A");
                      const availableStock = (p.stockQuantity || 0) - (p.reservedStock || 0);
                      return (
                        <TableRow key={p._id}>
                          <TableCell>{p.productCode || "N/A"}</TableCell>
                          <TableCell className="font-medium">{p.productName || "N/A"}</TableCell>
                        <TableCell>
                            <Badge variant="secondary">{categoryName}</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={p.status === "active" ? "default" : "outline"}>
                              {p.status || "inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                                availableStock <= 10
                                ? "text-red-600 font-bold"
                                : ""
                            }
                          >
                              {availableStock}
                          </span>
                        </TableCell>
                          <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right">
                            ${(p.price || 0).toFixed(2)}
                        </TableCell>
                          <TableCell className="text-right">-</TableCell>
                        <TableCell className="flex gap-2">
                            <ProductDialog
                              existing={p}
                              onSave={handleSave}
                              categories={categories}
                            >
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
                              onClick={() => handleDelete(p._id)}
                              disabled={productsLoading}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      );
                    })}
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
              <CardTitle>Categories ({categories.length})</CardTitle>
              <CategoryDialog onSave={handleSaveCategory} />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((c) => (
                      <TableRow key={c._id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>{c.description || "-"}</TableCell>
                        <TableCell>{c.discount || 0}%</TableCell>
                        <TableCell className="flex gap-2">
                          <CategoryDialog
                            existing={c}
                            onSave={handleSaveCategory}
                          >
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
                            onClick={() => handleDeleteCategory(c._id)}
                            disabled={categoriesLoading}
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
  categories,
  children,
}: {
  existing?: Product;
  onSave: (p: Partial<Product> | FormData) => void;
  categories: Category[];
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<Partial<Product>>(
    existing
      ? {
          productName: existing.productName || "",
          productCode: existing.productCode || "",
          category:
            typeof existing.category === "object"
              ? existing.category?._id || ""
              : existing.category || "",
          price: existing.price || 0,
          description: existing.description || "",
          stockQuantity: existing.stockQuantity || 0,
          status: existing.status || "active",
        }
      : {
          productName: "",
          productCode: "",
          category: categories[0]?._id || "",
          price: 0,
          description: "",
          stockQuantity: 0,
          status: "active",
        }
  );

  const handleSubmit = async () => {
    if (!form.productName || !form.productCode || !form.category) return;

    if (imageFile || (existing && imageFile === null)) {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append("productName", form.productName);
      formData.append("productCode", form.productCode);
      formData.append("category", form.category as string);
      formData.append("price", form.price?.toString() || "0");
      formData.append("description", form.description || "");
      formData.append("stockQuantity", form.stockQuantity?.toString() || "0");
      formData.append("status", form.status || "active");
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await onSave(formData);
    } else {
      // Use JSON for update without image
      await onSave(form);
    }

    setOpen(false);
    setImageFile(null);
  };

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
            <Label htmlFor="productCode">Product Code (SKU)</Label>
            <Input
              id="productCode"
              value={form.productCode || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, productCode: e.target.value }))
              }
              className="bg-background"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={form.productName || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, productName: e.target.value }))
              }
              className="bg-background"
              required
            />
          </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
              value={form.category as string}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={form.price || 0}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))
                }
                className="bg-background"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input
                id="stockQuantity"
                type="number"
                value={form.stockQuantity || 0}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    stockQuantity: Number(e.target.value) || 0,
                  }))
                }
                className="bg-background"
                required
              />
            </div>
            </div>
            <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
              <Input
              id="description"
              value={form.description || ""}
                onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="bg-background"
              />
            </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Product Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="bg-background"
            />
            {existing?.imageUrl && !imageFile && (
              <p className="text-xs text-muted-foreground">
                Current: {existing.imageUrl}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v: "active" | "inactive") =>
                setForm((f) => ({ ...f, status: v }))
              }
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
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
  onSave: (c: Partial<Category>) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Category>>(
    existing
      ? {
          name: existing.name,
          description: existing.description || "",
          discount: existing.discount || 0,
        }
      : {
      name: "",
      description: "",
          discount: 0,
    }
  );

  const handleSubmit = async () => {
    if (!form.name) return;
    await onSave(form);
    setOpen(false);
  };

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
              required
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
          <div className="grid gap-2">
            <Label>Discount (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={form.discount}
              onChange={(e) =>
                setForm((f) => ({ ...f, discount: Number(e.target.value) }))
              }
              className="bg-background"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
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
