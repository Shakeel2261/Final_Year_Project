"use client";

import type React from "react";

import { useMemo, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  type Order,
} from "@/lib/store/slices/ordersSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pencil, Plus, Trash2, Loader2, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";

const orderStatuses: Order["status"][] = ["pending", "processing", "completed", "cancelled"];

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.orders);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const customerName =
        typeof i.customer === "object" ? i.customer.name : i.customer || "";
      const matchQ =
        q.trim().length === 0 ||
        i._id.toLowerCase().includes(q.toLowerCase()) ||
        customerName.toLowerCase().includes(q.toLowerCase());
      const matchS = status === "all" || i.status === status;
      return matchQ && matchS;
    });
  }, [items, q, status]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      await dispatch(deleteOrder(id));
  }
  };

  const handleSave = async (orderData: Partial<Order>) => {
    if ((orderData as any)._id) {
      // Update existing order
      await dispatch(
        updateOrderStatus({
          id: (orderData as any)._id,
          status: orderData.status || "pending",
        })
      );
    } else {
      // Create new order
      await dispatch(createOrder(orderData));
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    await dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders ({items.length})</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(fetchOrders())}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <OrderDialog onSave={handleSave} />
        </div>
      </header>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-3">
              <Input
                placeholder="Search by ID or Customer"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                className="w-64 bg-background"
              />
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-48 bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {orderStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
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
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((o) => {
                  const customerName =
                    typeof o.customer === "object" ? o.customer.name : o.customer || "N/A";
                  return (
                    <TableRow key={o._id}>
                      <TableCell className="font-medium">{o._id.slice(-8)}</TableCell>
                      <TableCell>{customerName}</TableCell>
                      <TableCell className="text-right">{(o.items || []).length}</TableCell>
                    <TableCell className="text-right">
                        ${(o.totalAmount || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={o.status}
                        onValueChange={(value) => {
                            handleStatusChange(o._id, value as Order["status"]);
                        }}
                          disabled={loading}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium ${
                                o.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : o.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                                {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {orderStatuses.map((s) => (
                              <SelectItem key={s} value={s}>
                                <span
                                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                                    s === "pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : s === "completed"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                            </span>
                          </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell className="flex gap-2">
                        <OrderDialog existing={o} onSave={handleSave}>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 bg-transparent"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </OrderDialog>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 bg-transparent hover:bg-transparent"
                          onClick={() => handleDelete(o._id)}
                          disabled={loading}
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
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No orders found
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
    </div>
  );
}

function OrderDialog({
  existing,
  onSave,
  children,
}: {
  existing?: Order;
  onSave: (o: Partial<Order>) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Order>>(
    existing
      ? {
          customer: typeof existing.customer === "object" ? existing.customer._id : existing.customer,
          items: existing.items,
          totalAmount: existing.totalAmount,
          status: existing.status,
        }
      : {
      customer: "",
          items: [],
          totalAmount: 0,
          status: "pending",
    }
  );

  const handleSubmit = async () => {
    if (!form.customer) return;
    await onSave(form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Order
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle>{existing ? "Edit Order" : "Add Order"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Customer ID</Label>
            <Input
              value={form.customer as string}
              onChange={(e) =>
                setForm((f) => ({ ...f, customer: e.target.value }))
              }
              className="bg-background"
              placeholder="Customer ID or leave empty"
            />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Total Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={form.totalAmount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, totalAmount: Number(e.target.value) }))
                }
                className="bg-background"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, status: v as Order["status"] }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {orderStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Note: For creating orders with items, use the API directly or the counter sales page.
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

