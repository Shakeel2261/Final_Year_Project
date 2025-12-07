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
  TrendingUp,
  AlertTriangle,
  Package,
  DollarSign,
  BarChart3,
  Plus,
  Download,
  RefreshCw,
  Bell,
  ShoppingCart,
  ArrowUpDown,
} from "lucide-react";
import {
  initialProducts,
  initialStockMovements,
  initialStockAlerts,
  initialStockHistory,
  initialReorderSuggestions,
  calculateInventoryValue,
  getLowStockProducts,
  getOutOfStockProducts,
  type Product,
  type StockMovement,
  type StockAlert,
  type StockHistory,
  type ReorderSuggestion,
} from "@/lib/mock-data";

export default function StockReportsPage() {
  const [products] = useState<Product[]>(initialProducts);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(
    initialStockMovements
  );
  const [stockAlerts, setStockAlerts] =
    useState<StockAlert[]>(initialStockAlerts);
  const [stockHistory] = useState<StockHistory[]>(initialStockHistory);
  const [reorderSuggestions] = useState<ReorderSuggestion[]>(
    initialReorderSuggestions
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterUrgency, setFilterUrgency] = useState<string>("all");

  // Calculate key metrics
  const inventoryValue = useMemo(
    () => calculateInventoryValue(products),
    [products]
  );
  const lowStockProducts = useMemo(
    () => getLowStockProducts(products, 10),
    [products]
  );
  const outOfStockProducts = useMemo(
    () => getOutOfStockProducts(products),
    [products]
  );
  const totalProducts = products.length;
  const activeAlerts = stockAlerts.filter(
    (alert) => alert.status === "active"
  ).length;

  // Filter functions
  const filteredMovements = useMemo(() => {
    return stockMovements.filter((movement) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        movement.productName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        movement.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movement.reason.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === "all" || movement.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [stockMovements, searchQuery, filterType]);

  const filteredReorderSuggestions = useMemo(() => {
    return reorderSuggestions.filter((suggestion) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        suggestion.productName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        suggestion.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesUrgency =
        filterUrgency === "all" || suggestion.urgency === filterUrgency;

      return matchesSearch && matchesUrgency;
    });
  }, [reorderSuggestions, searchQuery, filterUrgency]);

  const getUrgencyColor = (urgency: ReorderSuggestion["urgency"]) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getMovementTypeColor = (type: StockMovement["type"]) => {
    switch (type) {
      case "in":
        return "bg-green-100 text-green-700";
      case "out":
        return "bg-red-100 text-red-700";
      case "adjustment":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const resolveAlert = (alertId: string) => {
    setStockAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "resolved" as const,
              resolvedAt: new Date().toISOString().slice(0, 10),
            }
          : alert
      )
    );
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Stock Reports & Management
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inventory Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${inventoryValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Current stock value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Items in catalog</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {lowStockProducts.length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {activeAlerts}
            </div>
            <p className="text-xs text-muted-foreground">Require action</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
          <TabsTrigger value="reorder">Reorder Suggestions</TabsTrigger>
          <TabsTrigger value="history">Stock History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Low Stock Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Low Stock Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center p-2 border rounded"
                    >
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.sku}
                        </p>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {product.stock} left
                      </Badge>
                    </div>
                  ))}
                  {lowStockProducts.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No low stock items
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Out of Stock Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-red-600" />
                  Out of Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {outOfStockProducts.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center p-2 border rounded"
                    >
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.sku}
                        </p>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        Out of Stock
                      </Badge>
                    </div>
                  ))}
                  {outOfStockProducts.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      All items in stock
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Stock Movements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Recent Stock Movements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>User</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockMovements.slice(0, 10).map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="text-sm">
                          {movement.date}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">
                              {movement.productName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {movement.sku}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getMovementTypeColor(movement.type)}
                          >
                            {movement.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              movement.type === "out"
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {movement.type === "out" ? "-" : "+"}
                            {movement.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          {movement.reason}
                        </TableCell>
                        <TableCell className="text-sm">
                          {movement.user}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Movements Tab */}
        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Search products, SKU, or reason..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Movement Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="in">Stock In</SelectItem>
                    <SelectItem value="out">Stock Out</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border border-border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>User</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="text-sm">
                          {movement.date}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">
                              {movement.productName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {movement.sku}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getMovementTypeColor(movement.type)}
                          >
                            {movement.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              movement.type === "out"
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {movement.type === "out" ? "-" : "+"}
                            {movement.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          {movement.reason}
                        </TableCell>
                        <TableCell className="text-sm">
                          {movement.reference || "-"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {movement.user}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Reorder Point</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">
                              {alert.productName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {alert.sku}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              alert.currentStock === 0
                                ? "text-red-600 font-bold"
                                : "text-orange-600"
                            }
                          >
                            {alert.currentStock}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {alert.reorderPoint}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              alert.status === "active"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {alert.status === "active" ? "Active" : "Resolved"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {alert.createdAt}
                        </TableCell>
                        <TableCell>
                          {alert.status === "active" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resolveAlert(alert.id)}
                            >
                              Resolve
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reorder Suggestions Tab */}
        <TabsContent value="reorder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Reorder Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Search products or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Urgency Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border border-border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Reorder Point</TableHead>
                      <TableHead>Suggested Qty</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Avg Monthly Sales</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReorderSuggestions.map((suggestion) => (
                      <TableRow key={suggestion.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">
                              {suggestion.productName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {suggestion.sku}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              suggestion.currentStock === 0
                                ? "text-red-600 font-bold"
                                : "text-orange-600"
                            }
                          >
                            {suggestion.currentStock}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {suggestion.reorderPoint}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {suggestion.suggestedQuantity}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getUrgencyColor(suggestion.urgency)}
                          >
                            {suggestion.urgency.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {suggestion.avgMonthlySales}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Create PO
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Stock History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Opening</TableHead>
                      <TableHead className="text-right">Stock In</TableHead>
                      <TableHead className="text-right">Stock Out</TableHead>
                      <TableHead className="text-right">Adjustments</TableHead>
                      <TableHead className="text-right">Closing</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockHistory.slice(0, 20).map((history) => (
                      <TableRow key={history.id}>
                        <TableCell className="text-sm">
                          {history.date}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">
                              {history.productName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {history.sku}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {history.openingStock}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          +{history.stockIn}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          -{history.stockOut}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              history.adjustments >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {history.adjustments >= 0 ? "+" : ""}
                            {history.adjustments}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {history.closingStock}
                        </TableCell>
                      </TableRow>
                    ))}
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
