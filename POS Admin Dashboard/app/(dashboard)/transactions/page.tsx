"use client";

import type React from "react";

import { useMemo, useState, useEffect } from "react";
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
import {
  initialTransactions,
  type Transaction,
  paymentMethods,
  transactionTypes,
  calculateCustomerCredits,
  type CustomerCredit,
} from "@/lib/mock-data";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2 } from "lucide-react";

export default function TransactionsPage() {
  const [items, setItems] = useState<Transaction[]>(initialTransactions);
  const [q, setQ] = useState("");
  const [method, setMethod] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Calculate credit balances
  const customerCredits = calculateCustomerCredits(items);

  // Handle URL parameters for customer filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const customerParam = urlParams.get("customer");
    if (customerParam) {
      setQ(customerParam);
    }
  }, []);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchQ =
        q.trim().length === 0 ||
        i.customer.toLowerCase().includes(q.toLowerCase());
      const matchMethod = method === "all" || i.method === method;
      const matchType = type === "all" || i.type === type;
      return matchQ && matchMethod && matchType;
    });
  }, [items, q, method, type]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  function onDelete(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function onSave(t: Transaction) {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === t.id);
      return exists
        ? prev.map((p) => (p.id === t.id ? t : p))
        : [{ ...t }, ...prev];
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>
          {q && (
            <p className="text-sm text-muted-foreground mt-1">
              Showing transactions for: <span className="font-medium">{q}</span>
            </p>
          )}
        </div>
        <TransactionDialog onSave={onSave} />
      </header>

      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-3">
              <Input
                placeholder="Search by customer"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                className="w-64 bg-background"
              />
              <Select
                value={method}
                onValueChange={(v) => {
                  setMethod(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-48 bg-background">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  {paymentMethods.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
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
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sale">Sale (Credit)</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.date}</TableCell>
                    <TableCell className="font-medium">{t.customer}</TableCell>
                    <TableCell>
                      <Badge
                        variant={t.type === "sale" ? "destructive" : "default"}
                        className={
                          t.type === "sale" ? "bg-red-600" : "bg-green-600"
                        }
                      >
                        {t.type === "sale" ? "Credit Sale" : "Payment"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{t.method}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          t.type === "sale" ? "text-red-600" : "text-green-600"
                        }
                      >
                        {t.type === "sale" ? "+" : "-"}${t.amount.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {t.description || "-"}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <TransactionDialog existing={t} onSave={onSave}>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 bg-transparent"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TransactionDialog>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 bg-transparent hover:bg-transparent"
                        onClick={() => onDelete(t.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {paged.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No transactions found
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

function TransactionDialog({
  existing,
  onSave,
  children,
}: {
  existing?: Transaction;
  onSave: (t: Transaction) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Transaction>(
    existing ?? {
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      customer: "",
      method: paymentMethods[0],
      amount: 0,
      type: "sale",
      description: "",
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
            Add Transaction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle>
            {existing ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2 md:grid-cols-3">
            <div className="grid gap-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                className="bg-background"
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label>Customer</Label>
              <Input
                value={form.customer}
                onChange={(e) =>
                  setForm((f) => ({ ...f, customer: e.target.value }))
                }
                className="bg-background"
              />
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Method</Label>
              <Select
                value={form.method}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    method: v as Transaction["method"],
                  }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Transaction Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    type: v as Transaction["type"],
                  }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale (Credit)</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Amount</Label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: Number(e.target.value) }))
              }
              className="bg-background"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={form.description || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Optional description..."
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
