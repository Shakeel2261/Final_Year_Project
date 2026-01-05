"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchDashboardSummary,
  fetchSalesReport,
  fetchPurchaseReport,
} from "@/lib/store/slices/reportsSlice";
import { fetchProducts } from "@/lib/store/slices/productsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  AlertTriangle,
  Bell,
  Loader2,
} from "lucide-react";

const kpiIcons = {
  sales: ShoppingCart,
  products: Package,
  customers: Users,
  transactions: CreditCard,
};

export default function DashboardHome() {
  const dispatch = useAppDispatch();
  const { dashboardSummary, salesReport, purchaseReport, loading: reportsLoading } = useAppSelector(
    (state) => state.reports
  );
  const { items: products, loading: productsLoading } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchSalesReport());
    dispatch(fetchPurchaseReport());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Get low stock products (stock <= 10)
  const lowStockProducts = products.filter(
    (p) => ((p.stockQuantity || 0) - (p.reservedStock || 0)) <= 10
  );

  // Prepare KPIs from dashboard summary
  const kpis = dashboardSummary?.data
    ? [
        {
          key: "sales",
          label: "Sales (Today)",
          value: `$${dashboardSummary.data.todayStats?.sales?.toLocaleString() || 0}`,
          delta: `${dashboardSummary.data.todayStats?.orders || 0} orders today`,
        },
        {
          key: "products",
          label: "Products",
          value: dashboardSummary.data.totalStats?.products?.toString() || "0",
          delta: "Total in inventory",
        },
        {
          key: "customers",
          label: "Customers",
          value: dashboardSummary.data.totalStats?.customers?.toString() || "0",
          delta: "Total registered",
        },
        {
          key: "transactions",
          label: "Transactions",
          value: dashboardSummary.data.totalStats?.transactions?.toString() || "0",
          delta: `$${dashboardSummary.data.totalStats?.receivables?.toLocaleString() || 0} receivables`,
        },
      ]
    : [];

  // Prepare chart data
  const salesChartData =
    salesReport?.data?.chartData?.map((item: any) => ({
      label: item.week,
      sales: item.sales,
    })) || [];

  const purchaseChartData =
    purchaseReport?.data?.chartData?.map((item: any) => ({
      label: item.week,
      purchases: item.purchases,
    })) || [];

  if (reportsLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-balance">Overview</h1>
        {lowStockProducts.length > 0 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            {lowStockProducts.length} Stock Alert
            {lowStockProducts.length > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.length > 0 ? (
          kpis.map((kpi) => {
            const Icon = kpiIcons[kpi.key as keyof typeof kpiIcons];
            return (
              <Card key={kpi.key} className="bg-card text-card-foreground">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {kpi.label}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className="text-xs text-muted-foreground">{kpi.delta}</p>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-4 text-center text-muted-foreground py-8">
            Loading dashboard data...
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-pretty">Sales (Last 12 Weeks)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {salesChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "var(--color-muted-foreground)" }}
                  />
                  <YAxis tick={{ fill: "var(--color-muted-foreground)" }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      color: "var(--color-popover-foreground)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No sales data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-pretty">
              Purchases (Last 12 Weeks)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {purchaseChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={purchaseChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "var(--color-muted-foreground)" }}
                  />
                  <YAxis tick={{ fill: "var(--color-muted-foreground)" }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      color: "var(--color-popover-foreground)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <Bar dataKey="purchases" fill="var(--color-chart-2)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No purchase data available
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Low Stock Summary */}
      {lowStockProducts.length > 0 && (
        <section>
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Low Stock Items ({lowStockProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {lowStockProducts.slice(0, 6).map((product) => {
                  const availableStock = (product.stockQuantity || 0) - (product.reservedStock || 0);
                  return (
                    <div
                      key={product._id}
                      className="flex justify-between items-center p-2 border rounded"
                    >
                      <div>
                        <p className="font-medium text-sm">{product.productName || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.productCode || "N/A"}
                        </p>
                      </div>
                      <Badge
                        variant={availableStock === 0 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {availableStock === 0 ? "Out" : availableStock}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Recent Orders */}
      {dashboardSummary?.data?.recentOrders && dashboardSummary.data.recentOrders.length > 0 && (
        <section>
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dashboardSummary.data.recentOrders.slice(0, 5).map((order: any) => (
                  <div
                    key={order.id || order._id}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{order.customer || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(order.totalAmount || 0).toFixed(2)}</p>
                      <Badge variant={order.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {order.status || "pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
