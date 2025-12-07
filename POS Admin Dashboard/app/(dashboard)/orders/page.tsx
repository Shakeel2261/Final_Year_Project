"use client";

import type React from "react";

import { useMemo, useState } from "react";
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
import { initialOrders, type Order, orderStatuses } from "@/lib/mock-data";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function OrdersPage() {
  const [items, setItems] = useState<Order[]>(initialOrders);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchQ =
        q.trim().length === 0 ||
        i.id.toLowerCase().includes(q.toLowerCase()) ||
        i.customer.toLowerCase().includes(q.toLowerCase());
      const matchS = status === "all" || i.status === status;
      return matchQ && matchS;
    });
  }, [items, q, status]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  function onDelete(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function onSave(order: Order) {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === order.id);
      return exists
        ? prev.map((p) => (p.id === order.id ? order : p))
        : [{ ...order }, ...prev];
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <OrderDialog onSave={onSave} />
      </header>

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
                {paged.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{o.customer}</TableCell>
                    <TableCell className="text-right">{o.items}</TableCell>
                    <TableCell className="text-right">
                      ${o.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={o.status}
                        onValueChange={(value) => {
                          const updatedOrder = {
                            ...o,
                            status: value as Order["status"],
                          };
                          onSave(updatedOrder);
                        }}
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
                              {o.status.charAt(0).toUpperCase() +
                                o.status.slice(1)}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">
                            <span className="px-2 py-1 rounded-md bg-yellow-100 text-yellow-700 text-xs font-medium">
                              Pending
                            </span>
                          </SelectItem>
                          <SelectItem value="completed">
                            <span className="px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-medium">
                              Completed
                            </span>
                          </SelectItem>
                          <SelectItem value="cancelled">
                            <span className="px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs font-medium">
                              Cancelled
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell className="flex gap-2">
                      <OrderDialog existing={o} onSave={onSave}>
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
                        onClick={() => onDelete(o.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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
  onSave: (o: Order) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Order>(
    existing ?? {
      id: `ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      customer: "",
      items: 1,
      total: 0,
      status: orderStatuses[0],
    }
  );

  function submit() {
    if (!form.customer) return;
    onSave(form);
    setOpen(false);
  }

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
            <Label>Customer</Label>
            <Input
              value={form.customer}
              onChange={(e) =>
                setForm((f) => ({ ...f, customer: e.target.value }))
              }
              className="bg-background"
            />
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            <div className="grid gap-2">
              <Label>Items</Label>
              <Input
                type="number"
                value={form.items}
                onChange={(e) =>
                  setForm((f) => ({ ...f, items: Number(e.target.value) }))
                }
                className="bg-background"
              />
            </div>
            <div className="grid gap-2">
              <Label>Total</Label>
              <Input
                type="number"
                value={form.total}
                onChange={(e) =>
                  setForm((f) => ({ ...f, total: Number(e.target.value) }))
                }
                className="bg-background"
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
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} className="bg-gradient-to-r from-blue-600 to-purple-600">
              {existing ? "Save Changes" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
