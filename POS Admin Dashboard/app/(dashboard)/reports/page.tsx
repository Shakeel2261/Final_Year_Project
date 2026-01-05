"use client";

import { useMemo, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchSalesReport,
  fetchPurchaseReport,
  fetchRevenueReport,
} from "@/lib/store/slices/reportsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Legend,
} from "recharts";
import { Loader2, RefreshCw } from "lucide-react";

export default function ReportsPage() {
  const dispatch = useAppDispatch();
  const { salesReport, purchaseReport, revenueReport, loading } = useAppSelector(
    (state) => state.reports
  );

  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  useEffect(() => {
    const params: Record<string, string> = {};
    if (from) params.fromDate = from;
    if (to) params.toDate = to;

    dispatch(fetchSalesReport(params));
    dispatch(fetchPurchaseReport(params));
    dispatch(fetchRevenueReport());
  }, [dispatch, from, to]);

  const salesChartData = useMemo(() => {
    return (
      salesReport?.data?.chartData?.map((item: any) => ({
        label: item.week,
        sales: item.sales,
      })) || []
    );
  }, [salesReport]);

  const purchaseChartData = useMemo(() => {
    return (
      purchaseReport?.data?.chartData?.map((item: any) => ({
        label: item.week,
        purchases: item.purchases,
      })) || []
    );
  }, [purchaseReport]);

  const revenueChartData = useMemo(() => {
    return (
      revenueReport?.data?.chartData?.map((item: any) => ({
        month: item.month,
        revenue: item.revenue,
      })) || []
    );
  }, [revenueReport]);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const params: Record<string, string> = {};
            if (from) params.fromDate = from;
            if (to) params.toDate = to;
            dispatch(fetchSalesReport(params));
            dispatch(fetchPurchaseReport(params));
            dispatch(fetchRevenueReport());
          }}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">From Date</label>
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-background"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">To Date</label>
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-background"
          />
        </div>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="bg-secondary text-secondary-foreground">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Sales Report (Last 12 Weeks)</CardTitle>
              {salesReport?.data?.summary && (
                <p className="text-sm text-muted-foreground">
                  Total Sales: ${salesReport.data.summary.totalSales?.toLocaleString() || 0} | 
                  Average: ${salesReport.data.summary.averageSales?.toLocaleString() || 0} | 
                  Orders: {salesReport.data.summary.totalOrders || 0}
                </p>
              )}
            </CardHeader>
            <CardContent className="h-80">
              {loading && salesChartData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : salesChartData.length > 0 ? (
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
                  <Legend />
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
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Purchase Report (Last 12 Weeks)</CardTitle>
              {purchaseReport?.data?.summary && (
                <p className="text-sm text-muted-foreground">
                  Total Purchases: ${purchaseReport.data.summary.totalPurchases?.toLocaleString() || 0} | 
                  Average: ${purchaseReport.data.summary.averagePurchases?.toLocaleString() || 0}
                </p>
              )}
            </CardHeader>
            <CardContent className="h-80">
              {loading && purchaseChartData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : purchaseChartData.length > 0 ? (
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
                  <Legend />
                  <Bar dataKey="purchases" fill="var(--color-chart-4)" />
                </BarChart>
              </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No purchase data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Monthly Revenue Report</CardTitle>
              {revenueReport?.data?.summary && (
                <p className="text-sm text-muted-foreground">
                  Total Revenue: ${revenueReport.data.summary.totalRevenue?.toLocaleString() || 0} | 
                  Average: ${revenueReport.data.summary.averageMonthlyRevenue?.toLocaleString() || 0}
                </p>
              )}
            </CardHeader>
            <CardContent className="h-80">
              {loading && revenueChartData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : revenueChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-border)"
                    />
                    <XAxis
                      dataKey="month"
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
                    <Legend />
                    <Bar dataKey="revenue" fill="var(--color-chart-2)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No revenue data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

