"use client";

import type React from "react";

import { useMemo, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchTransactions,
  fetchReceivables,
  createTransaction,
  payReceivable,
  deleteTransaction,
  type Transaction,
} from "@/lib/store/slices/transactionsSlice";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2, Loader2, RefreshCw, DollarSign } from "lucide-react";

const paymentMethods = ["Cash", "Credit", "Card", "Online"];
const transactionTypes: Transaction["type"][] = ["Cash", "Credit"];

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const { items, receivables, loading, error } = useAppSelector(
    (state) => state.transactions
  );

  const [q, setQ] = useState("");
  const [method, setMethod] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchReceivables());
  }, [dispatch]);

  // Handle URL parameters for customer filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const customerParam = urlParams.get("customer");
    if (customerParam) {
      setQ(customerParam);
    }
  }, []);

  // Calculate credit balances from receivables
  const customerCredits = useMemo(() => {
    const creditsMap = new Map<string, { name: string; balance: number }>();
    receivables.forEach((t) => {
      const customerName =
        typeof t.customer === "object" ? t.customer.name : t.customer || "Unknown";
      const existing = creditsMap.get(customerName) || { name: customerName, balance: 0 };
      creditsMap.set(customerName, {
        ...existing,
        balance: existing.balance + (t.amount || 0),
      });
    });
    return Array.from(creditsMap.values());
  }, [receivables]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const customerName =
        typeof i.customer === "object" ? i.customer.name : i.customer || "";
      const matchQ =
        q.trim().length === 0 ||
        customerName.toLowerCase().includes(q.toLowerCase());
      const matchType = type === "all" || i.type === type;
      return matchQ && matchType;
    });
  }, [items, q, type]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      await dispatch(deleteTransaction(id));
  }
  };

  const handleSave = async (transactionData: Partial<Transaction>) => {
    await dispatch(createTransaction(transactionData));
  };

  const handlePayReceivable = async (id: string) => {
    if (confirm("Mark this receivable as paid?")) {
      await dispatch(payReceivable(id));
    }
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
        <div>
          <h1 className="text-2xl font-semibold">Transactions ({items.length})</h1>
          {q && (
            <p className="text-sm text-muted-foreground mt-1">
              Showing transactions for: <span className="font-medium">{q}</span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              dispatch(fetchTransactions());
              dispatch(fetchReceivables());
            }}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <TransactionDialog onSave={handleSave} />
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
                {paged.map((t) => {
                  const customerName =
                    typeof t.customer === "object" ? t.customer.name : t.customer || "N/A";
                  const isCredit = t.type === "Credit";
                  return (
                    <TableRow key={t._id}>
                      <TableCell>
                        {t.createdAt
                          ? new Date(t.createdAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="font-medium">{customerName}</TableCell>
                    <TableCell>
                      <Badge
                          variant={isCredit ? "destructive" : "default"}
                          className={isCredit ? "bg-red-600" : "bg-green-600"}
                      >
                          {isCredit ? "Credit" : "Cash"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant="secondary">{t.type || "N/A"}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                          className={isCredit ? "text-red-600" : "text-green-600"}
                      >
                          {isCredit ? "+" : "-"}${(t.amount || 0).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                        {t.notes || "-"}
                    </TableCell>
                    <TableCell className="flex gap-2">
                        <TransactionDialog existing={t} onSave={handleSave}>
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
                          onClick={() => handleDelete(t._id)}
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

      {/* Receivables Section */}
      {receivables.length > 0 && (
        <Card className="bg-card text-card-foreground border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Receivables ({receivables.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {receivables.slice(0, 10).map((t) => {
                const customerName =
                  typeof t.customer === "object" ? t.customer.name : t.customer || "N/A";
                return (
                  <div
                    key={t._id}
                    className="flex justify-between items-center p-3 border border-orange-200 rounded-lg bg-orange-50"
                  >
                    <div>
                      <p className="font-medium text-sm">{customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.createdAt
                          ? new Date(t.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-red-600">
                          ${(t.amount || 0).toFixed(2)}
                        </p>
                        <Badge variant="destructive" className="text-xs">
                          {t.status}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePayReceivable(t._id)}
                        disabled={loading}
                      >
                        Mark Paid
                      </Button>
                    </div>
                  </div>
                );
              })}
              {receivables.length > 10 && (
                <p className="text-center text-sm text-muted-foreground">
                  And {receivables.length - 10} more receivables...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Credits Summary */}
      {customerCredits.length > 0 && (
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Customer Credit Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {customerCredits.map((credit, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <div>
                    <p className="font-medium text-sm">{credit.name}</p>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    ${credit.balance.toFixed(2)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TransactionDialog({
  existing,
  onSave,
  children,
}: {
  existing?: Transaction;
  onSave: (t: Partial<Transaction>) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Transaction>>(
    existing
      ? {
          customer:
            typeof existing.customer === "object"
              ? existing.customer._id
              : existing.customer,
          amount: existing.amount,
          type: existing.type,
          status: existing.status,
          notes: existing.notes,
        }
      : {
      customer: "",
      amount: 0,
          type: "Cash",
          status: "Pending",
          notes: "",
    }
  );

  const handleSubmit = async () => {
    if (!form.customer || !form.amount) return;
    await onSave(form);
    setOpen(false);
  };

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
            <div className="grid gap-2">
            <Label>Customer ID</Label>
              <Input
              value={form.customer as string || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, customer: e.target.value }))
                }
                className="bg-background"
              placeholder="Customer ID"
              required
              />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
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
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    status: v as Transaction["status"],
                  }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Amount</Label>
            <Input
              type="number"
              step="0.01"
              value={form.amount || 0}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: Number(e.target.value) || 0 }))
              }
              className="bg-background"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={form.notes || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              placeholder="Optional notes..."
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
