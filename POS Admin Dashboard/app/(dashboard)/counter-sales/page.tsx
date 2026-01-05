"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  DollarSign,
  Search,
  Package,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProducts } from "@/lib/store/slices/productsSlice";
import { fetchCategories } from "@/lib/store/slices/categoriesSlice";
import { createOrder } from "@/lib/store/slices/ordersSlice";
import type { Product } from "@/lib/store/slices/productsSlice";
import { productCategories } from "@/lib/mock-data";

interface CartItem {
  product: Product;
  quantity: number;
  price: number; // Price at time of sale (regular or premium)
}

export default function CounterSalesPage() {
  const dispatch = useAppDispatch();
  const { items: products, loading: productsLoading } = useAppSelector(
    (state) => state.products
  );
  const { items: categories, loading: categoriesLoading } = useAppSelector(
    (state) => state.categories
  );
  const { loading: orderLoading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [customerType, setCustomerType] = useState<"regular" | "premium">(
    "regular"
  );
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  // Filter products for sale only (active products with stock)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        (product.productName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.productCode || "").toLowerCase().includes(searchQuery.toLowerCase());

      const categoryId = typeof product.category === "object" ? product.category._id : product.category;
      const categoryName = typeof product.category === "object" ? product.category.name : "";
      const matchesCategory =
        selectedCategory === "all" || 
        categoryId === selectedCategory ||
        categoryName === selectedCategory;

      return (
        matchesSearch && 
        matchesCategory && 
        product.status === "active" &&
        (product.stockQuantity || 0) > 0
      );
    });
  }, [products, searchQuery, selectedCategory]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product._id === product._id);
    const stock = product.stockQuantity || 0;

    if (existingItem) {
      if (existingItem.quantity < stock) {
        setCart(
          cart.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
        // Show success feedback
        setAddedToCart(product._id);
        setTimeout(() => setAddedToCart(null), 1500);
      }
    } else {
      const price = product.price || 0;
      setCart([...cart, { product, quantity: 1, price }]);
      // Show success feedback
      setAddedToCart(product._id);
      setTimeout(() => setAddedToCart(null), 1500);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find((p) => p._id === productId);
    const stock = product?.stockQuantity || 0;
    if (product && newQuantity <= stock) {
      setCart(
        cart.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product._id !== productId));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId: string) => {
    return cart.some((item) => item.product._id === productId);
  };

  const getCartQuantity = (productId: string) => {
    const item = cart.find((item) => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  const processSale = async () => {
    if (cart.length === 0) return;

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        finalPrice: item.price,
      }));

      const orderData = {
        items: orderItems,
        totalAmount: getTotal() * 1.1, // Including tax
        status: "completed" as const,
      };

      await dispatch(createOrder(orderData)).unwrap();
      
      alert(
        `Sale completed! Total: $${(getTotal() * 1.1).toFixed(
          2
        )}\n\nOrder has been created and stock levels updated.`
      );
      setCart([]);
    } catch (error: any) {
      alert(`Error processing sale: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-balance flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Counter Sales
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Available Products
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {productCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Products Grid */}
              {productsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product) => {
                    const cartQuantity = getCartQuantity(product._id);
                    const isProductInCart = isInCart(product._id);
                    const isRecentlyAdded = addedToCart === product._id;
                    const stock = product.stockQuantity || 0;
                    const price = product.price || 0;
                    const categoryName = typeof product.category === "object" 
                      ? product.category.name 
                      : product.category || "";

                    return (
                      <div
                        key={product._id}
                        className={`border rounded-lg p-3 hover:bg-muted/50 transition-all duration-200 ${
                          isRecentlyAdded
                            ? "ring-2 ring-green-500 bg-green-50"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-sm">
                              {product.productName || "Unnamed Product"}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {product.productCode || "N/A"}
                            </p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {categoryName}
                            </Badge>
                            {isProductInCart && (
                              <Badge
                                variant="default"
                                className="text-xs mt-1 ml-1 bg-blue-600"
                              >
                                In Cart ({cartQuantity})
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">
                              ${price.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Stock: {stock}
                            </p>
                            {stock <= 5 && stock > 0 && (
                              <p className="text-xs text-orange-600 font-medium">
                                Low Stock!
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                            className={`flex-1 ${
                              isRecentlyAdded
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700"
                            }`}
                            disabled={stock === 0}
                          >
                            {isRecentlyAdded ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Added!
                              </>
                            ) : (
                              <>
                                <Plus className="h-3 w-3 mr-1" />
                                Add to Cart
                              </>
                            )}
                          </Button>

                          {isProductInCart && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateQuantity(product._id, cartQuantity + 1)
                              }
                              disabled={cartQuantity >= stock}
                              className="px-2"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>

                        {stock === 0 && (
                          <div className="flex items-center gap-1 mt-2 text-red-600 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            Out of Stock
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart ({getItemCount()} items)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">No items in cart</p>
                  <p className="text-xs text-muted-foreground">
                    Add products from the left to get started
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {cart.map((item) => {
                      const stock = item.product.stockQuantity || 0;
                      return (
                        <div
                          key={item.product._id}
                          className="flex items-center gap-2 p-2 border rounded"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {item.product.productName || "Unnamed Product"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateQuantity(item.product._id, item.quantity - 1)
                              }
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-6 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateQuantity(item.product._id, item.quantity + 1)
                              }
                              className="h-6 w-6 p-0"
                              disabled={item.quantity >= stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeFromCart(item.product._id)}
                              className="h-6 w-6 p-0 ml-1"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${getTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (10%):</span>
                      <span>${(getTotal() * 0.1).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>${(getTotal() * 1.1).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={processSale}
                      disabled={orderLoading || cart.length === 0}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600"
                    >
                      {orderLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Process Sale
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCart([])}
                      className="w-full"
                    >
                      Clear Cart
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
