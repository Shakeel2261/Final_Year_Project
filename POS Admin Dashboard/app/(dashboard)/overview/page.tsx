"use client";

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
  salesSeries,
  purchaseSeries,
  kpis,
  initialStockAlerts,
  getLowStockProducts,
  initialProducts,
} from "@/lib/mock-data";
import {
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  AlertTriangle,
  Bell,
} from "lucide-react";

const kpiIcons = {
  sales: ShoppingCart,
  products: Package,
  customers: Users,
  transactions: CreditCard,
};

export default function DashboardHome() {
  const lowStockProducts = getLowStockProducts(initialProducts, 10);
  const activeAlerts = initialStockAlerts.filter(
    (alert) => alert.status === "active"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-balance">Overview</h1>
        {activeAlerts.length > 0 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            {activeAlerts.length} Stock Alert
            {activeAlerts.length > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
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
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-pretty">Sales (Last 12 Weeks)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesSeries}>
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
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-pretty">
              Purchases (Last 12 Weeks)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={purchaseSeries}>
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
          </CardContent>
        </Card>
      </section>

      {/* Stock Alerts Section */}
      {activeAlerts.length > 0 && (
        <section>
          <Card className="bg-card text-card-foreground border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="h-5 w-5" />
                Stock Alerts - Action Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activeAlerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex justify-between items-center p-3 border border-orange-200 rounded-lg bg-orange-50"
                  >
                    <div>
                      <p className="font-medium text-sm">{alert.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="text-xs">
                        {alert.currentStock === 0
                          ? "Out of Stock"
                          : `${alert.currentStock} left`}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Reorder at: {alert.reorderPoint}
                      </p>
                    </div>
                  </div>
                ))}
                {activeAlerts.length > 5 && (
                  <p className="text-center text-sm text-muted-foreground">
                    And {activeAlerts.length - 5} more alerts...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

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
                {lowStockProducts.slice(0, 6).map((product) => (
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
                    <Badge
                      variant={
                        product.stock === 0 ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {product.stock === 0 ? "Out" : product.stock}
                    </Badge>
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
